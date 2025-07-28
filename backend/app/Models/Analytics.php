<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Analytics extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'flow_id',
        'ussd_code_id',
        'session_id',
        'phone_number',
        'event_type',
        'event_data',
        'node_id',
        'user_input',
        'duration',
        'telco',
        'location',
        'device_info',
        'error_message',
    ];

    protected $casts = [
        'event_data' => 'array',
        'duration' => 'decimal:2',
    ];

    /**
     * Get the user that owns the analytics record.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the flow associated with the analytics record.
     */
    public function flow(): BelongsTo
    {
        return $this->belongsTo(Flow::class);
    }

    /**
     * Get the USSD code associated with the analytics record.
     */
    public function ussdCode(): BelongsTo
    {
        return $this->belongsTo(UssdCode::class);
    }

    /**
     * Scope a query to only include session events.
     */
    public function scopeSessionEvents($query)
    {
        return $query->whereIn('event_type', ['session_started', 'session_completed', 'session_terminated']);
    }

    /**
     * Scope a query to only include node events.
     */
    public function scopeNodeEvents($query)
    {
        return $query->where('event_type', 'node_visited');
    }

    /**
     * Scope a query to only include input events.
     */
    public function scopeInputEvents($query)
    {
        return $query->where('event_type', 'input_received');
    }

    /**
     * Scope a query to only include error events.
     */
    public function scopeErrorEvents($query)
    {
        return $query->where('event_type', 'error_occurred');
    }

    /**
     * Scope a query to only include payment events.
     */
    public function scopePaymentEvents($query)
    {
        return $query->whereIn('event_type', ['payment_initiated', 'payment_completed']);
    }

    /**
     * Scope a query to only include events for a specific flow.
     */
    public function scopeForFlow($query, int $flowId)
    {
        return $query->where('flow_id', $flowId);
    }

    /**
     * Scope a query to only include events for a specific USSD code.
     */
    public function scopeForUssdCode($query, int $ussdCodeId)
    {
        return $query->where('ussd_code_id', $ussdCodeId);
    }

    /**
     * Scope a query to only include events for a specific session.
     */
    public function scopeForSession($query, string $sessionId)
    {
        return $query->where('session_id', $sessionId);
    }

    /**
     * Scope a query to only include events for a specific phone number.
     */
    public function scopeForPhone($query, string $phoneNumber)
    {
        return $query->where('phone_number', $phoneNumber);
    }

    /**
     * Scope a query to only include events for a specific telco.
     */
    public function scopeForTelco($query, string $telco)
    {
        return $query->where('telco', $telco);
    }

    /**
     * Scope a query to only include events within a date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Check if the event is a session event.
     */
    public function isSessionEvent(): bool
    {
        return in_array($this->event_type, ['session_started', 'session_completed', 'session_terminated']);
    }

    /**
     * Check if the event is a node event.
     */
    public function isNodeEvent(): bool
    {
        return $this->event_type === 'node_visited';
    }

    /**
     * Check if the event is an input event.
     */
    public function isInputEvent(): bool
    {
        return $this->event_type === 'input_received';
    }

    /**
     * Check if the event is an error event.
     */
    public function isErrorEvent(): bool
    {
        return $this->event_type === 'error_occurred';
    }

    /**
     * Check if the event is a payment event.
     */
    public function isPaymentEvent(): bool
    {
        return in_array($this->event_type, ['payment_initiated', 'payment_completed']);
    }

    /**
     * Get the event type label.
     */
    public function getEventTypeLabelAttribute(): string
    {
        return match ($this->event_type) {
            'session_started' => 'Session Started',
            'session_completed' => 'Session Completed',
            'session_terminated' => 'Session Terminated',
            'node_visited' => 'Node Visited',
            'input_received' => 'Input Received',
            'error_occurred' => 'Error Occurred',
            'payment_initiated' => 'Payment Initiated',
            'payment_completed' => 'Payment Completed',
            default => ucfirst(str_replace('_', ' ', $this->event_type)),
        };
    }

    /**
     * Get the formatted duration.
     */
    public function getFormattedDurationAttribute(): string
    {
        if (!$this->duration) {
            return 'N/A';
        }

        $minutes = floor($this->duration / 60);
        $seconds = $this->duration % 60;

        if ($minutes > 0) {
            return "{$minutes}m {$seconds}s";
        }

        return "{$seconds}s";
    }
}
