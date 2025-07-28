<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UssdCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'flow_id',
        'code',
        'name',
        'description',
        'status',
        'telco',
        'settings',
        'usage_count',
        'last_used_at',
        'activated_at',
    ];

    protected $casts = [
        'settings' => 'array',
        'last_used_at' => 'datetime',
        'activated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the USSD code.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the flow associated with the USSD code.
     */
    public function flow(): BelongsTo
    {
        return $this->belongsTo(Flow::class);
    }

    /**
     * Get the sessions for this USSD code.
     */
    public function sessions(): HasMany
    {
        return $this->hasMany(Session::class, 'ussd_code', 'code');
    }

    /**
     * Get the analytics for this USSD code.
     */
    public function analytics(): HasMany
    {
        return $this->hasMany(Analytics::class);
    }

    /**
     * Scope a query to only include active codes.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include pending codes.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include codes for a specific telco.
     */
    public function scopeForTelco($query, string $telco)
    {
        return $query->where('telco', $telco)->orWhere('telco', 'all');
    }

    /**
     * Scope a query to only include codes for a specific user.
     */
    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Check if the code is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if the code is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the code is suspended.
     */
    public function isSuspended(): bool
    {
        return $this->status === 'suspended';
    }

    /**
     * Activate the USSD code.
     */
    public function activate(): void
    {
        $this->update([
            'status' => 'active',
            'activated_at' => now(),
        ]);
    }

    /**
     * Deactivate the USSD code.
     */
    public function deactivate(): void
    {
        $this->update([
            'status' => 'inactive',
        ]);
    }

    /**
     * Suspend the USSD code.
     */
    public function suspend(): void
    {
        $this->update([
            'status' => 'suspended',
        ]);
    }

    /**
     * Increment the usage count.
     */
    public function incrementUsage(): void
    {
        $this->increment('usage_count');
        $this->update(['last_used_at' => now()]);
    }

    /**
     * Check if the code supports a specific telco.
     */
    public function supportsTelco(string $telco): bool
    {
        return $this->telco === 'all' || $this->telco === $telco;
    }

    /**
     * Get the formatted code with asterisks.
     */
    public function getFormattedCodeAttribute(): string
    {
        return '*' . $this->code . '#';
    }

    /**
     * Get the display name with code.
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->name . ' (' . $this->formatted_code . ')';
    }
}
