<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePhoneNumberRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $phoneNumberId = $this->route('phone_number');
        
        return [
            'number' => ['sometimes', 'string', 'unique:phone_numbers,number,' . $phoneNumberId, 'regex:/^[0-9]{11}$/'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'provider' => ['sometimes', 'in:vodafone,orange,etisalat,we'],
            'category_id' => ['sometimes', 'uuid', 'exists:categories,id'],
            'description' => ['nullable', 'string'],
            'features' => ['nullable', 'array'],
            'is_featured' => ['boolean'],
            'is_sold' => ['boolean'],
            'image_url' => ['nullable', 'url'],
        ];
    }
}
