<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subscription_id',
        'payment_id',
        'reference',
        'type',
        'status',
        'amount',
        'currency',
        'payment_method',
        'gateway_response',
        'metadata',
        'description',
        'paid_at',
        'expires_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'metadata' => 'array',
        'paid_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    /**
     * Get the user that owns the payment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the subscription associated with the payment.
     */
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    /**
     * Scope a query to only include completed payments.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to only include pending payments.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include failed payments.
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    /**
     * Scope a query to only include payments for a specific type.
     */
    public function scopeForType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope a query to only include payments for a specific user.
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to only include payments for a specific payment method.
     */
    public function scopeForPaymentMethod($query, string $method)
    {
        return $query->where('payment_method', $method);
    }

    /**
     * Scope a query to only include payments within a date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }

    /**
     * Check if the payment is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if the payment is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the payment is failed.
     */
    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    /**
     * Check if the payment is cancelled.
     */
    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    /**
     * Check if the payment is refunded.
     */
    public function isRefunded(): bool
    {
        return $this->status === 'refunded';
    }

    /**
     * Check if the payment is expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Mark the payment as completed.
     */
    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'paid_at' => now(),
        ]);
    }

    /**
     * Mark the payment as failed.
     */
    public function markAsFailed(): void
    {
        $this->update([
            'status' => 'failed',
        ]);
    }

    /**
     * Mark the payment as cancelled.
     */
    public function markAsCancelled(): void
    {
        $this->update([
            'status' => 'cancelled',
        ]);
    }

    /**
     * Mark the payment as refunded.
     */
    public function markAsRefunded(): void
    {
        $this->update([
            'status' => 'refunded',
        ]);
    }

    /**
     * Get the payment type label.
     */
    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            'subscription' => 'Subscription Payment',
            'ussd_code' => 'USSD Code Purchase',
            'addon' => 'Add-on Purchase',
            'credit' => 'Credit Purchase',
            default => ucfirst($this->type) . ' Payment',
        };
    }

    /**
     * Get the payment method label.
     */
    public function getPaymentMethodLabelAttribute(): string
    {
        return match ($this->payment_method) {
            'flutterwave' => 'Flutterwave',
            'paystack' => 'Paystack',
            'momo' => 'Mobile Money',
            'card' => 'Credit/Debit Card',
            'bank_transfer' => 'Bank Transfer',
            default => ucfirst(str_replace('_', ' ', $this->payment_method ?? '')),
        };
    }

    /**
     * Get the status label.
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'pending' => 'Pending',
            'processing' => 'Processing',
            'completed' => 'Completed',
            'failed' => 'Failed',
            'cancelled' => 'Cancelled',
            'refunded' => 'Refunded',
            default => ucfirst($this->status),
        };
    }

    /**
     * Get the formatted amount.
     */
    public function getFormattedAmountAttribute(): string
    {
        return $this->currency . ' ' . number_format($this->amount, 2);
    }

    /**
     * Get the gateway response data.
     */
    public function getGatewayResponseData(): array
    {
        if (!$this->gateway_response) {
            return [];
        }

        return json_decode($this->gateway_response, true) ?? [];
    }

    /**
     * Get metadata value.
     */
    public function getMetadataValue(string $key, $default = null)
    {
        return $this->metadata[$key] ?? $default;
    }

    /**
     * Set metadata value.
     */
    public function setMetadataValue(string $key, $value): void
    {
        $metadata = $this->metadata ?? [];
        $metadata[$key] = $value;
        $this->update(['metadata' => $metadata]);
    }

    /**
     * Check if payment is for subscription.
     */
    public function isSubscriptionPayment(): bool
    {
        return $this->type === 'subscription';
    }

    /**
     * Check if payment is for USSD code.
     */
    public function isUssdCodePayment(): bool
    {
        return $this->type === 'ussd_code';
    }

    /**
     * Check if payment is for addon.
     */
    public function isAddonPayment(): bool
    {
        return $this->type === 'addon';
    }

    /**
     * Check if payment is for credit.
     */
    public function isCreditPayment(): bool
    {
        return $this->type === 'credit';
    }
}
