<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiModelConfig extends Model
{
    protected $fillable = [
        'ai_provider_id',
        'name',
        'model_id',
        'type',
        'is_active',
        'credentials',
        'parameters',
        'system_prompt',
        'cost_per_query',
        'performance_score',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'credentials' => 'array',
        'parameters' => 'array',
        'cost_per_query' => 'decimal:6',
        'performance_score' => 'integer',
    ];

    /**
     * Get the provider that owns this model configuration.
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(AiProvider::class, 'ai_provider_id');
    }
}
