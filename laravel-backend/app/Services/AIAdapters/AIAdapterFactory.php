<?php

namespace App\Services\AIAdapters;

use App\Models\AIModel;
use App\Models\AiProviderConfig;
use Illuminate\Support\Str;

class AIAdapterFactory
{
    /**
     * Create an AI adapter for the given model.
     *
     * @param AIModel $model
     * @param string $apiKey
     * @return AIAdapterInterface|null
     */
    public static function createAdapter(AIModel $model, string $apiKey): ?AIAdapterInterface
    {
        $provider = $model->provider;
        
        if (!$provider || !$provider->is_active) {
            return null;
        }
        
        // Try to find a specific adapter class for this provider
        $adapterClass = self::getAdapterClass($provider->slug);
        
        if (class_exists($adapterClass)) {
            // Use the specific adapter
            return new $adapterClass($model, $apiKey);
        }
        
        // If no specific adapter exists, try to use the dynamic adapter
        $config = AiProviderConfig::getActiveForProvider($provider->id);
        
        if ($config) {
            // Use the dynamic adapter with the configuration
            return new DynamicAdapter($model, $apiKey, $config->toArray());
        }
        
        // If no configuration exists, use the dynamic adapter with default settings
        return new DynamicAdapter($model, $apiKey);
    }
    
    /**
     * Get the adapter class name for a provider.
     *
     * @param string $providerSlug
     * @return string
     */
    protected static function getAdapterClass(string $providerSlug): string
    {
        return '\\App\\Services\\AIAdapters\\' . Str::studly($providerSlug) . 'Adapter';
    }
}
