<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
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
            'phone_number_id' => $this->phone_number_id,
            'phone_number' => $this->phone_number,
            'phone_number_details' => new PhoneNumberResource($this->whenLoaded('phoneNumber')),
            'price' => $this->price,
        ];
    }
}
