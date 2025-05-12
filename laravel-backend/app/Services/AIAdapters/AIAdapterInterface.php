<?php

namespace App\Services\AIAdapters;

interface AIAdapterInterface
{
    /**
     * Generate a response from the AI model.
     *
     * @param string $message
     * @param array $options
     * @return array
     */
    public function generateResponse(string $message, array $options = []): array;

    /**
     * Generate a streaming response from the AI model.
     *
     * @param string $message
     * @param callable $callback
     * @param array $options
     * @return array
     */
    public function generateStreamingResponse(string $message, callable $callback, array $options = []): array;

    /**
     * Get the capabilities of the AI model.
     *
     * @return array
     */
    public function getCapabilities(): array;

    /**
     * Count the number of tokens in a text.
     *
     * @param string $text
     * @return int
     */
    public function countTokens(string $text): int;

    /**
     * Calculate the cost of a request.
     *
     * @param int $inputTokens
     * @param int $outputTokens
     * @return float
     */
    public function calculateCost(int $inputTokens, int $outputTokens): float;
}