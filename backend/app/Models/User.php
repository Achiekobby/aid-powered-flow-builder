<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'company',
        'phone',
        'country',
        'subscription_plan',
        'is_active',
        'is_admin',
        'settings',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'settings' => 'array',
        'is_active' => 'boolean',
        'is_admin' => 'boolean',
        'password' => 'hashed',
    ];

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute()
    {
        return $this->name;
    }

    /**
     * Check if user is an admin.
     */
    public function isAdmin()
    {
        return $this->is_admin;
    }

    /**
     * Check if user account is active.
     */
    public function isActive()
    {
        return $this->is_active;
    }

    /**
     * Update last login timestamp.
     */
    public function updateLastLogin()
    {
        $this->update(['last_login_at' => now()]);
    }

    public function flows()
    {
        return $this->hasMany(Flow::class);
    }

    public function ussdCodes()
    {
        return $this->hasMany(UssdCode::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function sessions()
    {
        return $this->hasMany(Session::class);
    }

    public function analytics()
    {
        return $this->hasMany(Analytics::class);
    }
}
