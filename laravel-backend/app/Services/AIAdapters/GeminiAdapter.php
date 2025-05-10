<?php

namespace App\Services\AIAdapters;

class GeminiAdapter extends BaseAdapter
{
    /**
     * Get the default base URL for this adapter.
     *
     * @return string
     */
    protected function getDefaultBaseUrl(): string
    {
        return 'https://generativelanguage.googleapis.com';
    }
    
    /**
     * Get the default endpoint for this adapter.
     *
     * @return string
     */
    protected function getDefaultEndpoint(): string
    {
        return 'v1beta/models/gemini-pro:generateContent';
    }
    
    /**
     * Get the headers for API requests.
     *
     * @return array
     */
    protected function getHeaders(): array
    {
        return [
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
        
        $contents = [];
        
        if (!empty($systemPrompt)) {
            $contents[] = [
                'role' => 'system',
                'parts' => [
                    ['text' => $systemPrompt]
                ]
            ];
        }
        
        // Add previous messages if provided
        if (isset($options['previous_messages']) && is_array($options['previous_messages'])) {
            foreach ($options['previous_messages'] as $prevMessage) {
                $contents[] = [
                    'role' => $prevMessage['sender'] === 'user' ? 'user' : 'model',
                    'parts' => [
                        ['text' => $prevMessage['content']]
                    ]
                ];
            }
        }
        
        // Add the current message
        $contents[] = [
            'role' => 'user',
            'parts' => [
                ['text' => $message]
            ]
        ];
        
        $params = [
            'contents' => $contents,
            'generationConfig' => array_merge([
                'temperature' => 0.7,
                'maxOutputTokens' => $this->model->max_tokens,
                'topP' => 0.9,
            ], $this->defaultParams, $options['parameters'] ?? []),
        ];
        
        // Add API key as query parameter
        $params['key'] = $this->apiKey;
        
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
        $promptTokens = 0;
        $completionTokens = 0;
        
        if (isset($response['candidates'][0]['content']['parts'][0]['text'])) {
            $content = $response['candidates'][0]['content']['parts'][0]['text'];
        }
        
        if (isset($response['usageMetadata'])) {
            $promptTokens = $response['usageMetadata']['promptTokenCount'] ?? 0;
            $completionTokens = $response['usageMetadata']['candidatesTokenCount'] ?? 0;
        }
        
        $totalTokens = $promptTokens + $completionTokens;
        
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
        // Gemini Pro pricing: $0.0025 per 1K input tokens, $0.0075 per 1K output tokens
        $inputCost = ($inputTokens / 1000) * 0.0025;
        $outputCost = ($outputTokens / 1000) * 0.0075;
        
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
        ];
    }
}