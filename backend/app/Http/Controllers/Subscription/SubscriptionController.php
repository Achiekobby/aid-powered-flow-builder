<?php

namespace App\Http\Controllers\Subscription;

use App\Http\Controllers\Controller;
use App\Http\Requests\Subscription\StoreSubscriptionRequest;
use App\Http\Requests\Subscription\UpdateSubscriptionRequest;
use App\Http\Resources\SubscriptionResource;
use App\Services\SubscriptionService;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SubscriptionController extends Controller
{
    public function __construct(
        private SubscriptionService $subscriptionService
    ) {}

    /**
     * Get user's subscriptions.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['status', 'plan']);
            $subscriptions = $this->subscriptionService->getUserSubscriptions($request->user()->id, $filters);

            return response()->json([
                'success' => true,
                'data' => SubscriptionResource::collection($subscriptions)
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve subscriptions', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve subscriptions'
            ], 500);
        }
    }

    /**
     * Create a new subscription.
     */
    public function store(StoreSubscriptionRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['user_id'] = $request->user()->id;

            $subscription = $this->subscriptionService->createSubscription($data);

            return response()->json([
                'success' => true,
                'data' => new SubscriptionResource($subscription),
                'message' => 'Subscription created successfully'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Failed to create subscription', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create subscription: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get subscription by ID.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        try {
            $subscription = $this->subscriptionService->getSubscription($id);

            if (!$subscription) {
                return response()->json([
                    'success' => false,
                    'message' => 'Subscription not found'
                ], 404);
            }

            // Check if user owns the subscription
            if ($subscription->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to subscription'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => new SubscriptionResource($subscription)
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to retrieve subscription', [
                'subscription_id' => $id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve subscription'
            ], 500);
        }
    }

    /**
     * Update subscription.
     */
    public function update(UpdateSubscriptionRequest $request, int $id): JsonResponse
    {
        try {
            $subscription = $this->subscriptionService->getSubscription($id);

            if (!$subscription) {
                return response()->json([
                    'success' => false,
                    'message' => 'Subscription not found'
                ], 404);
            }

            // Check if user owns the subscription
            if ($subscription->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to subscription'
                ], 403);
            }

            $updatedSubscription = $this->subscriptionService->updateSubscription($subscription, $request->validated());

            return response()->json([
                'success' => true,
                'data' => new SubscriptionResource($updatedSubscription),
                'message' => 'Subscription updated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to update subscription', [
                'subscription_id' => $id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update subscription: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Activate subscription.
     */
    public function activate(Request $request, int $id): JsonResponse
    {
        try {
            $subscription = $this->subscriptionService->getSubscription($id);

            if (!$subscription) {
                return response()->json([
                    'success' => false,
                    'message' => 'Subscription not found'
                ], 404);
            }

            // Check if user owns the subscription
            if ($subscription->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to subscription'
                ], 403);
            }

            $activatedSubscription = $this->subscriptionService->activateSubscription($subscription);

            return response()->json([
                'success' => true,
                'data' => new SubscriptionResource($activatedSubscription),
                'message' => 'Subscription activated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to activate subscription', [
                'subscription_id' => $id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to activate subscription: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel subscription.
     */
    public function cancel(Request $request, int $id): JsonResponse
    {
        try {
            $subscription = $this->subscriptionService->getSubscription($id);

            if (!$subscription) {
                return response()->json([
                    'success' => false,
                    'message' => 'Subscription not found'
                ], 404);
            }

            // Check if user owns the subscription
            if ($subscription->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to subscription'
                ], 403);
            }

            $reason = $request->input('reason');
            $cancelledSubscription = $this->subscriptionService->cancelSubscription($subscription, $reason);

            return response()->json([
                'success' => true,
                'data' => new SubscriptionResource($cancelledSubscription),
                'message' => 'Subscription cancelled successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to cancel subscription', [
                'subscription_id' => $id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel subscription: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Renew subscription.
     */
    public function renew(Request $request, int $id): JsonResponse
    {
        try {
            $subscription = $this->subscriptionService->getSubscription($id);

            if (!$subscription) {
                return response()->json([
                    'success' => false,
                    'message' => 'Subscription not found'
                ], 404);
            }

            // Check if user owns the subscription
            if ($subscription->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to subscription'
                ], 403);
            }

            $renewedSubscription = $this->subscriptionService->renewSubscription($subscription);

            return response()->json([
                'success' => true,
                'data' => new SubscriptionResource($renewedSubscription),
                'message' => 'Subscription renewed successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to renew subscription', [
                'subscription_id' => $id,
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to renew subscription: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upgrade subscription.
     */
    public function upgrade(Request $request, int $id): JsonResponse
    {
        try {
            $request->validate([
                'new_plan' => 'required|string|in:starter,professional,enterprise',
                'new_amount' => 'required|numeric|min:0'
            ]);

            $subscription = $this->subscriptionService->getSubscription($id);

            if (!$subscription) {
                return response()->json([
                    'success' => false,
                    'message' => 'Subscription not found'
                ], 404);
            }

            // Check if user owns the subscription
            if ($subscription->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to subscription'
                ], 403);
            }

            $upgradedSubscription = $this->subscriptionService->upgradeSubscription(
                $subscription,
                $request->input('new_plan'),
                $request->input('new_amount')
            );

            return response()->json([
                'success' => true,
                'data' => new SubscriptionResource($upgradedSubscription),
                'message' => 'Subscription upgraded successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to upgrade subscription', [
                'subscription_id' => $id,
                'user_id' => $request->user()->id,
                'new_plan' => $request->input('new_plan'),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to upgrade subscription: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Downgrade subscription.
     */
    public function downgrade(Request $request, int $id): JsonResponse
    {
        try {
            $request->validate([
                'new_plan' => 'required|string|in:starter,professional,enterprise',
                'new_amount' => 'required|numeric|min:0'
            ]);

            $subscription = $this->subscriptionService->getSubscription($id);

            if (!$subscription) {
                return response()->json([
                    'success' => false,
                    'message' => 'Subscription not found'
                ], 404);
            }

            // Check if user owns the subscription
            if ($subscription->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to subscription'
                ], 403);
            }

            $downgradedSubscription = $this->subscriptionService->downgradeSubscription(
                $subscription,
                $request->input('new_plan'),
                $request->input('new_amount')
            );

            return response()->json([
                'success' => true,
                'data' => new SubscriptionResource($downgradedSubscription),
                'message' => 'Subscription downgraded successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to downgrade subscription', [
                'subscription_id' => $id,
                'user_id' => $request->user()->id,
                'new_plan' => $request->input('new_plan'),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to downgrade subscription: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's active subscription.
     */
    public function active(Request $request): JsonResponse
    {
        try {
            $subscription = $this->subscriptionService->getUserActiveSubscription($request->user()->id);

            if (!$subscription) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active subscription found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => new SubscriptionResource($subscription)
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get active subscription', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get active subscription'
            ], 500);
        }
    }

    /**
     * Get subscription statistics.
     */
    public function stats(Request $request): JsonResponse
    {
        try {
            $stats = $this->subscriptionService->getSubscriptionStats($request->user()->id);

            return response()->json([
                'success' => true,
                'data' => $stats
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get subscription statistics', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get subscription statistics'
            ], 500);
        }
    }

    /**
     * Get available subscription plans.
     */
    public function plans(Request $request): JsonResponse
    {
        try {
            $plans = $this->subscriptionService->getAvailablePlans();

            return response()->json([
                'success' => true,
                'data' => $plans
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to get subscription plans', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get subscription plans'
            ], 500);
        }
    }

    /**
     * Check if user can access a feature.
     */
    public function canAccessFeature(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'feature' => 'required|string'
            ]);

            $feature = $request->input('feature');
            $canAccess = $this->subscriptionService->canAccessFeature($request->user()->id, $feature);

            return response()->json([
                'success' => true,
                'data' => [
                    'feature' => $feature,
                    'can_access' => $canAccess
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to check feature access', [
                'user_id' => $request->user()->id,
                'feature' => $request->input('feature'),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to check feature access'
            ], 500);
        }
    }

    /**
     * Check if user is within usage limits.
     */
    public function isWithinLimit(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'metric' => 'required|string'
            ]);

            $metric = $request->input('metric');
            $isWithinLimit = $this->subscriptionService->isWithinUsageLimit($request->user()->id, $metric);

            return response()->json([
                'success' => true,
                'data' => [
                    'metric' => $metric,
                    'is_within_limit' => $isWithinLimit
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to check usage limit', [
                'user_id' => $request->user()->id,
                'metric' => $request->input('metric'),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to check usage limit'
            ], 500);
        }
    }
}
