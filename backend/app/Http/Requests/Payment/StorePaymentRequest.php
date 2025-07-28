<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;

class StorePaymentRequest extends FormRequest
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
            'type' => 'required|string|in:subscription,ussd_code,addon,credit,refund',
            'amount' => 'required|numeric|min:0.01',
            'currency' => 'sometimes|string|in:GHS,USD,NGN|default:GHS',
            'payment_method' => 'required|string|in:card,mobile_money,bank_transfer,wallet',
            'subscription_id' => 'sometimes|integer|exists:subscriptions,id',
            'description' => 'sometimes|string|max:255',
            'metadata' => 'sometimes|array',
            'metadata.*' => 'string',
            'callback_url' => 'sometimes|url',
            'redirect_url' => 'sometimes|url',
            'expires_in_hours' => 'sometimes|integer|min:1|max:72',
            'customer_email' => 'sometimes|email',
            'customer_phone' => 'sometimes|string|regex:/^(\+233|0)[0-9]{9}$/',
            'customer_name' => 'sometimes|string|max:100',
            'reference_prefix' => 'sometimes|string|max:10',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'type.required' => 'Payment type is required.',
            'type.in' => 'The selected payment type is invalid.',
            'amount.required' => 'Payment amount is required.',
            'amount.numeric' => 'The amount must be a valid number.',
            'amount.min' => 'The amount must be at least 0.01.',
            'currency.in' => 'The selected currency is not supported.',
            'payment_method.required' => 'Payment method is required.',
            'payment_method.in' => 'The selected payment method is invalid.',
            'subscription_id.exists' => 'The selected subscription does not exist.',
            'description.max' => 'Description cannot exceed 255 characters.',
            'metadata.array' => 'Metadata must be an array.',
            'metadata.*.string' => 'Each metadata value must be a string.',
            'callback_url.url' => 'Callback URL must be a valid URL.',
            'redirect_url.url' => 'Redirect URL must be a valid URL.',
            'expires_in_hours.integer' => 'Expiration hours must be an integer.',
            'expires_in_hours.min' => 'Expiration hours must be at least 1.',
            'expires_in_hours.max' => 'Expiration hours cannot exceed 72.',
            'customer_email.email' => 'Customer email must be a valid email address.',
            'customer_phone.regex' => 'Customer phone number format is invalid.',
            'customer_name.max' => 'Customer name cannot exceed 100 characters.',
            'reference_prefix.max' => 'Reference prefix cannot exceed 10 characters.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'type' => 'payment type',
            'amount' => 'payment amount',
            'currency' => 'currency',
            'payment_method' => 'payment method',
            'subscription_id' => 'subscription',
            'description' => 'description',
            'metadata' => 'metadata',
            'callback_url' => 'callback URL',
            'redirect_url' => 'redirect URL',
            'expires_in_hours' => 'expiration hours',
            'customer_email' => 'customer email',
            'customer_phone' => 'customer phone',
            'customer_name' => 'customer name',
            'reference_prefix' => 'reference prefix',
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
            'expires_in_hours' => $this->expires_in_hours ? (int) $this->expires_in_hours : 24,
            'metadata' => $this->metadata ?? [],
        ]);
    }

    /**
     * Check if this is a subscription payment.
     */
    public function isSubscriptionPayment(): bool
    {
        return $this->type === 'subscription';
    }

    /**
     * Check if this is a USSD code payment.
     */
    public function isUssdCodePayment(): bool
    {
        return $this->type === 'ussd_code';
    }

    /**
     * Check if this is an addon payment.
     */
    public function isAddonPayment(): bool
    {
        return $this->type === 'addon';
    }

    /**
     * Check if this is a credit payment.
     */
    public function isCreditPayment(): bool
    {
        return $this->type === 'credit';
    }

    /**
     * Check if this is a refund payment.
     */
    public function isRefundPayment(): bool
    {
        return $this->type === 'refund';
    }

    /**
     * Check if subscription ID is required for this payment type.
     */
    public function requiresSubscriptionId(): bool
    {
        return in_array($this->type, ['subscription', 'addon']);
    }

    /**
     * Check if customer information is provided.
     */
    public function hasCustomerInfo(): bool
    {
        return $this->filled('customer_email') || $this->filled('customer_phone') || $this->filled('customer_name');
    }

    /**
     * Check if callback URL is provided.
     */
    public function hasCallbackUrl(): bool
    {
        return $this->filled('callback_url');
    }

    /**
     * Check if redirect URL is provided.
     */
    public function hasRedirectUrl(): bool
    {
        return $this->filled('redirect_url');
    }

    /**
     * Get the default expiration time in hours.
     */
    public function getDefaultExpirationHours(): int
    {
        $defaultExpirations = [
            'subscription' => 24,
            'ussd_code' => 48,
            'addon' => 24,
            'credit' => 72,
            'refund' => 24,
        ];

        return $defaultExpirations[$this->type] ?? 24;
    }

    /**
     * Validate subscription ID requirement.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($this->requiresSubscriptionId() && !$this->filled('subscription_id')) {
                $validator->errors()->add('subscription_id', 'Subscription ID is required for ' . $this->type . ' payments.');
            }
        });
    }
}
