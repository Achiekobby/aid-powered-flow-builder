<?php

namespace App\Http\Requests\Analytics;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\JsonResponse;

class GetAnalyticsRequest extends FormRequest
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
            'start_date' => 'sometimes|date|before_or_equal:end_date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'flow_id' => 'sometimes|integer|exists:flows,id',
            'ussd_code_id' => 'sometimes|integer|exists:ussd_codes,id',
            'event_type' => 'sometimes|string|in:session_started,session_completed,session_expired,node_visited,user_input,payment_initiated,payment_completed,payment_failed,error_occurred',
            'phone_number' => 'sometimes|string|regex:/^(\+233|0)[0-9]{9}$/',
            'telco' => 'sometimes|string|in:mtn,telecel,AirtelTigo,all',
            'group_by' => 'sometimes|string|in:day,week,month,flow,ussd_code,event_type,telco',
            'limit' => 'sometimes|integer|min:1|max:100',
            'page' => 'sometimes|integer|min:1',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'start_date.before_or_equal' => 'Start date must be before or equal to end date.',
            'end_date.after_or_equal' => 'End date must be after or equal to start date.',
            'flow_id.exists' => 'The selected flow does not exist.',
            'ussd_code_id.exists' => 'The selected USSD code does not exist.',
            'event_type.in' => 'The event type must be one of the valid event types.',
            'phone_number.regex' => 'The phone number format is invalid.',
            'telco.in' => 'The telco must be one of the valid telcos.',
            'group_by.in' => 'The group by field must be one of the valid grouping options.',
            'limit.min' => 'The limit must be at least 1.',
            'limit.max' => 'The limit cannot exceed 100.',
            'page.min' => 'The page number must be at least 1.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'start_date' => 'start date',
            'end_date' => 'end date',
            'flow_id' => 'flow',
            'ussd_code_id' => 'USSD code',
            'event_type' => 'event type',
            'phone_number' => 'phone number',
            'telco' => 'telco',
            'group_by' => 'group by',
            'limit' => 'limit',
            'page' => 'page',
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
            'start_date' => $this->start_date ? date('Y-m-d', strtotime($this->start_date)) : null,
            'end_date' => $this->end_date ? date('Y-m-d', strtotime($this->end_date)) : null,
            'limit' => $this->limit ? (int) $this->limit : 20,
            'page' => $this->page ? (int) $this->page : 1,
        ]);
    }

    /**
     * Check if filtering by date range.
     */
    public function hasDateRange(): bool
    {
        return $this->filled('start_date') && $this->filled('end_date');
    }

    /**
     * Check if filtering by flow.
     */
    public function hasFlowFilter(): bool
    {
        return $this->filled('flow_id');
    }

    /**
     * Check if filtering by USSD code.
     */
    public function hasUssdCodeFilter(): bool
    {
        return $this->filled('ussd_code_id');
    }

    /**
     * Check if filtering by event type.
     */
    public function hasEventTypeFilter(): bool
    {
        return $this->filled('event_type');
    }

    /**
     * Check if grouping is requested.
     */
    public function hasGrouping(): bool
    {
        return $this->filled('group_by');
    }
}
