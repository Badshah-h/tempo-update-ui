<?php

namespace App\Services\AIAdapters;

use Illuminate\Support\Facades\Http;

class GenericAdapter extends BaseAdapter
{
    /**
     * Get the default base URL for this adapter.
     *
     * @return string
     */
    protected function getDefaultBaseUrl(): string
    {
        return $this->model->provider->base_url ?? 'https://api.example.com';
    }
    
    /**
     * Get the default endpoint for this adapter.
     *
     * @return string
     */
    protected function getDefaultEndpoint(): string
    {
        return $this->model->api_endpoint ?? 'v1/completions';
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
        $systemPrompt = $options['system_prompt'] ?? $this->model->system_prompt ?? '';
        
        $params = [
            'prompt' => $message,
            'max_tokens' => $this->model->max_tokens,
            'temperature' => 0.7,
        ];
        
        if (!empty($systemPrompt)) {
            $params['system_prompt'] = $systemPrompt;
        }
        
        return array_merge($params, $this->defaultParams, $options['parameters'] ?? []);
    }
    
    /**
     * Parse the API response.
     *
     * @param array $response
     * @return array
     */
    protected function parseResponse(array $response): array
    {
        // Try to extract content from common response formats
        $content = '';
        
        if (isset($response['choices'][0]['text'])) {
            $content = $response['choices'][0]['text'];
        } elseif (isset($response['choices'][0]['message']['content'])) {
            $content = $response['choices'][0]['message']['content'];
        } elseif (isset($response['output'])) {
            $content = $response['output'];
        } elseif (isset($response['generated_text'])) {
            $content = $response['generated_text'];
        } elseif (isset($response['result'])) {
            $content = is_string($response['result']) ? $response['result'] : json_encode($response['result']);
        } elseif (isset($response['response'])) {
            $content = is_string($response['response']) ? $response['response'] : json_encode($response['response']);
        }
        
        // Try to extract token usage from common response formats
        $inputTokens = 0;
        $outputTokens = 0;
        
        if (isset($response['usage']['prompt_tokens'])) {
            $inputTokens = $response['usage']['prompt_tokens'];
        }
        
        if (isset($response['usage']['completion_tokens'])) {
            $outputTokens = $response['usage']['completion_tokens'];
        }
        
        // If no token counts provided, estimate them
        if ($inputTokens === 0) {
            $inputTokens = $this->countTokens($response['prompt'] ?? '');
        }
        
        if ($outputTokens === 0) {
            $outputTokens = $this->countTokens($content);
        }
        
        $totalTokens = $inputTokens + $outputTokens;
        
        return [
            'content' => $content,
            'usage' => [
                'prompt_tokens' => $inputTokens,
                'completion_tokens' => $outputTokens,
                'total_tokens' => $totalTokens,
                'cost' => $this->calculateCost($inputTokens, $outputTokens),
            ],
        ];
    }
    
    /**
     * Count the number of tokens in a message.
     *
     * @param string $message
     * @return int
     */
    protected function countTokens(string $message): int
    {
        // Simple approximation: 1 token ≈ 4 characters
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
        // Generic estimate: $0.001 per 1K tokens (both input and output)
        $totalTokens = $inputTokens + $outputTokens;
        return ($totalTokens / 1000) * 0.001;
    }
    
    /**
     * Get the capabilities of the AI model.
     *
     * @return array
     */
    public function getCapabilities(): array
    {
        return $this->model->capabilities ?? ['text-generation'];
    }
}