<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'email'             => $this->email,
            'company'           => $this->company,
            'phone'             => $this->phone,
            'country'           => $this->country,
            'subscription_plan' => $this->subscription_plan,
            'is_active'         => $this->is_active,
            'is_admin'          => $this->is_admin,
            'settings'          => $this->settings,
            'email_verified_at' => $this->email_verified_at,
            'last_login_at'     => $this->last_login_at,
            'created_at'        => $this->created_at,
            'updated_at'        => $this->updated_at,
        ];
    }
}
