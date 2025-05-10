<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModelUsageStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'model_id',
        'date',
        'request_count',
        'token_count',
        'average_response_time',
        'cost',
        'success_count',
        'error_count',
    ];

    protected $casts = [
        'date' => 'date',
        'request_count' => 'integer',
        'token_count' => 'integer',
        'average_response_time' => 'float',
        'cost' => 'float',
        'success_count' => 'integer',
        'error_count' => 'integer',
    ];

    /**
     * Get the model that owns the usage statistics.
     */
    public function model(): BelongsTo
    {
        return $this->belongsTo(AIModel::class, 'model_id');
    }

    /**
     * Increment the request count.
     *
     * @param int $tokens
     * @param float $responseTime
     * @param float $cost
     * @param bool $success
     * @return bool
     */
    public function incrementUsage(int $tokens, float $responseTime, float $cost, bool $success = true)
    {
        $this->request_count++;
        $this->token_count += $tokens;
        
        // Recalculate average response time
        $this->average_response_time = (($this->average_response_time * ($this->request_count - 1)) + $responseTime) / $this->request_count;
        
        $this->cost += $cost;
        
        if ($success) {
            $this->success_count++;
        } else {
            $this->error_count++;
        }
        
        return $this->save();
    }

    /**
     * Get or create a usage stat record for today.
     *
     * @param int $modelId
     * @return ModelUsageStat
     */
    public static function getOrCreateForToday(int $modelId)
    {
        $today = now()->toDateString();
        
        return self::firstOrCreate(
            [
                'model_id' => $modelId,
                'date' => $today,
            ],
            [
                'request_count' => 0,
                'token_count' => 0,
                'average_response_time' => 0,
                'cost' => 0,
                'success_count' => 0,
                'error_count' => 0,
            ]
        );
    }
}