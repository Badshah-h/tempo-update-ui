<?php

namespace App\Services;

use App\Models\AiProvider;
use App\Models\AiProviderConfig;
use App\Models\AIModel;
use App\Services\AIAdapters\DynamicAdapter;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AiProviderConfigService
{
    /**
     * Get all provider configurations.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllConfigs()
    {
        return AiProviderConfig::with('provider')->get();
    }
    
    /**
     * Get configurations for a specific provider.
     *
     * @param int $providerId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getConfigsForProvider(int $providerId)
    {
        return AiProviderConfig::where('provider_id', $providerId)
            ->with('provider')
            ->get();
    }
    
    /**
     * Get a configuration by ID.
     *
     * @param int $id
     * @return AiProviderConfig|null
     */
    public function getConfigById(int $id): ?AiProviderConfig
    {
        return AiProviderConfig::with('provider')->find($id);
    }
    
    /**
     * Get the active configuration for a provider.
     *
     * @param int $providerId
     * @return AiProviderConfig|null
     */
    public function getActiveConfigForProvider(int $providerId): ?AiProviderConfig
    {
        return AiProviderConfig::getActiveForProvider($providerId);
    }
    
    /**
     * Create a new provider configuration.
     *
     * @param array $data
     * @return AiProviderConfig
     * @throws ValidationException
     */
    public function createConfig(array $data): AiProviderConfig
    {
        $this->validateConfig($data);
        
        // If this is set as active, deactivate other configs
        $isActive = $data['is_active'] ?? true;
        if ($isActive) {
            AiProviderConfig::where('provider_id', $data['provider_id'])
                ->update(['is_active' => false]);
        }
        
        return AiProviderConfig::create($data);
    }
    
    /**
     * Update a provider configuration.
     *
     * @param int $id
     * @param array $data
     * @return AiProviderConfig|null
     * @throws ValidationException
     */
    public function updateConfig(int $id, array $data): ?AiProviderConfig
    {
        $config = $this->getConfigById($id);
        
        if (!$config) {
            return null;
        }
        
        $this->validateConfig($data, $id);
        
        // If this is set as active, deactivate other configs
        $isActive = $data['is_active'] ?? $config->is_active;
        if ($isActive && !$config->is_active) {
            AiProviderConfig::where('provider_id', $config->provider_id)
                ->where('id', '!=', $id)
                ->update(['is_active' => false]);
        }
        
        $config->update($data);
        return $config;
    }
    
    /**
     * Delete a provider configuration.
     *
     * @param int $id
     * @return bool
     */
    public function deleteConfig(int $id): bool
    {
        $config = $this->getConfigById($id);
        
        if (!$config) {
            return false;
        }
        
        return $config->delete();
    }
    
    /**
     * Set a configuration as active.
     *
     * @param int $id
     * @return AiProviderConfig|null
     */
    public function setConfigAsActive(int $id): ?AiProviderConfig
    {
        $config = $this->getConfigById($id);
        
        if (!$config) {
            return null;
        }
        
        $config->setAsActive();
        return $config;
    }
    
    /**
     * Test a provider configuration with a sample query.
     *
     * @param int $id
     * @param string $query
     * @param array $options
     * @return array
     */
    public function testConfig(int $id, string $query, array $options = []): array
    {
        $config = $this->getConfigById($id);
        
        if (!$config) {
            return [
                'success' => false,
                'message' => 'Configuration not found',
            ];
        }
        
        // Find a model for this provider
        $model = AIModel::where('provider_id', $config->provider_id)
            ->where('is_active', true)
            ->first();
            
        if (!$model) {
            return [
                'success' => false,
                'message' => 'No active model found for this provider',
            ];
        }
        
        // Get API key
        $provider = $config->provider;
        $apiKey = $options['api_key'] ?? null;
        
        if (!$apiKey && $provider) {
            // Try to get the API key from the provider
            $apiKey = $provider->api_key ?? null;
        }
        
        if (!$apiKey) {
            return [
                'success' => false,
                'message' => 'API key is required for testing',
            ];
        }
        
        try {
            // Create a dynamic adapter with this configuration
            $adapter = new DynamicAdapter($model, $apiKey, $config->toArray());
            
            $startTime = microtime(true);
            $response = $adapter->generateResponse($query, $options);
            $endTime = microtime(true);
            
            $responseTime = round($endTime - $startTime, 2);
            
            return [
                'success' => true,
                'response' => $response['content'],
                'metrics' => [
                    'time' => $responseTime . 's',
                    'tokens' => $response['usage']['total_tokens'] ?? 0,
                    'cost' => $response['usage']['cost'] ?? 0,
                ],
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }
    
    /**
     * Create a new provider with configuration.
     *
     * @param array $data
     * @return array
     * @throws ValidationException
     */
    public function createProviderWithConfig(array $data): array
    {
        // Validate provider data
        $providerValidator = Validator::make($data['provider'], [
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:ai_providers,slug',
            'description' => 'nullable|string',
            'logo_url' => 'nullable|string|max:255',
            'is_active' => 'nullable|boolean',
        ]);
        
        if ($providerValidator->fails()) {
            throw new ValidationException($providerValidator);
        }
        
        // Generate slug if not provided
        if (!isset($data['provider']['slug'])) {
            $data['provider']['slug'] = Str::slug($data['provider']['name']);
        }
        
        // Create the provider
        $provider = AiProvider::create($data['provider']);
        
        // Add provider_id to config data
        $data['config']['provider_id'] = $provider->id;
        
        // Create the configuration
        $config = $this->createConfig($data['config']);
        
        return [
            'provider' => $provider,
            'config' => $config,
        ];
    }
    
    /**
     * Validate configuration data.
     *
     * @param array $data
     * @param int|null $id
     * @throws ValidationException
     */
    protected function validateConfig(array $data, ?int $id = null): void
    {
        $validator = Validator::make($data, [
            'provider_id' => 'required|exists:ai_providers,id',
            'version' => 'nullable|string|max:50',
            'auth_config' => 'nullable|array',
            'endpoints' => 'nullable|array',
            'request_templates' => 'nullable|array',
            'response_mappings' => 'nullable|array',
            'parameter_schema' => 'nullable|array',
            'stream_config' => 'nullable|array',
            'token_calculation' => 'nullable|array',
            'cost_calculation' => 'nullable|array',
            'is_active' => 'nullable|boolean',
        ]);
        
        if ($validator->fails()) {
            throw new ValidationException($validator);
        }
    }
    
    /**
     * Get default configuration templates for common providers.
     *
     * @return array
     */
    public function getDefaultTemplates(): array
    {
        return [
            'openai' => $this->getOpenAITemplate(),
            'anthropic' => $this->getAnthropicTemplate(),
            'gemini' => $this->getGeminiTemplate(),
        ];
    }
    
    /**
     * Get a default template for OpenAI.
     *
     * @return array
     */
    protected function getOpenAITemplate(): array
    {
        return [
            'auth_config' => [
                'type' => 'bearer',
                'key_name' => 'Authorization',
            ],
            'endpoints' => [
                'base_url' => 'https://api.openai.com',
                'chat' => 'v1/chat/completions',
                'embedding' => 'v1/embeddings',
            ],
            'request_templates' => [
                'chat' => [
                    'model' => '{{model}}',
                    'messages' => [
                        ['role' => 'system', 'content' => '{{system_message}}'],
                        ['role' => 'user', 'content' => '{{message}}'],
                    ],
                    'max_tokens' => '{{max_tokens}}',
                    'temperature' => '{{temperature}}',
                ],
            ],
            'response_mappings' => [
                'chat' => [
                    'content_path' => 'choices.0.message.content',
                    'prompt_tokens_path' => 'usage.prompt_tokens',
                    'completion_tokens_path' => 'usage.completion_tokens',
                    'total_tokens_path' => 'usage.total_tokens',
                ],
            ],
            'stream_config' => [
                'prefix' => 'data: ',
                'done_mark' => 'data: [DONE]',
                'content_path' => 'choices.0.delta.content',
            ],
            'token_calculation' => [
                'method' => 'ratio',
                'ratio' => 4,
            ],
            'cost_calculation' => [
                'input_rate' => 0.0015,
                'output_rate' => 0.002,
            ],
        ];
    }
    
    /**
     * Get a default template for Anthropic.
     *
     * @return array
     */
    protected function getAnthropicTemplate(): array
    {
        return [
            'auth_config' => [
                'type' => 'header',
                'key_name' => 'x-api-key',
            ],
            'endpoints' => [
                'base_url' => 'https://api.anthropic.com',
                'chat' => 'v1/messages',
            ],
            'request_templates' => [
                'chat' => [
                    'model' => '{{model}}',
                    'messages' => [
                        ['role' => 'user', 'content' => '{{message}}'],
                    ],
                    'system' => '{{system_message}}',
                    'max_tokens' => '{{max_tokens}}',
                ],
            ],
            'response_mappings' => [
                'chat' => [
                    'content_path' => 'content.0.text',
                    'prompt_tokens_path' => 'usage.input_tokens',
                    'completion_tokens_path' => 'usage.output_tokens',
                ],
            ],
            'stream_config' => [
                'prefix' => 'data: ',
                'done_mark' => 'data: [DONE]',
                'content_path' => 'delta.text',
            ],
            'token_calculation' => [
                'method' => 'ratio',
                'ratio' => 4,
            ],
            'cost_calculation' => [
                'input_rate' => 0.008,
                'output_rate' => 0.024,
            ],
        ];
    }
    
    /**
     * Get a default template for Google Gemini.
     *
     * @return array
     */
    protected function getGeminiTemplate(): array
    {
        return [
            'auth_config' => [
                'type' => 'query',
                'key_name' => 'key',
            ],
            'endpoints' => [
                'base_url' => 'https://generativelanguage.googleapis.com',
                'chat' => 'v1beta/models/gemini-pro:generateContent',
            ],
            'request_templates' => [
                'chat' => [
                    'contents' => [
                        [
                            'role' => 'user',
                            'parts' => [
                                ['text' => '{{message}}'],
                            ],
                        ],
                    ],
                    'generationConfig' => [
                        'maxOutputTokens' => '{{max_tokens}}',
                        'temperature' => '{{temperature}}',
                    ],
                ],
            ],
            'response_mappings' => [
                'chat' => [
                    'content_path' => 'candidates.0.content.parts.0.text',
                    'prompt_tokens_path' => 'usageMetadata.promptTokenCount',
                    'completion_tokens_path' => 'usageMetadata.candidatesTokenCount',
                ],
            ],
            'stream_config' => [
                'prefix' => 'data: ',
                'done_mark' => 'data: [DONE]',
                'content_path' => 'candidates.0.content.parts.0.text',
            ],
            'token_calculation' => [
                'method' => 'ratio',
                'ratio' => 4,
            ],
            'cost_calculation' => [
                'input_rate' => 0.0005,
                'output_rate' => 0.0005,
            ],
        ];
    }
}
