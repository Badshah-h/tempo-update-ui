<?php

namespace App\Services;

use App\Models\APIKey;
use App\Models\AIProvider;
use Illuminate\Database\Eloquent\Collection;

class APIKeyService
{
    /**
     * Get all API keys.
     *
     * @param bool $activeOnly
     * @return Collection
     */
    public function getAllKeys(bool $activeOnly = false): Collection
    {
        $query = APIKey::with('provider');
        
        if ($activeOnly) {
            $query->where('is_active', true);
        }
        
        return $query->orderBy('created_at', 'desc')->get();
    }
    
    /**
     * Get keys by provider ID.
     *
     * @param int $providerId
     * @param bool $activeOnly
     * @return Collection
     */
    public function getKeysByProvider(int $providerId, bool $activeOnly = false): Collection
    {
        $query = APIKey::where('provider_id', $providerId);
        
        if ($activeOnly) {
            $query->where('is_active', true);
        }
        
        return $query->orderBy('created_at', 'desc')->get();
    }
    
    /**
     * Get a key by ID.
     *
     * @param int $id
     * @return APIKey|null
     */
    public function getKeyById(int $id): ?APIKey
    {
        return APIKey::with('provider')->find($id);
    }
    
    /**
     * Create a new API key.
     *
     * @param array $data
     * @return APIKey
     */
    public function createKey(array $data): APIKey
    {
        return APIKey::create($data);
    }
    
    /**
     * Update an API key.
     *
     * @param int $id
     * @param array $data
     * @return APIKey|null
     */
    public function updateKey(int $id, array $data): ?APIKey
    {
        $key = $this->getKeyById($id);
        
        if (!$key) {
            return null;
        }
        
        $key->update($data);
        return $key;
    }
    
    /**
     * Delete an API key.
     *
     * @param int $id
     * @return bool
     */
    public function deleteKey(int $id): bool
    {
        $key = $this->getKeyById($id);
        
        if (!$key) {
            return false;
        }
        
        return $key->delete();
    }
    
    /**
     * Toggle the active status of a key.
     *
     * @param int $id
     * @return APIKey|null
     */
    public function toggleKeyStatus(int $id): ?APIKey
    {
        $key = $this->getKeyById($id);
        
        if (!$key) {
            return null;
        }
        
        $key->is_active = !$key->is_active;
        $key->save();
        
        return $key;
    }
    
    /**
     * Get the active API key for a provider.
     *
     * @param int $providerId
     * @return APIKey|null
     */
    public function getActiveKeyForProvider(int $providerId): ?APIKey
    {
        return APIKey::where('provider_id', $providerId)
            ->where('is_active', true)
            ->whereNull('expires_at')
            ->orWhere('expires_at', '>', now())
            ->orderBy('created_at', 'desc')
            ->first();
    }
    
    /**
     * Validate an API key with the provider's API.
     *
     * @param int $id
     * @return array
     */
    public function validateKey(int $id): array
    {
        $key = $this->getKeyById($id);
        
        if (!$key) {
            return [
                'valid' => false,
                'message' => 'API key not found',
            ];
        }
        
        $provider = $key->provider;
        
        if (!$provider) {
            return [
                'valid' => false,
                'message' => 'Provider not found',
            ];
        }
        
        // Factory pattern to get the right validator
        $validatorClass = '\App\Services\AIAdapters\' . ucfirst($provider->slug) . 'Validator';
        
        if (!class_exists($validatorClass)) {
            // Fall back to generic validator
            $validatorClass = '\App\Services\AIAdapters\GenericValidator';
            
            if (!class_exists($validatorClass)) {
                return [
                    'valid' => true,
                    'message' => 'No validator available, assuming key is valid',
                ];
            }
        }
        
        $validator = new $validatorClass();
        
        try {
            $result = $validator->validateKey($key->key_value, $provider->base_url);
            
            if ($result['valid']) {
                $key->markAsUsed();
            }
            
            return $result;
        } catch (\Exception $e) {
            return [
                'valid' => false,
                'message' => $e->getMessage(),
            ];
        }
    }
}