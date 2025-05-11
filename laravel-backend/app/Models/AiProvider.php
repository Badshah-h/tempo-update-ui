<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AiProvider extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'slug',
        'description',
        'logo_url',
        'is_active',
        'auth_requirements',
        'available_models',
        'default_parameters',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'auth_requirements' => 'array',
        'available_models' => 'array',
        'default_parameters' => 'array',
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