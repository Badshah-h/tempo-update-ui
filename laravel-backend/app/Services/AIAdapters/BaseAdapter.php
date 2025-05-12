<?php

namespace App\Services\AIAdapters;

use App\Models\AIModel;
use App\Models\ModelUsageStat;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

abstract class BaseAdapter implements AIAdapterInterface
{
    protected AIModel $model;
    protected string $apiKey;
    protected array $defaultParams;

    /**
     * Constructor.
     *
     * @param AIModel $model
     * @param string $apiKey
     */
    public function __construct(AIModel $model, string $apiKey)
    {
        $this->model = $model;
        $this->apiKey = $apiKey;
        $this->defaultParams = $model->default_parameters ?? [];
    }

    /**
     * Get the base URL for API requests.
     *
     * @return string
     */
    protected function getBaseUrl(): string
    {
        return $this->model->provider->base_url ?? $this->getDefaultBaseUrl();
    }

    /**
     * Get the default base URL for this adapter.
     *
     * @return string
     */
    abstract protected function getDefaultBaseUrl(): string;

    /**
     * Get the endpoint for generating completions.
     *
     * @return string
     */
    protected function getEndpoint(): string
    {
        return $this->model->api_endpoint ?? $this->getDefaultEndpoint();
    }

    /**
     * Get the default endpoint for this adapter.
     *
     * @return string
     */
    abstract protected function getDefaultEndpoint(): string;

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
    abstract protected function getRequestParams(string $message, array $options = []): array;

    /**
     * Parse the API response.
     *
     * @param array $response
     * @return array
     */
    abstract protected function parseResponse(array $response): array;

    /**
     * Count the number of tokens in a message.
     *
     * @param string $message
     * @return int
     */
    public function countTokens(string $message): int
    {
        // Default implementation - should be overridden by specific adapters
        // This is a very rough estimate (1 token ≈ 4 chars)
        return (int) ceil(mb_strlen($message) / 4);
    }

    /**
     * Generate a response from the AI model.
     *
     * @param string $message
     * @param array $options
     * @return array
     */
    public function generateResponse(string $message, array $options = []): array
    {
        $url = rtrim($this->getBaseUrl(), '/') . '/' . ltrim($this->getEndpoint(), '/');
        $params = $this->getRequestParams($message, $options);

        $startTime = microtime(true);

        try {
            $response = Http::withHeaders($this->getHeaders())
                ->timeout(30)
                ->post($url, $params)
                ->throw()
                ->json();

            $endTime = microtime(true);
            $responseTime = $endTime - $startTime;

            $result = $this->parseResponse($response);

            // Record usage statistics
            $this->recordUsage(
                $result['usage']['prompt_tokens'] ?? 0,
                $result['usage']['completion_tokens'] ?? 0,
                $responseTime,
                true
            );

            return $result;
        } catch (\Exception $e) {
            $endTime = microtime(true);
            $responseTime = $endTime - $startTime;

            // Record failed usage
            $this->recordUsage(
                $this->countTokens($message),
                0,
                $responseTime,
                false
            );

            Log::error('AI Adapter Error: ' . $e->getMessage(), [
                'model' => $this->model->name,
                'provider' => $this->model->provider->name,
                'message' => $message,
            ]);

            throw $e;
        }
    }

    /**
     * Generate a streaming response from the AI model.
     *
     * @param string $message
     * @param callable $callback
     * @param array $options
     * @return array
     */
    public function generateStreamingResponse(string $message, callable $callback, array $options = []): array
    {
        $url = rtrim($this->getBaseUrl(), '/') . '/' . ltrim($this->getEndpoint(), '/');
        $params = $this->getRequestParams($message, array_merge($options, ['stream' => true]));

        $startTime = microtime(true);
        $totalOutput = '';
        $outputTokens = 0;

        try {
            Http::withHeaders($this->getHeaders())
                ->timeout(60)
                ->withOptions(['stream' => true])
                ->post($url, $params)
                ->throw()
                ->then(function ($response) use ($callback, &$totalOutput, &$outputTokens) {
                    $response->body()->each(function ($chunk) use ($callback, &$totalOutput, &$outputTokens) {
                        if (empty($chunk)) {
                            return;
                        }

                        // Parse the chunk according to the provider's format
                        $parsed = $this->parseStreamChunk($chunk);

                        if (!empty($parsed)) {
                            $totalOutput .= $parsed;
                            $outputTokens = $this->countTokens($totalOutput);
                            $callback($parsed);
                        }
                    });
                });

            $endTime = microtime(true);
            $responseTime = $endTime - $startTime;

            $inputTokens = $this->countTokens($message);

            // Record usage statistics
            $this->recordUsage(
                $inputTokens,
                $outputTokens,
                $responseTime,
                true
            );

            return [
                'content' => $totalOutput,
                'usage' => [
                    'prompt_tokens' => $inputTokens,
                    'completion_tokens' => $outputTokens,
                    'total_tokens' => $inputTokens + $outputTokens,
                    'cost' => $this->calculateCost($inputTokens, $outputTokens),
                ],
            ];
        } catch (\Exception $e) {
            $endTime = microtime(true);
            $responseTime = $endTime - $startTime;

            // Record failed usage
            $this->recordUsage(
                $this->countTokens($message),
                0,
                $responseTime,
                false
            );

            Log::error('AI Adapter Streaming Error: ' . $e->getMessage(), [
                'model' => $this->model->name,
                'provider' => $this->model->provider->name,
                'message' => $message,
            ]);

            throw $e;
        }
    }

    /**
     * Parse a streaming chunk from the API response.
     *
     * @param string $chunk
     * @return string
     */
    protected function parseStreamChunk(string $chunk): string
    {
        // Default implementation - should be overridden by specific adapters
        return $chunk;
    }

    /**
     * Record usage statistics.
     *
     * @param int $inputTokens
     * @param int $outputTokens
     * @param float $responseTime
     * @param bool $success
     * @return void
     */
    protected function recordUsage(int $inputTokens, int $outputTokens, float $responseTime, bool $success): void
    {
        try {
            $totalTokens = $inputTokens + $outputTokens;
            $cost = $this->calculateCost($inputTokens, $outputTokens);

            $usageStat = ModelUsageStat::getOrCreateForToday($this->model->id);
            $usageStat->incrementUsage($totalTokens, $responseTime, $cost, $success);
        } catch (\Exception $e) {
            Log::error('Failed to record usage statistics: ' . $e->getMessage());
        }
    }
}