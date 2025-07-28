<?php

namespace App\Http\Requests\Subscription;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;

class StoreSubscriptionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'plan' => 'required|string|in:starter,professional,enterprise,custom',
            'amount' => 'required|numeric|min:0',
            'currency' => 'sometimes|string|in:GHS,USD,NGN|default:GHS',
            'billing_cycle' => 'required|string|in:monthly,quarterly,yearly',
            'payment_method' => 'required|string|in:card,mobile_money,bank_transfer',
            'auto_renew' => 'sometimes|boolean',
            'start_date' => 'sometimes|date|after_or_equal:today',
            'custom_features' => 'sometimes|array',
            'custom_features.*' => 'string',
            'custom_usage_limits' => 'sometimes|array',
            'custom_usage_limits.*' => 'integer|min:0',
            'promo_code' => 'sometimes|string|max:50',
            'notes' => 'sometimes|string|max:500',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'plan.required' => 'A subscription plan is required.',
            'plan.in' => 'The selected plan is invalid.',
            'amount.required' => 'The subscription amount is required.',
            'amount.numeric' => 'The amount must be a valid number.',
            'amount.min' => 'The amount must be at least 0.',
            'currency.in' => 'The selected currency is not supported.',
            'billing_cycle.required' => 'A billing cycle is required.',
            'billing_cycle.in' => 'The selected billing cycle is invalid.',
            'payment_method.required' => 'A payment method is required.',
            'payment_method.in' => 'The selected payment method is invalid.',
            'auto_renew.boolean' => 'Auto renew must be true or false.',
            'start_date.after_or_equal' => 'Start date must be today or in the future.',
            'custom_features.array' => 'Custom features must be an array.',
            'custom_features.*.string' => 'Each custom feature must be a string.',
            'custom_usage_limits.array' => 'Custom usage limits must be an array.',
            'custom_usage_limits.*.integer' => 'Each usage limit must be an integer.',
            'custom_usage_limits.*.min' => 'Usage limits must be at least 0.',
            'promo_code.max' => 'Promo code cannot exceed 50 characters.',
            'notes.max' => 'Notes cannot exceed 500 characters.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'plan' => 'subscription plan',
            'amount' => 'subscription amount',
            'currency' => 'currency',
            'billing_cycle' => 'billing cycle',
            'payment_method' => 'payment method',
            'auto_renew' => 'auto renew',
            'start_date' => 'start date',
            'custom_features' => 'custom features',
            'custom_usage_limits' => 'custom usage limits',
            'promo_code' => 'promo code',
            'notes' => 'notes',
        ];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY)
        );
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'currency' => $this->currency ?? 'GHS',
            'auto_renew' => $this->boolean('auto_renew'),
            'start_date' => $this->start_date ? date('Y-m-d', strtotime($this->start_date)) : null,
            'custom_features' => $this->custom_features ?? [],
            'custom_usage_limits' => $this->custom_usage_limits ?? [],
        ]);
    }

    /**
     * Check if this is a custom plan.
     */
    public function isCustomPlan(): bool
    {
        return $this->plan === 'custom';
    }

    /**
     * Check if auto renew is enabled.
     */
    public function isAutoRenew(): bool
    {
        return $this->boolean('auto_renew');
    }

    /**
     * Check if custom features are provided.
     */
    public function hasCustomFeatures(): bool
    {
        return !empty($this->custom_features);
    }

    /**
     * Check if custom usage limits are provided.
     */
    public function hasCustomUsageLimits(): bool
    {
        return !empty($this->custom_usage_limits);
    }

    /**
     * Check if promo code is provided.
     */
    public function hasPromoCode(): bool
    {
        return $this->filled('promo_code');
    }

    /**
     * Get the default plan amount based on plan and billing cycle.
     */
    public function getDefaultAmount(): float
    {
        $planAmounts = [
            'starter' => [
                'monthly' => 50.00,
                'quarterly' => 135.00,
                'yearly' => 480.00,
            ],
            'professional' => [
                'monthly' => 150.00,
                'quarterly' => 405.00,
                'yearly' => 1440.00,
            ],
            'enterprise' => [
                'monthly' => 500.00,
                'quarterly' => 1350.00,
                'yearly' => 4800.00,
            ],
        ];

        return $planAmounts[$this->plan][$this->billing_cycle] ?? 0.00;
    }
}
