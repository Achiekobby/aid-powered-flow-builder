<?php

namespace App\Http\Requests\UssdCode;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;

class UpdateUssdCodeRequest extends FormRequest
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
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|max:1000',
            'status' => 'sometimes|string|in:active,inactive,pending,suspended',
            'telco' => 'sometimes|string|in:mtn,telecel,AirtelTigo,all',
            'flow_id' => 'sometimes|integer|exists:flows,id',
            'settings' => 'sometimes|array',
            'settings.*' => 'string',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.max' => 'Name cannot exceed 255 characters.',
            'description.max' => 'Description cannot exceed 1000 characters.',
            'status.in' => 'The selected status is invalid.',
            'telco.in' => 'The selected telco is invalid.',
            'flow_id.exists' => 'The selected flow does not exist.',
            'settings.array' => 'Settings must be an array.',
            'settings.*.string' => 'Each setting value must be a string.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'USSD code name',
            'description' => 'description',
            'status' => 'status',
            'telco' => 'telco',
            'flow_id' => 'flow',
            'settings' => 'settings',
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
            'settings' => $this->settings ?? [],
        ]);
    }

    /**
     * Check if updating the name.
     */
    public function isUpdatingName(): bool
    {
        return $this->filled('name');
    }

    /**
     * Check if updating the description.
     */
    public function isUpdatingDescription(): bool
    {
        return $this->filled('description');
    }

    /**
     * Check if updating the status.
     */
    public function isUpdatingStatus(): bool
    {
        return $this->filled('status');
    }

    /**
     * Check if updating the telco.
     */
    public function isUpdatingTelco(): bool
    {
        return $this->filled('telco');
    }

    /**
     * Check if updating the flow assignment.
     */
    public function isUpdatingFlowAssignment(): bool
    {
        return $this->has('flow_id');
    }

    /**
     * Check if updating settings.
     */
    public function isUpdatingSettings(): bool
    {
        return $this->has('settings');
    }

    /**
     * Check if status is being changed to active.
     */
    public function isActivating(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if status is being changed to inactive.
     */
    public function isDeactivating(): bool
    {
        return $this->status === 'inactive';
    }

    /**
     * Check if status is being changed to suspended.
     */
    public function isSuspending(): bool
    {
        return $this->status === 'suspended';
    }

    /**
     * Check if flow is being assigned.
     */
    public function isAssigningFlow(): bool
    {
        return $this->filled('flow_id');
    }

    /**
     * Check if flow is being unassigned.
     */
    public function isUnassigningFlow(): bool
    {
        return $this->flow_id === null;
    }
}
