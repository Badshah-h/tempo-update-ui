<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;

class APIKey extends Model
{
    use HasFactory;

    protected $fillable = [
        'provider_id',
        'key_name',
        'key_value',
        'is_active',
        'last_used_at',
        'expires_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'last_used_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    /**
     * Get the provider that owns the API key.
     */
    public function provider(): BelongsTo
    {
        return $this->belongsTo(AIProvider::class, 'provider_id');
    }

    /**
     * Set the key value attribute.
     *
     * @param string $value
     * @return void
     */
    public function setKeyValueAttribute($value)
    {
        $this->attributes['key_value'] = Crypt::encryptString($value);
    }

    /**
     * Get the key value attribute.
     *
     * @param string $value
     * @return string
     */
    public function getKeyValueAttribute($value)
    {
        try {
            return Crypt::decryptString($value);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Update the last used timestamp.
     *
     * @return bool
     */
    public function markAsUsed()
    {
        return $this->update([
            'last_used_at' => now(),
        ]);
    }

    /**
     * Scope a query to only include active API keys.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }
}