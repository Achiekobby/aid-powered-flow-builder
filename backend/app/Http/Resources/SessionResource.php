<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SessionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'session_id' => $this->session_id,
            'flow_id' => $this->flow_id,
            'flow' => [
                'id' => $this->flow->id,
                'name' => $this->flow->name,
            ],
            'phone_number' => $this->phone_number,
            'ussd_code' => $this->ussd_code,
            'status' => $this->status,
            'session_data' => $this->session_data,
            'user_inputs' => $this->user_inputs,
            'current_node' => $this->current_node,
            'step_count' => $this->step_count,
            'started_at' => $this->started_at?->toISOString(),
            'last_activity_at' => $this->last_activity_at?->toISOString(),
            'expires_at' => $this->expires_at?->toISOString(),
            'completed_at' => $this->completed_at?->toISOString(),
            'duration' => $this->duration,
            'duration_minutes' => $this->duration_minutes,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
} 