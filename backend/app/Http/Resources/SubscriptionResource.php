<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'subscription_id' => $this->subscription_id,
            'plan' => $this->plan,
            'status' => $this->status,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'billing_cycle' => $this->billing_cycle,
            'start_date' => $this->start_date->toISOString(),
            'end_date' => $this->end_date->toISOString(),
            'next_billing_date' => $this->next_billing_date?->toISOString(),
            'cancelled_at' => $this->cancelled_at?->toISOString(),
            'features' => $this->features,
            'usage_limits' => $this->usage_limits,
            'current_usage' => $this->current_usage,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            // Relationships
            'user' => $this->whenLoaded('user', function () {
                return new UserResource($this->user);
            }),
            'payments_count' => $this->when(isset($this->payments_count), $this->payments_count),

            // Computed attributes
            'is_active' => $this->isActive(),
            'is_expired' => $this->isExpired(),
            'is_cancelled' => $this->isCancelled(),
            'is_pending' => $this->isPending(),
            'is_expiring_soon' => $this->isExpiringSoon(),
            'remaining_days' => $this->remaining_days,
            'formatted_amount' => $this->formatted_amount,
            'plan_display_name' => $this->plan_display_name,
        ];
    }
}
