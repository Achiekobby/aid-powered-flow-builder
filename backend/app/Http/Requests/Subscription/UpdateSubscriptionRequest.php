<?php

namespace App\Http\Requests\Subscription;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;

class UpdateSubscriptionRequest extends FormRequest
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
            'plan' => 'sometimes|string|in:starter,professional,enterprise,custom',
            'amount' => 'sometimes|numeric|min:0',
            'currency' => 'sometimes|string|in:GHS,USD,NGN',
            'billing_cycle' => 'sometimes|string|in:monthly,quarterly,yearly',
            'status' => 'sometimes|string|in:active,pending,cancelled,expired',
            'auto_renew' => 'sometimes|boolean',
            'end_date' => 'sometimes|date|after:start_date',
            'next_billing_date' => 'sometimes|date|after:today',
            'custom_features' => 'sometimes|array',
            'custom_features.*' => 'string',
            'custom_usage_limits' => 'sometimes|array',
            'custom_usage_limits.*' => 'integer|min:0',
            'notes' => 'sometimes|string|max:500',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'plan.in' => 'The selected plan is invalid.',
            'amount.numeric' => 'The amount must be a valid number.',
            'amount.min' => 'The amount must be at least 0.',
            'currency.in' => 'The selected currency is not supported.',
            'billing_cycle.in' => 'The selected billing cycle is invalid.',
            'status.in' => 'The selected status is invalid.',
            'auto_renew.boolean' => 'Auto renew must be true or false.',
            'end_date.after' => 'End date must be after start date.',
            'next_billing_date.after' => 'Next billing date must be in the future.',
            'custom_features.array' => 'Custom features must be an array.',
            'custom_features.*.string' => 'Each custom feature must be a string.',
            'custom_usage_limits.array' => 'Custom usage limits must be an array.',
            'custom_usage_limits.*.integer' => 'Each usage limit must be an integer.',
            'custom_usage_limits.*.min' => 'Usage limits must be at least 0.',
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
            'status' => 'status',
            'auto_renew' => 'auto renew',
            'end_date' => 'end date',
            'next_billing_date' => 'next billing date',
            'custom_features' => 'custom features',
            'custom_usage_limits' => 'custom usage limits',
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
            'auto_renew' => $this->has('auto_renew') ? $this->boolean('auto_renew') : null,
            'end_date' => $this->end_date ? date('Y-m-d', strtotime($this->end_date)) : null,
            'next_billing_date' => $this->next_billing_date ? date('Y-m-d', strtotime($this->next_billing_date)) : null,
            'custom_features' => $this->custom_features ?? [],
            'custom_usage_limits' => $this->custom_usage_limits ?? [],
        ]);
    }

    /**
     * Check if updating the plan.
     */
    public function isUpdatingPlan(): bool
    {
        return $this->filled('plan');
    }

    /**
     * Check if updating the amount.
     */
    public function isUpdatingAmount(): bool
    {
        return $this->filled('amount');
    }

    /**
     * Check if updating the billing cycle.
     */
    public function isUpdatingBillingCycle(): bool
    {
        return $this->filled('billing_cycle');
    }

    /**
     * Check if updating the status.
     */
    public function isUpdatingStatus(): bool
    {
        return $this->filled('status');
    }

    /**
     * Check if updating auto renew.
     */
    public function isUpdatingAutoRenew(): bool
    {
        return $this->has('auto_renew');
    }

    /**
     * Check if updating custom features.
     */
    public function isUpdatingCustomFeatures(): bool
    {
        return $this->has('custom_features');
    }

    /**
     * Check if updating custom usage limits.
     */
    public function isUpdatingCustomUsageLimits(): bool
    {
        return $this->has('custom_usage_limits');
    }

    /**
     * Check if this is a plan upgrade.
     */
    public function isPlanUpgrade(string $currentPlan): bool
    {
        $planHierarchy = ['starter', 'professional', 'enterprise'];
        $currentIndex = array_search($currentPlan, $planHierarchy);
        $newIndex = array_search($this->plan, $planHierarchy);

        return $newIndex !== false && $newIndex > $currentIndex;
    }

    /**
     * Check if this is a plan downgrade.
     */
    public function isPlanDowngrade(string $currentPlan): bool
    {
        $planHierarchy = ['starter', 'professional', 'enterprise'];
        $currentIndex = array_search($currentPlan, $planHierarchy);
        $newIndex = array_search($this->plan, $planHierarchy);

        return $newIndex !== false && $newIndex < $currentIndex;
    }
}
