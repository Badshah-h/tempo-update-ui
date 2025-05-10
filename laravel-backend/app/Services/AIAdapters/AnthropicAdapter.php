<?php

namespace App\Services\AIAdapters;

class AnthropicAdapter extends BaseAdapter
{
    /**
     * Get the default base URL for this adapter.
     *
     * @return string
     */
    protected function getDefaultBaseUrl(): string
    {
        return 'https://api.anthropic.com';
    }
    
    /**
     * Get the default endpoint for this adapter.
     *
     * @return string
     */
    protected function getDefaultEndpoint(): string
    {
        return 'v1/messages';
    }
    
    /**
     * Get the headers for API requests.
     *
     * @return array
     */
    protected function getHeaders(): array
    {
        return [
            'x-api-key' => $this->apiKey,
            'anthropic-version' => '2023-06-01',
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
        
        $messages = [];
        
        // Add previous messages if provided
        if (isset($options['previous_messages']) && is_array($options['previous_messages'])) {
            foreach ($options['previous_messages'] as $prevMessage) {
                $messages[] = [
                    'role' => $prevMessage['sender'] === 'user' ? 'user' : 'assistant',
                    'content' => $prevMessage['content']
                ];
            }
        }
        
        // Add the current message
        $messages[] = [
            'role' => 'user',
            'content' => $message
        ];
        
        $params = array_merge([
            'model' => $options['model_name'] ?? $this->model->slug,
            'messages' => $messages,
            'max_tokens' => $this->model->max_tokens,
            'temperature' => 0.7,
            'top_p' => 0.9,
        ], $this->defaultParams, $options['parameters'] ?? []);
        
        // Add system prompt if provided
        if (!empty($systemPrompt)) {
            $params['system'] = $systemPrompt;
        }
        
        return $params;
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
        
        if (isset($response['content'][0]['text'])) {
            $content = $response['content'][0]['text'];
        }
        
        $inputTokens = $response['usage']['input_tokens'] ?? 0;
        $outputTokens = $response['usage']['output_tokens'] ?? 0;
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
        // Claude pricing: $8 per million input tokens, $24 per million output tokens
        $inputCost = ($inputTokens / 1000000) * 8;
        $outputCost = ($outputTokens / 1000000) * 24;
        
        return $inputCost + $outputCost;
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
            'summarization',
            'reasoning',
        ];
    }
}