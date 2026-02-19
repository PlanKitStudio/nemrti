<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\PhoneNumber;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'user@numrti.com')->first();
        $admin = User::where('email', 'admin@numrti.com')->first();
        $phoneNumbers = PhoneNumber::all();
        
        if (!$user || !$admin || $phoneNumbers->isEmpty()) {
            $this->command->error('يجب تشغيل DatabaseSeeder و PhoneNumberSeeder أولاً');
            return;
        }

        // طلب مكتمل للمستخدم
        $order1 = Order::create([
            'user_id' => $user->id,
            'total_price' => 5000,
            'status' => 'completed',
            'notes' => 'طلب سريع',
            'created_at' => now()->subDays(10),
        ]);
        
        $phone1 = $phoneNumbers->where('number', '01012341234')->first();
        if ($phone1) {
            $order1->items()->create([
                'phone_number_id' => $phone1->id,
                'phone_number' => $phone1->number,
                'price' => $phone1->price,
            ]);
            $phone1->markAsSold();
        }

        // طلب معلق للمستخدم
        $order2 = Order::create([
            'user_id' => $user->id,
            'total_price' => 15000,
            'status' => 'pending',
            'notes' => 'في انتظار التأكيد',
            'created_at' => now()->subDays(2),
        ]);
        
        $phone2 = $phoneNumbers->where('number', '01055555555')->first();
        if ($phone2) {
            $order2->items()->create([
                'phone_number_id' => $phone2->id,
                'phone_number' => $phone2->number,
                'price' => $phone2->price,
            ]);
        }

        // طلب مكتمل للأدمن
        $order3 = Order::create([
            'user_id' => $admin->id,
            'total_price' => 50000,
            'status' => 'completed',
            'notes' => 'طلب VIP',
            'created_at' => now()->subDays(15),
        ]);
        
        $phone3 = $phoneNumbers->where('number', '01000000000')->first();
        if ($phone3) {
            $order3->items()->create([
                'phone_number_id' => $phone3->id,
                'phone_number' => $phone3->number,
                'price' => $phone3->price,
            ]);
            $phone3->markAsSold();
        }

        // طلب ملغي
        $order4 = Order::create([
            'user_id' => $user->id,
            'total_price' => 8000,
            'status' => 'cancelled',
            'notes' => 'تم الإلغاء بناءً على طلب العميل',
            'created_at' => now()->subDays(5),
        ]);
        
        $phone4 = $phoneNumbers->where('number', '01122334455')->first();
        if ($phone4) {
            $order4->items()->create([
                'phone_number_id' => $phone4->id,
                'phone_number' => $phone4->number,
                'price' => $phone4->price,
            ]);
        }

        // طلب جديد
        $order5 = Order::create([
            'user_id' => $user->id,
            'total_price' => 30000,
            'status' => 'pending',
            'notes' => 'رقم متتالي للشركة',
            'created_at' => now()->subHours(3),
        ]);
        
        $phone5 = $phoneNumbers->where('number', '01234567890')->first();
        if ($phone5) {
            $order5->items()->create([
                'phone_number_id' => $phone5->id,
                'phone_number' => $phone5->number,
                'price' => $phone5->price,
            ]);
        }

        $this->command->info('✅ تم إضافة 5 طلبات بنجاح!');
    }
}
