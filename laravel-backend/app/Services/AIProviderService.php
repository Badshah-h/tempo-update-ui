<?php

namespace App\Services;

use App\Models\AIProvider;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Collection;

class AIProviderService
{
    /**
     * Get all AI providers.
     *
     * @param bool $activeOnly
     * @return Collection
     */
    public function getAllProviders(bool $activeOnly = false): Collection
    {
        $query = AIProvider::query();
        
        if ($activeOnly) {
            $query->where('is_active', true);
        }
        
        return $query->orderBy('name')->get();
    }
    
    /**
     * Get a provider by ID.
     *
     * @param int $id
     * @return AIProvider|null
     */
    public function getProviderById(int $id): ?AIProvider
    {
        return AIProvider::find($id);
    }
    
    /**
     * Get a provider by slug.
     *
     * @param string $slug
     * @return AIProvider|null
     */
    public function getProviderBySlug(string $slug): ?AIProvider
    {
        return AIProvider::where('slug', $slug)->first();
    }
    
    /**
     * Create a new AI provider.
     *
     * @param array $data
     * @return AIProvider
     */
    public function createProvider(array $data): AIProvider
    {
        // Generate slug if not provided
        if (!isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        
        return AIProvider::create($data);
    }
    
    /**
     * Update an AI provider.
     *
     * @param int $id
     * @param array $data
     * @return AIProvider|null
     */
    public function updateProvider(int $id, array $data): ?AIProvider
    {
        $provider = $this->getProviderById($id);
        
        if (!$provider) {
            return null;
        }
        
        // Update slug if name changed and slug not provided
        if (isset($data['name']) && !isset($data['slug']) && $data['name'] !== $provider->name) {
            $data['slug'] = Str::slug($data['name']);
        }
        
        $provider->update($data);
        return $provider;
    }
    
    /**
     * Delete an AI provider.
     *
     * @param int $id
     * @return bool
     */
    public function deleteProvider(int $id): bool
    {
        $provider = $this->getProviderById($id);
        
        if (!$provider) {
            return false;
        }
        
        return $provider->delete();
    }
    
    /**
     * Toggle the active status of a provider.
     *
     * @param int $id
     * @return AIProvider|null
     */
    public function toggleProviderStatus(int $id): ?AIProvider
    {
        $provider = $this->getProviderById($id);
        
        if (!$provider) {
            return null;
        }
        
        $provider->is_active = !$provider->is_active;
        $provider->save();
        
        return $provider;
    }
}