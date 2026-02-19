<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.phone_number_id' => ['required', 'uuid', 'exists:phone_numbers,id'],
            'items.*.quantity' => ['nullable', 'integer', 'min:1'],
            'payment_method' => ['nullable', 'string', 'in:cash,bank_transfer,vodafone_cash,instapay'],
            'coupon_code' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:20'],
            'customer_whatsapp' => ['nullable', 'string', 'max:20'],
            'customer_city' => ['nullable', 'string', 'max:100'],
            'customer_address' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'يجب إضافة أرقام للطلب',
            'items.min' => 'يجب إضافة رقم واحد على الأقل',
            'items.*.phone_number_id.required' => 'معرف الرقم مطلوب',
            'items.*.phone_number_id.uuid' => 'معرف الرقم غير صالح',
            'items.*.phone_number_id.exists' => 'الرقم غير موجود أو تم حذفه، يرجى تحديث السلة',
            'payment_method.in' => 'طريقة الدفع غير صالحة',
            'customer_name.required' => 'الاسم مطلوب',
            'customer_phone.required' => 'رقم الموبايل مطلوب',
        ];
    }
}
