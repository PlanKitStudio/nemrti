<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'order_number' => $this->order_number,
            'user' => new UserResource($this->whenLoaded('user')),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'total_price' => $this->total_price,
            'payment_method' => $this->payment_method,
            'coupon_code' => $this->coupon_code,
            'discount_amount' => $this->discount_amount,
            'status' => $this->status,
            'notes' => $this->notes,
            'customer_name' => $this->customer_name,
            'customer_phone' => $this->customer_phone,
            'customer_whatsapp' => $this->customer_whatsapp,
            'customer_city' => $this->customer_city,
            'customer_address' => $this->customer_address,
            'payment_proof' => $this->payment_proof ? url('storage/' . $this->payment_proof) : null,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
