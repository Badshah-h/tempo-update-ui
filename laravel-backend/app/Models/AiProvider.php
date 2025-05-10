<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AiProvider extends Model
{
    protected $fillable = [
        'name',
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
     * Get the model configurations for this provider.
     */
    public function modelConfigs(): HasMany
    {
        return $this->hasMany(AiModelConfig::class);
    }
}
