<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
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
            'payment_id' => $this->payment_id,
            'reference' => $this->reference,
            'type' => $this->type,
            'status' => $this->status,
            'amount' => $this->amount,
            'currency' => $this->currency,
            'payment_method' => $this->payment_method,
            'gateway_response' => $this->gateway_response,
            'metadata' => $this->metadata,
            'description' => $this->description,
            'paid_at' => $this->paid_at?->toISOString(),
            'expires_at' => $this->expires_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            // Relationships
            'user' => $this->whenLoaded('user', function () {
                return new UserResource($this->user);
            }),
            'subscription' => $this->whenLoaded('subscription', function () {
                return new SubscriptionResource($this->subscription);
            }),

            // Computed attributes
            'is_completed' => $this->isCompleted(),
            'is_pending' => $this->isPending(),
            'is_failed' => $this->isFailed(),
            'is_cancelled' => $this->isCancelled(),
            'is_refunded' => $this->isRefunded(),
            'is_expired' => $this->isExpired(),
            'type_label' => $this->type_label,
            'payment_method_label' => $this->payment_method_label,
            'status_label' => $this->status_label,
            'formatted_amount' => $this->formatted_amount,
            'gateway_response_data' => $this->gateway_response_data,
            'is_subscription_payment' => $this->isSubscriptionPayment(),
            'is_ussd_code_payment' => $this->isUssdCodePayment(),
            'is_addon_payment' => $this->isAddonPayment(),
            'is_credit_payment' => $this->isCreditPayment(),
        ];
    }
}
