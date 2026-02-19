<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
    ];

    // Relationships
    public function phoneNumbers()
    {
        return $this->hasMany(PhoneNumber::class);
    }

    // Methods
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
