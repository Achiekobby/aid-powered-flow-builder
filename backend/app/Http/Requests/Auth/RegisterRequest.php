<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegisterRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|min:2',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string|min:8',
            'company' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20|unique:users,phone',
            'country' => 'nullable|string|max:100',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Name is required',
            'name.min' => 'Name must be at least 2 characters',
            'name.max' => 'Name cannot exceed 255 characters',

            'email.required' => 'Email is required',
            'email.email' => 'Please provide a valid email address',
            'email.unique' => 'This email is already registered',
            'email.max' => 'Email cannot exceed 255 characters',

            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 8 characters',
            'password.confirmed' => 'Password confirmation does not match',

            'password_confirmation.required' => 'Password confirmation is required',
            'password_confirmation.min' => 'Password confirmation must be at least 8 characters',

            'company.max' => 'Company name cannot exceed 255 characters',

            'phone.max' => 'Phone number cannot exceed 20 characters',
            'phone.unique' => 'This phone number is already registered',

            'country.max' => 'Country name cannot exceed 100 characters',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array
     */
    public function attributes(): array
    {
        return [
            'name' => 'full name',
            'email' => 'email address',
            'password' => 'password',
            'password_confirmation' => 'password confirmation',
            'company' => 'company name',
            'phone' => 'phone number',
            'country' => 'country',
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422)
        );
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $this->merge([
            'name' => trim($this->name),
            'email' => strtolower(trim($this->email)),
            'company' => $this->company ? trim($this->company) : null,
            'phone' => $this->phone ? trim($this->phone) : null,
            'country' => $this->country ? trim($this->country) : 'Ghana',
        ]);
    }
}
