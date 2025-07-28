<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FlowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'flow_data' => $this->flow_data,
            'variables' => $this->variables,
            'is_active' => $this->is_active,
            'is_template' => $this->is_template,
            'category' => $this->category,
            'tags' => $this->tags,
            'version' => $this->version,
            'usage_count' => $this->usage_count,
            'last_used_at' => $this->last_used_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ],
        ];
    }
}
