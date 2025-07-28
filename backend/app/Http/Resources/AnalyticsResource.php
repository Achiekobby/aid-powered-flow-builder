<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnalyticsResource extends JsonResource
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
            'ussd_code_id' => $this->ussd_code_id,
            'session_id' => $this->session_id,
            'phone_number' => $this->phone_number,
            'event_type' => $this->event_type,
            'event_data' => $this->event_data,
            'node_id' => $this->node_id,
            'user_input' => $this->user_input,
            'duration' => $this->duration,
            'telco' => $this->telco,
            'location' => $this->location,
            'device_info' => $this->device_info,
            'error_message' => $this->error_message,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            // Relationships
            'user' => $this->whenLoaded('user', function () {
                return new UserResource($this->user);
            }),
            'flow' => $this->whenLoaded('flow', function () {
                return new FlowResource($this->flow);
            }),
            'ussd_code' => $this->whenLoaded('ussdCode', function () {
                return new UssdCodeResource($this->ussdCode);
            }),

            // Computed attributes
            'is_session_event' => $this->isSessionEvent(),
            'is_node_event' => $this->isNodeEvent(),
            'is_input_event' => $this->isInputEvent(),
            'is_error_event' => $this->isErrorEvent(),
            'is_payment_event' => $this->isPaymentEvent(),
            'event_type_label' => $this->event_type_label,
            'formatted_duration' => $this->formatted_duration,
        ];
    }
}
