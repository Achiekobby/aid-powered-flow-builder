<?php

namespace App\Http\Requests\Payment;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;

class UpdatePaymentRequest extends FormRequest
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
            'status' => 'sometimes|string|in:pending,completed,failed,cancelled,refunded',
            'gateway_response' => 'sometimes|array',
            'gateway_response.*' => 'string',
            'metadata' => 'sometimes|array',
            'metadata.*' => 'string',
            'description' => 'sometimes|string|max:255',
            'paid_at' => 'sometimes|date',
            'expires_at' => 'sometimes|date|after:now',
            'refund_reason' => 'sometimes|string|max:500',
            'refund_amount' => 'sometimes|numeric|min:0.01',
            'refund_metadata' => 'sometimes|array',
            'refund_metadata.*' => 'string',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'status.in' => 'The selected status is invalid.',
            'gateway_response.array' => 'Gateway response must be an array.',
            'gateway_response.*.string' => 'Each gateway response value must be a string.',
            'metadata.array' => 'Metadata must be an array.',
            'metadata.*.string' => 'Each metadata value must be a string.',
            'description.max' => 'Description cannot exceed 255 characters.',
            'paid_at.date' => 'Paid at must be a valid date.',
            'expires_at.date' => 'Expires at must be a valid date.',
            'expires_at.after' => 'Expires at must be in the future.',
            'refund_reason.max' => 'Refund reason cannot exceed 500 characters.',
            'refund_amount.numeric' => 'Refund amount must be a valid number.',
            'refund_amount.min' => 'Refund amount must be at least 0.01.',
            'refund_metadata.array' => 'Refund metadata must be an array.',
            'refund_metadata.*.string' => 'Each refund metadata value must be a string.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'status' => 'payment status',
            'gateway_response' => 'gateway response',
            'metadata' => 'metadata',
            'description' => 'description',
            'paid_at' => 'paid at',
            'expires_at' => 'expires at',
            'refund_reason' => 'refund reason',
            'refund_amount' => 'refund amount',
            'refund_metadata' => 'refund metadata',
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
            'gateway_response' => $this->gateway_response ?? [],
            'metadata' => $this->metadata ?? [],
            'refund_metadata' => $this->refund_metadata ?? [],
            'paid_at' => $this->paid_at ? date('Y-m-d H:i:s', strtotime($this->paid_at)) : null,
            'expires_at' => $this->expires_at ? date('Y-m-d H:i:s', strtotime($this->expires_at)) : null,
        ]);
    }

    /**
     * Check if updating the status.
     */
    public function isUpdatingStatus(): bool
    {
        return $this->filled('status');
    }

    /**
     * Check if updating gateway response.
     */
    public function isUpdatingGatewayResponse(): bool
    {
        return $this->has('gateway_response');
    }

    /**
     * Check if updating metadata.
     */
    public function isUpdatingMetadata(): bool
    {
        return $this->has('metadata');
    }

    /**
     * Check if updating description.
     */
    public function isUpdatingDescription(): bool
    {
        return $this->filled('description');
    }

    /**
     * Check if updating paid at timestamp.
     */
    public function isUpdatingPaidAt(): bool
    {
        return $this->filled('paid_at');
    }

    /**
     * Check if updating expiration time.
     */
    public function isUpdatingExpiresAt(): bool
    {
        return $this->filled('expires_at');
    }

    /**
     * Check if this is a refund update.
     */
    public function isRefundUpdate(): bool
    {
        return $this->filled('refund_reason') || $this->filled('refund_amount');
    }

    /**
     * Check if updating refund metadata.
     */
    public function isUpdatingRefundMetadata(): bool
    {
        return $this->has('refund_metadata');
    }

    /**
     * Check if status is being changed to completed.
     */
    public function isMarkingAsCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if status is being changed to failed.
     */
    public function isMarkingAsFailed(): bool
    {
        return $this->status === 'failed';
    }

    /**
     * Check if status is being changed to cancelled.
     */
    public function isMarkingAsCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    /**
     * Check if status is being changed to refunded.
     */
    public function isMarkingAsRefunded(): bool
    {
        return $this->status === 'refunded';
    }

    /**
     * Validate refund amount against original payment amount.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            if ($this->isRefundUpdate() && $this->filled('refund_amount')) {
                // This validation would need the original payment amount
                // which would be available in the controller
                if ($this->refund_amount <= 0) {
                    $validator->errors()->add('refund_amount', 'Refund amount must be greater than 0.');
                }
            }

            if ($this->isMarkingAsRefunded() && !$this->filled('refund_reason')) {
                $validator->errors()->add('refund_reason', 'Refund reason is required when marking payment as refunded.');
            }
        });
    }
}
