<?php

namespace App\Services;

use App\Models\Subscription;
use App\Models\User;
use App\Models\Payment;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SubscriptionService
{
    /**
     * Create a new subscription.
     */
    public function createSubscription(array $data): Subscription
    {
        $user = User::findOrFail($data['user_id']);
        
        // Check if user already has an active subscription
        $existingSubscription = $user->subscriptions()->active()->first();
        if ($existingSubscription) {
            throw new \Exception('User already has an active subscription');
        }

        // Generate subscription ID
        $subscriptionId = $this->generateSubscriptionId();
        
        // Calculate dates
        $startDate = now();
        $endDate = $this->calculateEndDate($startDate, $data['billing_cycle']);
        $nextBillingDate = $endDate;

        $subscription = Subscription::create([
            'user_id' => $data['user_id'],
            'subscription_id' => $subscriptionId,
            'plan' => $data['plan'],
            'status' => 'pending',
            'amount' => $data['amount'],
            'currency' => $data['currency'] ?? 'GHS',
            'billing_cycle' => $data['billing_cycle'],
            'start_date' => $startDate,
            'end_date' => $endDate,
            'next_billing_date' => $nextBillingDate,
            'features' => $this->getPlanFeatures($data['plan']),
            'usage_limits' => $this->getPlanUsageLimits($data['plan']),
            'current_usage' => [],
        ]);

        Log::info('Subscription created', [
            'user_id' => $data['user_id'],
            'subscription_id' => $subscriptionId,
            'plan' => $data['plan'],
        ]);

        return $subscription;
    }

    /**
     * Get subscription by ID.
     */
    public function getSubscription(int $id): ?Subscription
    {
        return Subscription::find($id);
    }

    /**
     * Get subscription by subscription ID.
     */
    public function getSubscriptionBySubscriptionId(string $subscriptionId): ?Subscription
    {
        return Subscription::where('subscription_id', $subscriptionId)->first();
    }

    /**
     * Get user's active subscription.
     */
    public function getUserActiveSubscription(int $userId): ?Subscription
    {
        return Subscription::where('user_id', $userId)
            ->where('status', 'active')
            ->first();
    }

    /**
     * Get user's subscriptions.
     */
    public function getUserSubscriptions(int $userId, array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        $query = Subscription::where('user_id', $userId);

        // Apply filters
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['plan'])) {
            $query->where('plan', $filters['plan']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Activate subscription.
     */
    public function activateSubscription(Subscription $subscription): Subscription
    {
        $subscription->activate();

        // Update user's subscription plan
        $subscription->user->update(['subscription_plan' => $subscription->plan]);

        Log::info('Subscription activated', [
            'subscription_id' => $subscription->subscription_id,
            'plan' => $subscription->plan,
        ]);

        return $subscription;
    }

    /**
     * Cancel subscription.
     */
    public function cancelSubscription(Subscription $subscription, string $reason = null): Subscription
    {
        $subscription->cancel();

        Log::info('Subscription cancelled', [
            'subscription_id' => $subscription->subscription_id,
            'reason' => $reason,
        ]);

        return $subscription;
    }

    /**
     * Renew subscription.
     */
    public function renewSubscription(Subscription $subscription): Subscription
    {
        // Calculate new dates
        $startDate = now();
        $endDate = $this->calculateEndDate($startDate, $subscription->billing_cycle);
        $nextBillingDate = $endDate;

        $subscription->update([
            'start_date' => $startDate,
            'end_date' => $endDate,
            'next_billing_date' => $nextBillingDate,
            'status' => 'active',
            'current_usage' => [], // Reset usage
        ]);

        Log::info('Subscription renewed', [
            'subscription_id' => $subscription->subscription_id,
            'plan' => $subscription->plan,
        ]);

        return $subscription;
    }

    /**
     * Upgrade subscription.
     */
    public function upgradeSubscription(Subscription $subscription, string $newPlan, float $newAmount): Subscription
    {
        $oldPlan = $subscription->plan;
        
        $subscription->update([
            'plan' => $newPlan,
            'amount' => $newAmount,
            'features' => $this->getPlanFeatures($newPlan),
            'usage_limits' => $this->getPlanUsageLimits($newPlan),
        ]);

        // Update user's subscription plan
        $subscription->user->update(['subscription_plan' => $newPlan]);

        Log::info('Subscription upgraded', [
            'subscription_id' => $subscription->subscription_id,
            'old_plan' => $oldPlan,
            'new_plan' => $newPlan,
        ]);

        return $subscription;
    }

    /**
     * Downgrade subscription.
     */
    public function downgradeSubscription(Subscription $subscription, string $newPlan, float $newAmount): Subscription
    {
        $oldPlan = $subscription->plan;
        
        $subscription->update([
            'plan' => $newPlan,
            'amount' => $newAmount,
            'features' => $this->getPlanFeatures($newPlan),
            'usage_limits' => $this->getPlanUsageLimits($newPlan),
        ]);

        // Update user's subscription plan
        $subscription->user->update(['subscription_plan' => $newPlan]);

        Log::info('Subscription downgraded', [
            'subscription_id' => $subscription->subscription_id,
            'old_plan' => $oldPlan,
            'new_plan' => $newPlan,
        ]);

        return $subscription;
    }

    /**
     * Check subscription status and handle expirations.
     */
    public function checkSubscriptionStatus(Subscription $subscription): void
    {
        if ($subscription->isExpired()) {
            $subscription->markAsExpired();
            
            // Update user's subscription plan
            $subscription->user->update(['subscription_plan' => null]);

            Log::info('Subscription expired', [
                'subscription_id' => $subscription->subscription_id,
            ]);
        }
    }

    /**
     * Process subscription payment.
     */
    public function processSubscriptionPayment(Subscription $subscription, Payment $payment): void
    {
        if ($payment->isCompleted()) {
            // Activate subscription if payment is successful
            if ($subscription->isPending()) {
                $this->activateSubscription($subscription);
            }

            // Update next billing date
            $nextBillingDate = $this->calculateEndDate($subscription->end_date, $subscription->billing_cycle);
            $subscription->update(['next_billing_date' => $nextBillingDate]);

            Log::info('Subscription payment processed', [
                'subscription_id' => $subscription->subscription_id,
                'payment_id' => $payment->payment_id,
            ]);
        }
    }

    /**
     * Get subscription statistics.
     */
    public function getSubscriptionStats(int $userId): array
    {
        $subscriptions = Subscription::where('user_id', $userId)->get();

        return [
            'total_subscriptions' => $subscriptions->count(),
            'active_subscriptions' => $subscriptions->where('status', 'active')->count(),
            'expired_subscriptions' => $subscriptions->where('status', 'expired')->count(),
            'cancelled_subscriptions' => $subscriptions->where('status', 'cancelled')->count(),
            'pending_subscriptions' => $subscriptions->where('status', 'pending')->count(),
            'current_plan' => $subscriptions->where('status', 'active')->first()->plan ?? null,
            'total_spent' => $subscriptions->sum('amount'),
        ];
    }

    /**
     * Check if user can access a feature.
     */
    public function canAccessFeature(int $userId, string $feature): bool
    {
        $subscription = $this->getUserActiveSubscription($userId);
        
        if (!$subscription) {
            return false;
        }

        return $subscription->hasFeature($feature);
    }

    /**
     * Check if user is within usage limits.
     */
    public function isWithinUsageLimit(int $userId, string $metric): bool
    {
        $subscription = $this->getUserActiveSubscription($userId);
        
        if (!$subscription) {
            return false;
        }

        return $subscription->isWithinLimits($metric);
    }

    /**
     * Increment usage for a metric.
     */
    public function incrementUsage(int $userId, string $metric, int $amount = 1): void
    {
        $subscription = $this->getUserActiveSubscription($userId);
        
        if ($subscription) {
            $subscription->incrementUsage($metric, $amount);
        }
    }

    /**
     * Get expiring subscriptions.
     */
    public function getExpiringSubscriptions(int $days = 7): \Illuminate\Database\Eloquent\Collection
    {
        return Subscription::where('status', 'active')
            ->where('end_date', '<=', now()->addDays($days))
            ->get();
    }

    /**
     * Get subscription plans.
     */
    public function getAvailablePlans(): array
    {
        return [
            'starter' => [
                'name' => 'Starter Plan',
                'price' => 50.00,
                'currency' => 'GHS',
                'billing_cycle' => 'monthly',
                'features' => $this->getPlanFeatures('starter'),
                'usage_limits' => $this->getPlanUsageLimits('starter'),
            ],
            'professional' => [
                'name' => 'Professional Plan',
                'price' => 150.00,
                'currency' => 'GHS',
                'billing_cycle' => 'monthly',
                'features' => $this->getPlanFeatures('professional'),
                'usage_limits' => $this->getPlanUsageLimits('professional'),
            ],
            'enterprise' => [
                'name' => 'Enterprise Plan',
                'price' => 500.00,
                'currency' => 'GHS',
                'billing_cycle' => 'monthly',
                'features' => $this->getPlanFeatures('enterprise'),
                'usage_limits' => $this->getPlanUsageLimits('enterprise'),
            ],
        ];
    }

    /**
     * Generate unique subscription ID.
     */
    private function generateSubscriptionId(): string
    {
        do {
            $subscriptionId = 'sub_' . Str::random(16);
        } while (Subscription::where('subscription_id', $subscriptionId)->exists());

        return $subscriptionId;
    }

    /**
     * Calculate end date based on billing cycle.
     */
    private function calculateEndDate(Carbon $startDate, string $billingCycle): Carbon
    {
        return match ($billingCycle) {
            'monthly' => $startDate->copy()->addMonth(),
            'quarterly' => $startDate->copy()->addMonths(3),
            'yearly' => $startDate->copy()->addYear(),
            default => $startDate->copy()->addMonth(),
        };
    }

    /**
     * Get plan features.
     */
    private function getPlanFeatures(string $plan): array
    {
        return match ($plan) {
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
     * Get plan usage limits.
     */
    private function getPlanUsageLimits(string $plan): array
    {
        return match ($plan) {
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