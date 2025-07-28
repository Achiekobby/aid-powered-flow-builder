<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flow extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'flow_data',
        'variables',
        'is_active',
        'is_template',
        'category',
        'tags',
        'version',
        'usage_count',
        'last_used_at',
    ];

    protected $casts = [
        'flow_data' => 'array',
        'variables' => 'array',
        'is_active' => 'boolean',
        'is_template' => 'boolean',
        'last_used_at' => 'datetime',
    ];

    /**
     * Get the user that owns the flow.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the sessions for this flow.
     */
    public function sessions()
    {
        return $this->hasMany(Session::class);
    }

    /**
     * Get the USSD codes for this flow.
     */
    public function ussdCodes()
    {
        return $this->hasMany(UssdCode::class);
    }

    /**
     * Get the analytics for this flow.
     */
    public function analytics()
    {
        return $this->hasMany(Analytics::class);
    }

    /**
     * Scope a query to only include active flows.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include templates.
     */
    public function scopeTemplates($query)
    {
        return $query->where('is_template', true);
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Get the most popular flows.
     */
    public function scopePopular($query, $limit = 10)
    {
        return $query->orderBy('usage_count', 'desc')->limit($limit);
    }

    /**
     * Check if flow is active.
     */
    public function isActive()
    {
        return $this->is_active;
    }

    /**
     * Check if flow is a template.
     */
    public function isTemplate()
    {
        return $this->is_template;
    }

    /**
     * Activate the flow.
     */
    public function activate()
    {
        $this->update(['is_active' => true]);
    }

    /**
     * Deactivate the flow.
     */
    public function deactivate()
    {
        $this->update(['is_active' => false]);
    }

    /**
     * Increment usage count.
     */
    public function incrementUsage()
    {
        $this->increment('usage_count');
        $this->update(['last_used_at' => now()]);
    }
}
