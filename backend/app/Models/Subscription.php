<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subscription_id',
        'plan',
        'status',
        'amount',
        'currency',
        'billing_cycle',
        'start_date',
        'end_date',
        'next_billing_date',
        'cancelled_at',
        'features',
        'usage_limits',
        'current_usage',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'next_billing_date' => 'datetime',
        'cancelled_at' => 'datetime',
        'features' => 'array',
        'usage_limits' => 'array',
        'current_usage' => 'array',
    ];

    /**
     * Get the user that owns the subscription.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the payments for this subscription.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Scope a query to only include active subscriptions.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include expired subscriptions.
     */
    public function scopeExpired($query)
    {
        return $query->where('status', 'expired');
    }

    /**
     * Scope a query to only include cancelled subscriptions.
     */
    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    /**
     * Scope a query to only include subscriptions for a specific plan.
     */
    public function scopeForPlan($query, string $plan)
    {
        return $query->where('plan', $plan);
    }

    /**
     * Scope a query to only include subscriptions for a specific user.
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to only include subscriptions expiring soon.
     */
    public function scopeExpiringSoon($query, int $days = 7)
    {
        return $query->where('end_date', '<=', now()->addDays($days))
                    ->where('status', 'active');
    }

    /**
     * Check if the subscription is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if the subscription is expired.
     */
    public function isExpired(): bool
    {
        return $this->status === 'expired' || $this->end_date->isPast();
    }

    /**
     * Check if the subscription is cancelled.
     */
    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    /**
     * Check if the subscription is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the subscription is expiring soon.
     */
    public function isExpiringSoon(int $days = 7): bool
    {
        return $this->isActive() && $this->end_date->diffInDays(now()) <= $days;
    }

    /**
     * Activate the subscription.
     */
    public function activate(): void
    {
        $this->update([
            'status' => 'active',
        ]);
    }

    /**
     * Cancel the subscription.
     */
    public function cancel(): void
    {
        $this->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);
    }

    /**
     * Mark the subscription as expired.
     */
    public function markAsExpired(): void
    {
        $this->update([
            'status' => 'expired',
        ]);
    }

    /**
     * Get the plan features.
     */
    public function getPlanFeatures(): array
    {
        return $this->features ?? $this->getDefaultFeatures();
    }

    /**
     * Get the usage limits.
     */
    public function getUsageLimits(): array
    {
        return $this->usage_limits ?? $this->getDefaultUsageLimits();
    }

    /**
     * Get the current usage.
     */
    public function getCurrentUsage(): array
    {
        return $this->current_usage ?? [];
    }

    /**
     * Check if a feature is available.
     */
    public function hasFeature(string $feature): bool
    {
        $features = $this->getPlanFeatures();
        return isset($features[$feature]) && $features[$feature];
    }

    /**
     * Check if usage is within limits.
     */
    public function isWithinLimits(string $metric): bool
    {
        $limits = $this->getUsageLimits();
        $usage = $this->getCurrentUsage();

        if (!isset($limits[$metric])) {
            return true; // No limit set
        }

        $currentUsage = $usage[$metric] ?? 0;
        return $currentUsage < $limits[$metric];
    }

    /**
     * Increment usage for a metric.
     */
    public function incrementUsage(string $metric, int $amount = 1): void
    {
        $usage = $this->getCurrentUsage();
        $usage[$metric] = ($usage[$metric] ?? 0) + $amount;

        $this->update(['current_usage' => $usage]);
    }

    /**
     * Get the remaining days until expiration.
     */
    public function getRemainingDaysAttribute(): int
    {
        return max(0, $this->end_date->diffInDays(now()));
    }

    /**
     * Get the formatted amount.
     */
    public function getFormattedAmountAttribute(): string
    {
        return $this->currency . ' ' . number_format($this->amount, 2);
    }

    /**
     * Get the plan display name.
     */
    public function getPlanDisplayNameAttribute(): string
    {
        return match ($this->plan) {
            'starter' => 'Starter Plan',
            'professional' => 'Professional Plan',
            'enterprise' => 'Enterprise Plan',
            default => ucfirst($this->plan) . ' Plan',
        };
    }

    /**
     * Get default features for the plan.
     */
    private function getDefaultFeatures(): array
    {
        return match ($this->plan) {
            'starter' => [
                'flows' => 5,
                'ussd_codes' => 1,
                'analytics' => true,
                'templates' => true,
                'support' => 'email',
            ],
            'professional' => [
                'flows' => 20,
                'ussd_codes' => 5,
                'analytics' => true,
                'templates' => true,
                'support' => 'priority',
                'api_access' => true,
            ],
            'enterprise' => [
                'flows' => 100,
                'ussd_codes' => 20,
                'analytics' => true,
                'templates' => true,
                'support' => 'dedicated',
                'api_access' => true,
                'custom_integration' => true,
            ],
            default => [],
        };
    }

    /**
     * Get default usage limits for the plan.
     */
    private function getDefaultUsageLimits(): array
    {
        return match ($this->plan) {
            'starter' => [
                'monthly_sessions' => 1000,
                'monthly_analytics' => 5000,
            ],
            'professional' => [
                'monthly_sessions' => 10000,
                'monthly_analytics' => 50000,
            ],
            'enterprise' => [
                'monthly_sessions' => 100000,
                'monthly_analytics' => 500000,
            ],
            default => [],
        };
    }
}
