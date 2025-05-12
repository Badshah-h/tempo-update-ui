<?php

namespace App\Services\AIAdapters;

use App\Models\AIModel;
use App\Models\AiProviderConfig;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Arr;

class DynamicAdapter extends BaseAdapter
{
    protected array $config;
    
    /**
     * Constructor.
     *
     * @param AIModel $model
     * @param string $apiKey
     * @param array|null $config
     */
    public function __construct(AIModel $model, string $apiKey, ?array $config = null)
    {
        parent::__construct($model, $apiKey);
        
        // If config is not provided, try to load it from the database
        if ($config === null) {
            $providerConfig = AiProviderConfig::getActiveForProvider($model->provider_id);
            $this->config = $providerConfig ? $providerConfig->toArray() : [];
        } else {
            $this->config = $config;
        }
    }
    
    /**
     * Get the default base URL for this adapter.
     *
     * @return string
     */
    protected function getDefaultBaseUrl(): string
    {
        return $this->config['endpoints']['base_url'] ?? 'https://api.example.com';
    }
    
    /**
     * Get the default endpoint for this adapter.
     *
     * @return string
     */
    protected function getDefaultEndpoint(): string
    {
        $modelType = $this->model->type ?? 'chat';
        return $this->config['endpoints'][$modelType] ?? 'v1/chat/completions';
    }
    
    /**
     * Get the headers for API requests.
     *
     * @return array
     */
    protected function getHeaders(): array
    {
        $headers = [
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ];
        
        $authType = $this->config['auth_config']['type'] ?? 'bearer';
        $authKey = $this->config['auth_config']['key_name'] ?? 'Authorization';
        
        if ($authType === 'bearer') {
            $headers[$authKey] = 'Bearer ' . $this->apiKey;
        } elseif ($authType === 'header') {
            $headers[$authKey] = $this->apiKey;
        }
        
        // Add any custom headers
        if (isset($this->config['auth_config']['custom_headers']) && is_array($this->config['auth_config']['custom_headers'])) {
            foreach ($this->config['auth_config']['custom_headers'] as $key => $value) {
                $headers[$key] = $value;
            }
        }
        
        return $headers;
    }
    
    /**
     * Get the parameters for the API request.
     *
     * @param string $message
     * @param array $options
     * @return array
     */
    protected function getRequestParams(string $message, array $options = []): array
    {
        $modelType = $this->model->type ?? 'chat';
        $template = $this->config['request_templates'][$modelType] ?? [];
        
        if (empty($template)) {
            // Fallback to a basic template
            return [
                'model' => $this->model->name,
                'messages' => [
                    ['role' => 'user', 'content' => $message]
                ],
                'max_tokens' => $options['max_tokens'] ?? $this->model->max_tokens ?? 1024,
            ];
        }
        
        // Start with the template
        $params = $template;
        
        // Replace placeholders in the template
        $params = $this->replacePlaceholders($params, [
            'model' => $this->model->name,
            'message' => $message,
            'max_tokens' => $options['max_tokens'] ?? $this->model->max_tokens ?? 1024,
            'temperature' => $options['temperature'] ?? 0.7,
            'system_message' => $options['system_message'] ?? $this->model->system_prompt ?? '',
        ]);
        
        // Merge with default parameters and options
        return array_merge($params, $this->defaultParams, $options['parameters'] ?? []);
    }
    
    /**
     * Replace placeholders in the template.
     *
     * @param array $template
     * @param array $values
     * @return array
     */
    protected function replacePlaceholders(array $template, array $values): array
    {
        $result = [];
        
        foreach ($template as $key => $value) {
            if (is_array($value)) {
                $result[$key] = $this->replacePlaceholders($value, $values);
            } elseif (is_string($value) && strpos($value, '{{') !== false) {
                // Replace {{placeholder}} with actual value
                foreach ($values as $placeholder => $replacement) {
                    $pattern = '/{{\s*' . preg_quote($placeholder, '/') . '\s*}}/';
                    $value = preg_replace($pattern, $replacement, $value);
                }
                $result[$key] = $value;
            } else {
                $result[$key] = $value;
            }
        }
        
        return $result;
    }
    
    /**
     * Parse the API response.
     *
     * @param array $response
     * @return array
     */
    protected function parseResponse(array $response): array
    {
        $modelType = $this->model->type ?? 'chat';
        $mappings = $this->config['response_mappings'][$modelType] ?? [];
        
        if (empty($mappings)) {
            // Fallback to a basic mapping
            $content = $response['choices'][0]['message']['content'] ?? '';
            $promptTokens = $response['usage']['prompt_tokens'] ?? 0;
            $completionTokens = $response['usage']['completion_tokens'] ?? 0;
            $totalTokens = $response['usage']['total_tokens'] ?? 0;
        } else {
            // Use the configured mappings
            $content = $this->extractValueByPath($response, $mappings['content_path'] ?? 'choices.0.message.content');
            $promptTokens = $this->extractValueByPath($response, $mappings['prompt_tokens_path'] ?? 'usage.prompt_tokens', 0);
            $completionTokens = $this->extractValueByPath($response, $mappings['completion_tokens_path'] ?? 'usage.completion_tokens', 0);
            $totalTokens = $this->extractValueByPath($response, $mappings['total_tokens_path'] ?? 'usage.total_tokens', 0);
        }
        
        return [
            'content' => $content,
            'usage' => [
                'prompt_tokens' => $promptTokens,
                'completion_tokens' => $completionTokens,
                'total_tokens' => $totalTokens,
                'cost' => $this->calculateCost($promptTokens, $completionTokens),
            ],
        ];
    }
    
    /**
     * Extract a value from an array using a dot notation path.
     *
     * @param array $array
     * @param string $path
     * @param mixed $default
     * @return mixed
     */
    protected function extractValueByPath(array $array, string $path, $default = '')
    {
        return Arr::get($array, $path, $default);
    }
    
    /**
     * Parse a streaming chunk from the API response.
     *
     * @param string $chunk
     * @return string
     */
    protected function parseStreamChunk(string $chunk): string
    {
        $streamConfig = $this->config['stream_config'] ?? [];
        
        if (empty($streamConfig)) {
            // Fallback to a basic SSE parsing
            if (empty($chunk) || $chunk === "data: [DONE]") {
                return '';
            }
            
            // Remove the "data: " prefix
            $chunk = str_replace('data: ', '', $chunk);
            
            try {
                $data = json_decode($chunk, true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    return '';
                }
                
                return $data['choices'][0]['delta']['content'] ?? '';
            } catch (\Exception $e) {
                return '';
            }
        }
        
        // Use the configured stream parsing
        $prefix = $streamConfig['prefix'] ?? 'data: ';
        $doneMark = $streamConfig['done_mark'] ?? 'data: [DONE]';
        $contentPath = $streamConfig['content_path'] ?? 'choices.0.delta.content';
        
        if (empty($chunk) || $chunk === $doneMark) {
            return '';
        }
        
        // Remove the prefix
        $chunk = str_replace($prefix, '', $chunk);
        
        try {
            $data = json_decode($chunk, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                return '';
            }
            
            return $this->extractValueByPath($data, $contentPath, '');
        } catch (\Exception $e) {
            return '';
        }
    }
    
    /**
     * Count the number of tokens in a message.
     *
     * @param string $message
     * @return int
     */
    public function countTokens(string $message): int
    {
        $tokenConfig = $this->config['token_calculation'] ?? [];
        
        if (empty($tokenConfig) || ($tokenConfig['method'] ?? '') === 'ratio') {
            // Use the ratio method (characters per token)
            $ratio = $tokenConfig['ratio'] ?? 4; // Default: 4 characters per token
            return (int) ceil(mb_strlen($message) / $ratio);
        }
        
        // For more complex token counting, we would implement other methods here
        // such as using a tokenizer library or calling an API
        
        // Fallback to the basic ratio method
        return (int) ceil(mb_strlen($message) / 4);
    }
    
    /**
     * Calculate the cost of a request.
     *
     * @param int $inputTokens
     * @param int $outputTokens
     * @return float
     */
    public function calculateCost(int $inputTokens, int $outputTokens): float
    {
        $costConfig = $this->config['cost_calculation'] ?? [];
        
        if (empty($costConfig)) {
            // Fallback to a basic cost calculation
            $inputRate = 0.002; // $0.002 per 1K input tokens
            $outputRate = 0.002; // $0.002 per 1K output tokens
        } else {
            // Use the configured rates
            $inputRate = $costConfig['input_rate'] ?? 0.002;
            $outputRate = $costConfig['output_rate'] ?? 0.002;
        }
        
        $inputCost = ($inputTokens / 1000) * $inputRate;
        $outputCost = ($outputTokens / 1000) * $outputRate;
        
        return $inputCost + $outputCost;
    }
    
    /**
     * Get the capabilities of the AI model.
     *
     * @return array
     */
    public function getCapabilities(): array
    {
        return $this->model->capabilities ?? [
            'text-generation',
            'chat',
        ];
    }
}
