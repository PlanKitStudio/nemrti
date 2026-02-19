<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TrackingScript extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'name',
        'code',
        'page',
        'position',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (!$model->id) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForPage($query, string $page)
    {
        return $query->whereIn('page', ['global', $page]);
    }

    public function scopeAtPosition($query, string $position)
    {
        return $query->where('position', $position);
    }

    // Get scripts for a specific page and position
    public static function getScripts(string $page, ?string $position = null)
    {
        $query = static::active()
            ->forPage($page)
            ->orderBy('sort_order');

        if ($position) {
            $query->atPosition($position);
        }

        return $query->get();
    }
}
