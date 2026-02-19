<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ad extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'image_url',
        'target_url',
        'position',
        'size',
        'is_active',
        'budget',
        'start_date',
        'end_date',
        'impressions_count',
        'clicks_count',
        'conversions_count',
        'priority',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'budget' => 'decimal:2',
        'impressions_count' => 'integer',
        'clicks_count' => 'integer',
        'conversions_count' => 'integer',
        'priority' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Relationships
    public function events()
    {
        return $this->hasMany(AdEvent::class);
    }

    public function impressions()
    {
        return $this->hasMany(AdEvent::class)->where('event_type', 'impression');
    }

    public function clicks()
    {
        return $this->hasMany(AdEvent::class)->where('event_type', 'click');
    }

    public function conversions()
    {
        return $this->hasMany(AdEvent::class)->where('event_type', 'conversion');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('start_date')
                    ->orWhere('start_date', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', now());
            });
    }

    public function scopeForPosition($query, string $position)
    {
        return $query->where('position', $position);
    }

    // Computed
    public function getCtrAttribute(): float
    {
        if ($this->impressions_count === 0) return 0;
        return round(($this->clicks_count / $this->impressions_count) * 100, 2);
    }

    public function getConversionRateAttribute(): float
    {
        if ($this->clicks_count === 0) return 0;
        return round(($this->conversions_count / $this->clicks_count) * 100, 2);
    }
}
