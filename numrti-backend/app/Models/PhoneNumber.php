<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PhoneNumber extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'number',
        'price',
        'category_id',
        'provider',
        'pattern_type',
        'is_featured',
        'is_sold',
        'views_count',
        'description',
        'features',
        'image_url',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_sold' => 'boolean',
        'views_count' => 'integer',
        'features' => 'array',
    ];

    protected $with = ['category'];

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('is_sold', false);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeByProvider($query, $provider)
    {
        return $query->where('provider', $provider);
    }

    public function scopePriceRange($query, $min, $max)
    {
        return $query->whereBetween('price', [$min, $max]);
    }

    public function scopeFilter($query, array $filters)
    {
        if (isset($filters['search'])) {
            $query->where('number', 'like', '%' . $filters['search'] . '%');
        }

        if (isset($filters['provider'])) {
            $query->byProvider($filters['provider']);
        }

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['price_min']) && isset($filters['price_max'])) {
            $query->priceRange($filters['price_min'], $filters['price_max']);
        }

        if (isset($filters['is_featured'])) {
            $query->where('is_featured', $filters['is_featured']);
        }

        if (isset($filters['is_available']) && $filters['is_available']) {
            $query->available();
        }

        return $query;
    }

    // Methods
    public function incrementViews()
    {
        $this->increment('views_count');
    }

    public function markAsSold()
    {
        $this->update(['is_sold' => true]);
    }
}
