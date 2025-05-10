<?php

namespace App\Services\AIAdapters;

class HuggingFaceAdapter extends BaseAdapter
{
    /**
     * Get the default base URL for this adapter.
     *
     * @return string
     */
    protected function getDefaultBaseUrl(): string
    {
        return 'https://api-inference.huggingface.co';
    }
    
    /**
     * Get the default endpoint for this adapter.
     *
     * @return string
     */
    protected function getDefaultEndpoint(): string
    {
        return 'models/' . $this->model->slug;
    }
    
    /**
     * Get the headers for API requests.
     *
     * @return array
     */
    protected function getHeaders(): array
    {
        return [
            'Authorization' => 'Bearer ' . $this->apiKey,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ];
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
        
        $inputs = $message;
        
        // Add system prompt if provided
        if (!empty($systemPrompt)) {
            $inputs = $systemPrompt . "\n\n" . $inputs;
        }
        
        // Add previous messages if provided
        if (isset($options['previous_messages']) && is_array($options['previous_messages'])) {
            $conversation = '';
            foreach ($options['previous_messages'] as $prevMessage) {
                $role = $prevMessage['sender'] === 'user' ? 'User' : 'Assistant';
                $conversation .= $role . ': ' . $prevMessage['content'] . "\n";
            }
            $inputs = $conversation . 'User: ' . $message;
        }
        
        return array_merge([
            'inputs' => $inputs,
            'parameters' => [
                'max_new_tokens' => $this->model->max_tokens,
                'temperature' => 0.7,
                'top_p' => 0.9,
                'do_sample' => true,
                'return_full_text' => false,
            ],
        ], $this->defaultParams, $options['parameters'] ?? []);
    }
    
    /**
     * Parse the API response.
     *
     * @param array $response
     * @return array
     */
    protected function parseResponse(array $response): array
    {
        $content = '';
        
        if (isset($response[0]['generated_text'])) {
            $content = $response[0]['generated_text'];
        }
        
        // Hugging Face doesn't provide token counts, so we estimate
        $inputTokens = $this->countTokens($response['inputs'] ?? '');
        $outputTokens = $this->countTokens($content);
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
        // Hugging Face Inference API pricing varies by model
        // Using a generic estimate: $0.0004 per 1K tokens (both input and output)
        $totalTokens = $inputTokens + $outputTokens;
        return ($totalTokens / 1000) * 0.0004;
    }
    
    /**
     * Get the capabilities of the AI model.
     *
     * @return array
     */
    public function getCapabilities(): array
    {
        return [
            'text-generation',
            'chat',
            'code-generation',
        ];
    }
}