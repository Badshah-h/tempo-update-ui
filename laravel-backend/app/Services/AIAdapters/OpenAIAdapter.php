<?php

namespace App\Services\AIAdapters;

class OpenAIAdapter extends BaseAdapter
{
    /**
     * Get the default base URL for this adapter.
     *
     * @return string
     */
    protected function getDefaultBaseUrl(): string
    {
        return 'https://api.openai.com';
    }
    
    /**
     * Get the default endpoint for this adapter.
     *
     * @return string
     */
    protected function getDefaultEndpoint(): string
    {
        return 'v1/chat/completions';
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
        
        if (!empty($systemPrompt)) {
            $messages[] = [
                'role' => 'system',
                'content' => $systemPrompt
            ];
        }
        
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
        
        return array_merge([
            'model' => $options['model_name'] ?? $this->model->slug,
            'messages' => $messages,
            'temperature' => 0.7,
            'max_tokens' => $this->model->max_tokens,
            'top_p' => 0.9,
            'presence_penalty' => 0,
            'frequency_penalty' => 0,
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
        
        if (isset($response['choices'][0]['message']['content'])) {
            $content = $response['choices'][0]['message']['content'];
        }
        
        $promptTokens = $response['usage']['prompt_tokens'] ?? 0;
        $completionTokens = $response['usage']['completion_tokens'] ?? 0;
        $totalTokens = $response['usage']['total_tokens'] ?? 0;
        
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
        // GPT-3.5 pricing: $0.0015 per 1K input tokens, $0.002 per 1K output tokens
        // GPT-4 pricing: $0.03 per 1K input tokens, $0.06 per 1K output tokens
        
        // Default to GPT-3.5 pricing
        $inputRate = 0.0015;
        $outputRate = 0.002;
        
        // Check if this is a GPT-4 model
        if (stripos($this->model->slug, 'gpt-4') !== false) {
            $inputRate = 0.03;
            $outputRate = 0.06;
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
        return [
            'text-generation',
            'chat',
            'summarization',
            'code-generation',
        ];
    }
}