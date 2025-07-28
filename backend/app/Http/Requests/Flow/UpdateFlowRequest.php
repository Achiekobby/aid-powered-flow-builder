<?php

namespace App\Http\Requests\Flow;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateFlowRequest extends FormRequest
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
            'name' => 'sometimes|required|string|max:255|min:3',
            'description' => 'sometimes|nullable|string|max:1000',
            'flow_data' => 'sometimes|nullable|array',
            'flow_data.nodes' => 'sometimes|nullable|array',
            'flow_data.edges' => 'sometimes|nullable|array',
            'flow_data.viewport' => 'sometimes|nullable|array',
            'variables' => 'sometimes|nullable|array',
            'is_active' => 'sometimes|boolean',
            'is_template' => 'sometimes|boolean',
            'category' => 'sometimes|nullable|string|max:100',
            'tags' => 'sometimes|nullable|string|max:500',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Flow name is required',
            'name.string' => 'Flow name must be a string',
            'name.max' => 'Flow name cannot exceed 255 characters',
            'name.min' => 'Flow name must be at least 3 characters',
            'description.string' => 'Description must be a string',
            'description.max' => 'Description cannot exceed 1000 characters',
            'flow_data.array' => 'Flow data must be an array',
            'flow_data.nodes.array' => 'Flow nodes must be an array',
            'flow_data.edges.array' => 'Flow edges must be an array',
            'flow_data.viewport.array' => 'Flow viewport must be an array',
            'variables.array' => 'Variables must be an array',
            'is_active.boolean' => 'Active status must be true or false',
            'is_template.boolean' => 'Template status must be true or false',
            'category.string' => 'Category must be a string',
            'category.max' => 'Category cannot exceed 100 characters',
            'tags.string' => 'Tags must be a string',
            'tags.max' => 'Tags cannot exceed 500 characters',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'name' => 'flow name',
            'description' => 'flow description',
            'flow_data' => 'flow data',
            'flow_data.nodes' => 'flow nodes',
            'flow_data.edges' => 'flow edges',
            'flow_data.viewport' => 'flow viewport',
            'variables' => 'flow variables',
            'is_active' => 'active status',
            'is_template' => 'template status',
            'category' => 'flow category',
            'tags' => 'flow tags',
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
            ], 422)
        );
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Only process fields that are present in the request
        $data = [];

        if ($this->has('name')) {
            $data['name'] = trim($this->name);
        }

        if ($this->has('description')) {
            $data['description'] = $this->description ? trim($this->description) : null;
        }

        if ($this->has('category')) {
            $data['category'] = $this->category ? trim($this->category) : null;
        }

        if ($this->has('tags')) {
            $data['tags'] = $this->tags ? trim($this->tags) : null;
        }

        if ($this->has('is_active')) {
            $data['is_active'] = $this->boolean('is_active');
        }

        if ($this->has('is_template')) {
            $data['is_template'] = $this->boolean('is_template');
        }

        // Ensure arrays are properly formatted
        if ($this->has('flow_data')) {
            if (!is_array($this->flow_data)) {
                $data['flow_data'] = [];
            } else {
                $data['flow_data'] = $this->flow_data;
            }
        }

        if ($this->has('variables')) {
            if (!is_array($this->variables)) {
                $data['variables'] = [];
            } else {
                $data['variables'] = $this->variables;
            }
        }

        $this->merge($data);
    }

    /**
     * Get validated data with additional processing.
     */
    public function validated($key = null, $default = null)
    {
        $validated = parent::validated($key, $default);

        // Ensure flow_data has proper structure if provided
        if (isset($validated['flow_data']) && is_array($validated['flow_data'])) {
            $validated['flow_data'] = array_merge([
                'nodes' => [],
                'edges' => [],
                'viewport' => ['x' => 0, 'y' => 0, 'zoom' => 1],
            ], $validated['flow_data']);
        }

        return $validated;
    }

    /**
     * Check if the request is updating flow_data.
     */
    public function isUpdatingFlowData(): bool
    {
        return $this->has('flow_data') && !empty($this->flow_data);
    }

    /**
     * Check if the request is updating the flow name.
     */
    public function isUpdatingName(): bool
    {
        return $this->has('name') && !empty($this->name);
    }

    /**
     * Check if the request is updating the active status.
     */
    public function isUpdatingActiveStatus(): bool
    {
        return $this->has('is_active');
    }
}
