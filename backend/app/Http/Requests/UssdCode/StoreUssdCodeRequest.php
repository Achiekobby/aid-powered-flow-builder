<?php

namespace App\Http\Requests\UssdCode;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreUssdCodeRequest extends FormRequest
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
            'code' => 'required|string|regex:/^\d{3,6}$/|unique:ussd_codes,code',
            'name' => 'required|string|max:255',
            'description' => 'sometimes|string|max:1000',
            'flow_id' => 'sometimes|integer|exists:flows,id',
            'telco' => 'sometimes|in:mtn,telecel,AirtelTigo,all',
            'settings' => 'sometimes|array',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'code.required' => 'USSD code is required',
            'code.string' => 'USSD code must be a string',
            'code.regex' => 'USSD code must be 3-6 digits',
            'code.unique' => 'USSD code is already taken',
            'name.required' => 'Name is required',
            'name.string' => 'Name must be a string',
            'name.max' => 'Name cannot exceed 255 characters',
            'description.string' => 'Description must be a string',
            'description.max' => 'Description cannot exceed 1000 characters',
            'flow_id.integer' => 'Flow ID must be an integer',
            'flow_id.exists' => 'Flow not found',
            'telco.in' => 'Telco must be one of: mtn, telecel, AirtelTigo, all',
            'settings.array' => 'Settings must be an array',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'code' => 'USSD code',
            'name' => 'name',
            'description' => 'description',
            'flow_id' => 'flow ID',
            'telco' => 'telco',
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
            'code' => trim($this->code),
            'name' => trim($this->name),
            'description' => $this->description ? trim($this->description) : null,
        ]);
    }
}
