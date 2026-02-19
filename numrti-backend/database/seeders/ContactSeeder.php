<?php

namespace Database\Seeders;

use App\Models\Contact;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contacts = [
            [
                'name' => 'محمد أحمد',
                'email' => 'mohamed@example.com',
                'phone' => '01012345678',
                'subject' => 'استفسار عن الأسعار',
                'message' => 'مرحباً، أريد معرفة المزيد عن أسعار الأرقام المميزة وهل يوجد خصومات للشراء بالجملة؟',
                'status' => 'replied',
                'created_at' => now()->subDays(5),
            ],
            [
                'name' => 'فاطمة حسن',
                'email' => 'fatma@example.com',
                'phone' => '01123456789',
                'subject' => 'مشكلة في الطلب',
                'message' => 'قمت بطلب رقم منذ يومين ولم أستلم أي تأكيد. الرجاء المساعدة.',
                'status' => 'read',
                'created_at' => now()->subDays(2),
            ],
            [
                'name' => 'أحمد علي',
                'email' => 'ahmed.ali@example.com',
                'phone' => '01098765432',
                'subject' => 'طلب رقم مخصص',
                'message' => 'هل يمكنكم توفير رقم مخصص بمواصفات معينة؟ أحتاج رقم يحتوي على 777.',
                'status' => 'new',
                'created_at' => now()->subDay(),
            ],
            [
                'name' => 'سارة محمود',
                'email' => 'sara@example.com',
                'phone' => '01156781234',
                'subject' => 'استفسار عن التوصيل',
                'message' => 'كم يستغرق توصيل الرقم بعد الطلب؟ وهل التوصيل مجاني؟',
                'status' => 'new',
                'created_at' => now(),
            ],
            [
                'name' => 'خالد يوسف',
                'email' => 'khaled@example.com',
                'phone' => '01234567890',
                'subject' => 'عرض شراكة',
                'message' => 'أمثل شركة اتصالات وأود مناقشة فرصة شراكة معكم.',
                'status' => 'read',
                'created_at' => now()->subDays(3),
            ],
            [
                'name' => 'نورا حسين',
                'email' => 'nora@example.com',
                'phone' => '01087654321',
                'subject' => 'شكوى',
                'message' => 'الرقم الذي اشتريته لا يعمل بشكل صحيح، أريد استرجاع أموالي.',
                'status' => 'replied',
                'created_at' => now()->subDays(7),
            ],
            [
                'name' => 'عمر فاروق',
                'email' => 'omar@example.com',
                'phone' => '01145678901',
                'subject' => 'استفسار عن طرق الدفع',
                'message' => 'هل تقبلون الدفع بالتقسيط؟ وما هي طرق الدفع المتاحة؟',
                'status' => 'new',
                'created_at' => now()->subHours(5),
            ],
        ];

        foreach ($contacts as $contact) {
            Contact::create($contact);
        }

        $this->command->info('✅ تم إضافة ' . count($contacts) . ' رسالة تواصل بنجاح!');
    }
}
