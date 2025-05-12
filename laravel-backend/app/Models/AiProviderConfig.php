<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiProviderConfig extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'provider_id',
        'version',
        'auth_config',
        'endpoints',
        'request_templates',
        'response_mappings',
        'parameter_schema',
        'stream_config',
        'token_calculation',
        'cost_calculation',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'auth_config' => 'array',
        'endpoints' => 'array',
        'request_templates' => 'array',
        'response_mappings' => 'array',
        'parameter_schema' => 'array',
        'stream_config' => 'array',
        'token_calculation' => 'array',
        'cost_calculation' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get the provider that owns the configuration.
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(AiProvider::class, 'provider_id');
    }

    /**
     * Get the active configuration for a provider.
     *
     * @param int $providerId
     * @return self|null
     */
    public static function getActiveForProvider(int $providerId): ?self
    {
        return self::where('provider_id', $providerId)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Set this configuration as active and deactivate others.
     *
     * @return bool
     */
    public function setAsActive(): bool
    {
        // Deactivate all other configurations for this provider
        self::where('provider_id', $this->provider_id)
            ->where('id', '!=', $this->id)
            ->update(['is_active' => false]);

        // Set this one as active
        $this->is_active = true;
        return $this->save();
    }
}
