<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PhoneNumberResource extends JsonResource
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
            'number' => $this->number,
            'price' => $this->price,
            'provider' => $this->provider,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'description' => $this->description,
            'features' => $this->features,
            'is_featured' => $this->is_featured,
            'is_sold' => $this->is_sold,
            'views_count' => $this->views_count,
            'image_url' => $this->image_url,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
