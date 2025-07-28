<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UssdCodeResource extends JsonResource
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
            'user_id' => $this->user_id,
            'flow_id' => $this->flow_id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'status' => $this->status,
            'telco' => $this->telco,
            'settings' => $this->settings,
            'usage_count' => $this->usage_count,
            'last_used_at' => $this->last_used_at?->toISOString(),
            'activated_at' => $this->activated_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            // Relationships
            'user' => $this->whenLoaded('user', function () {
                return new UserResource($this->user);
            }),
            'flow' => $this->whenLoaded('flow', function () {
                return new FlowResource($this->flow);
            }),
            'sessions_count' => $this->when(isset($this->sessions_count), $this->sessions_count),
            'analytics_count' => $this->when(isset($this->analytics_count), $this->analytics_count),

            // Computed attributes
            'is_active' => $this->isActive(),
            'is_pending' => $this->isPending(),
            'is_suspended' => $this->isSuspended(),
            'formatted_code' => $this->formatted_code,
            'display_name' => $this->display_name,
        ];
    }
}
