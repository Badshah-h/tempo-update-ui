<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AIProvider extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'base_url',
        'logo_url',
        'capabilities',
        'is_active',
    ];

    protected $casts = [
        'capabilities' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the models for the provider.
     */
    public function models(): HasMany
    {
        return $this->hasMany(AIModel::class, 'provider_id');
    }

    /**
     * Get the API keys for the provider.
     */
    public function apiKeys(): HasMany
    {
        return $this->hasMany(APIKey::class, 'provider_id');
    }

    /**
     * Get the active API key for the provider.
     */
    public function getActiveApiKeyAttribute()
    {
        return $this->apiKeys()->where('is_active', true)->first();
    }
}