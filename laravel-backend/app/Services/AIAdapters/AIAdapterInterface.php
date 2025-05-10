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
     * Get the capabilities of the AI model.
     *
     * @return array
     */
    public function getCapabilities(): array;
    
    /**
     * Calculate the cost of a request.
     *
     * @param int $inputTokens
     * @param int $outputTokens
     * @return float
     */
    public function calculateCost(int $inputTokens, int $outputTokens): float;
}