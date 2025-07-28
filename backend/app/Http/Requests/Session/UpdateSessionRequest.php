<?php

namespace App\Http\Requests\Session;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;

class UpdateSessionRequest extends FormRequest
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
            'status' => 'sometimes|string|in:active,completed,expired,terminated',
            'session_data' => 'sometimes|array',
            'user_inputs' => 'sometimes|array',
            'user_inputs.*' => 'string',
            'current_node' => 'sometimes|string|max:255',
            'step_count' => 'sometimes|integer|min:0',
            'last_activity_at' => 'sometimes|date',
            'expires_at' => 'sometimes|date|after:now',
            'completed_at' => 'sometimes|date',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'status.in' => 'The selected status is invalid.',
            'session_data.array' => 'Session data must be an array.',
            'user_inputs.array' => 'User inputs must be an array.',
            'user_inputs.*.string' => 'Each user input must be a string.',
            'current_node.max' => 'Current node cannot exceed 255 characters.',
            'step_count.integer' => 'Step count must be an integer.',
            'step_count.min' => 'Step count must be at least 0.',
            'last_activity_at.date' => 'Last activity at must be a valid date.',
            'expires_at.date' => 'Expires at must be a valid date.',
            'expires_at.after' => 'Expires at must be in the future.',
            'completed_at.date' => 'Completed at must be a valid date.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'status' => 'session status',
            'session_data' => 'session data',
            'user_inputs' => 'user inputs',
            'current_node' => 'current node',
            'step_count' => 'step count',
            'last_activity_at' => 'last activity at',
            'expires_at' => 'expires at',
            'completed_at' => 'completed at',
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
            'session_data' => $this->session_data ?? [],
            'user_inputs' => $this->user_inputs ?? [],
            'step_count' => $this->step_count ? (int) $this->step_count : null,
            'last_activity_at' => $this->last_activity_at ? date('Y-m-d H:i:s', strtotime($this->last_activity_at)) : null,
            'expires_at' => $this->expires_at ? date('Y-m-d H:i:s', strtotime($this->expires_at)) : null,
            'completed_at' => $this->completed_at ? date('Y-m-d H:i:s', strtotime($this->completed_at)) : null,
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
     * Check if updating session data.
     */
    public function isUpdatingSessionData(): bool
    {
        return $this->has('session_data');
    }

    /**
     * Check if updating user inputs.
     */
    public function isUpdatingUserInputs(): bool
    {
        return $this->has('user_inputs');
    }

    /**
     * Check if updating current node.
     */
    public function isUpdatingCurrentNode(): bool
    {
        return $this->filled('current_node');
    }

    /**
     * Check if updating step count.
     */
    public function isUpdatingStepCount(): bool
    {
        return $this->filled('step_count');
    }

    /**
     * Check if updating last activity.
     */
    public function isUpdatingLastActivity(): bool
    {
        return $this->filled('last_activity_at');
    }

    /**
     * Check if updating expiration time.
     */
    public function isUpdatingExpiration(): bool
    {
        return $this->filled('expires_at');
    }

    /**
     * Check if updating completion time.
     */
    public function isUpdatingCompletion(): bool
    {
        return $this->filled('completed_at');
    }

    /**
     * Check if status is being changed to completed.
     */
    public function isMarkingAsCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if status is being changed to expired.
     */
    public function isMarkingAsExpired(): bool
    {
        return $this->status === 'expired';
    }

    /**
     * Check if status is being changed to terminated.
     */
    public function isMarkingAsTerminated(): bool
    {
        return $this->status === 'terminated';
    }

    /**
     * Check if this is a session extension.
     */
    public function isExtendingSession(): bool
    {
        return $this->filled('expires_at') && $this->filled('last_activity_at');
    }

    /**
     * Check if this is a session completion.
     */
    public function isCompletingSession(): bool
    {
        return $this->isMarkingAsCompleted() || $this->filled('completed_at');
    }
}
