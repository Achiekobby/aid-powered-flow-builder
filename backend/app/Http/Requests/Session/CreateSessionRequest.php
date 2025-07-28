<?php

namespace App\Http\Requests\Session;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateSessionRequest extends FormRequest
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
            'flow_id' => 'required|integer|exists:flows,id',
            'phone_number' => 'required|string|regex:/^(\+233|0)[0-9]{9}$/',
            'ussd_code' => 'required|string|regex:/^\d{3,6}$/',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'flow_id.required' => 'Flow ID is required',
            'flow_id.integer' => 'Flow ID must be an integer',
            'flow_id.exists' => 'Flow not found',
            'phone_number.required' => 'Phone number is required',
            'phone_number.string' => 'Phone number must be a string',
            'phone_number.regex' => 'Phone number must be a valid Ghanaian phone number',
            'ussd_code.required' => 'USSD code is required',
            'ussd_code.string' => 'USSD code must be a string',
            'ussd_code.regex' => 'USSD code must be 3-6 digits',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'flow_id' => 'flow ID',
            'phone_number' => 'phone number',
            'ussd_code' => 'USSD code',
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
                'errors' => $validator->errors()
            ], 422)
        );
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Trim whitespace from string inputs
        $this->merge([
            'phone_number' => trim($this->phone_number),
            'ussd_code' => trim($this->ussd_code),
        ]);
    }
} 