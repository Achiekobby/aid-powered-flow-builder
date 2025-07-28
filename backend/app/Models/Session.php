<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Session extends Model
{
    use HasFactory;

    protected $fillable = [
        'flow_id',
        'session_id',
        'phone_number',
        'ussd_code',
        'status',
        'session_data',
        'user_inputs',
        'current_node',
        'step_count',
        'started_at',
        'last_activity_at',
        'expires_at',
        'completed_at',
    ];

    protected $casts = [
        'session_data' => 'array',
        'user_inputs' => 'array',
        'started_at' => 'datetime',
        'last_activity_at' => 'datetime',
        'expires_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the flow that owns the session.
     */
    public function flow(): BelongsTo
    {
        return $this->belongsTo(Flow::class);
    }

    /**
     * Get the user that owns the session.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include active sessions.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include completed sessions.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to only include expired sessions.
     */
    public function scopeExpired($query)
    {
        return $query->where('status', 'expired');
    }

    /**
     * Scope a query to only include sessions for a specific phone number.
     */
    public function scopeForPhone($query, string $phoneNumber)
    {
        return $query->where('phone_number', $phoneNumber);
    }

    /**
     * Scope a query to only include sessions for a specific USSD code.
     */
    public function scopeForUssdCode($query, string $ussdCode)
    {
        return $query->where('ussd_code', $ussdCode);
    }

    /**
     * Check if the session is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if the session is expired.
     */
    public function isExpired(): bool
    {
        return $this->status === 'expired' || $this->expires_at->isPast();
    }

    /**
     * Check if the session is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Mark the session as completed.
     */
    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }

    /**
     * Mark the session as expired.
     */
    public function markAsExpired(): void
    {
        $this->update([
            'status' => 'expired',
        ]);
    }

    /**
     * Update the session's last activity.
     */
    public function updateActivity(): void
    {
        $this->update([
            'last_activity_at' => now(),
        ]);
    }

    /**
     * Increment the step count.
     */
    public function incrementStep(): void
    {
        $this->increment('step_count');
    }

    /**
     * Add user input to the session.
     */
    public function addUserInput(string $input): void
    {
        $inputs = $this->user_inputs ?? [];
        $inputs[] = [
            'input' => $input,
            'timestamp' => now()->toISOString(),
            'step' => $this->step_count + 1,
        ];

        $this->update([
            'user_inputs' => $inputs,
        ]);
    }

    /**
     * Get the session duration in seconds.
     */
    public function getDurationAttribute(): int
    {
        $endTime = $this->completed_at ?? now();
        return $this->started_at->diffInSeconds($endTime);
    }

    /**
     * Get the session duration in minutes.
     */
    public function getDurationMinutesAttribute(): float
    {
        return round($this->duration / 60, 2);
    }
}
