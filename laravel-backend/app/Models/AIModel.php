<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AIModel extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'ai_models';

    protected $fillable = [
        'provider_id',
        'name',
        'slug',
        'type',
        'capabilities',
        'context_types',
        'max_tokens',
        'api_endpoint',
        'default_parameters',
        'system_prompt',
        'is_active',
        'is_default',
    ];

    protected $casts = [
        'capabilities' => 'array',
        'context_types' => 'array',
        'default_parameters' => 'array',
        'is_active' => 'boolean',
        'is_default' => 'boolean',
    ];

    /**
     * Get the provider that owns the model.
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(AIProvider::class, 'provider_id');
    }

    /**
     * Get the routing rules that target this model.
     */
    public function routingRules(): HasMany
    {
        return $this->hasMany(RoutingRule::class, 'target_model_id');
    }

    /**
     * Get the usage statistics for this model.
     */
    public function usageStats(): HasMany
    {
        return $this->hasMany(ModelUsageStat::class, 'model_id');
    }

    /**
     * Scope a query to only include active models.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include default models.
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }
}