<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePhoneNumberRequest extends FormRequest
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
        return [
            'number' => ['required', 'string', 'unique:phone_numbers,number', 'regex:/^[0-9]{11}$/'],
            'price' => ['required', 'numeric', 'min:0'],
            'provider' => ['required', 'in:vodafone,orange,etisalat,we'],
            'category_id' => ['required', 'uuid', 'exists:categories,id'],
            'description' => ['nullable', 'string'],
            'features' => ['nullable', 'array'],
            'is_featured' => ['boolean'],
            'image_url' => ['nullable', 'url'],
        ];
    }
}
