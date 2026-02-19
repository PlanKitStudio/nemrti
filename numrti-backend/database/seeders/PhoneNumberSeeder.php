<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\PhoneNumber;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PhoneNumberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();
        
        if ($categories->isEmpty()) {
            $this->command->error('Categories table is empty. Run CategorySeeder first.');
            return;
        }

        $phoneNumbers = [
            // أرقام مميزة (Featured)
            [
                'number' => '01000000000',
                'price' => 50000,
                'provider' => 'vodafone',
                'category_id' => $categories->firstWhere('slug', 'featured')->id,
                'description' => 'رقم مميز جداً - جميع الأرقام أصفار',
                'features' => ['رقم نادر', 'سهل الحفظ', 'مميز للشركات'],
                'is_featured' => true,
                'image_url' => 'https://via.placeholder.com/400x300?text=VIP+Number',
            ],
            [
                'number' => '01111111111',
                'price' => 45000,
                'provider' => 'orange',
                'category_id' => $categories->firstWhere('slug', 'featured')->id,
                'description' => 'رقم مميز - جميع الأرقام واحد',
                'features' => ['رقم نادر', 'سهل الحفظ جداً', 'VIP'],
                'is_featured' => true,
                'image_url' => 'https://via.placeholder.com/400x300?text=Premium',
            ],
            [
                'number' => '01234567890',
                'price' => 30000,
                'provider' => 'etisalat',
                'category_id' => $categories->firstWhere('slug', 'sequential')->id,
                'description' => 'رقم متتالي من 0 إلى 9',
                'features' => ['أرقام متتالية', 'سهل الحفظ', 'فريد'],
                'is_featured' => true,
                'image_url' => 'https://via.placeholder.com/400x300?text=Sequential',
            ],
            
            // أرقام سهلة الحفظ
            [
                'number' => '01012341234',
                'price' => 5000,
                'provider' => 'vodafone',
                'category_id' => $categories->firstWhere('slug', 'easy')->id,
                'description' => 'رقم سهل الحفظ - تكرار 1234',
                'features' => ['سهل الحفظ', 'مكرر'],
                'is_featured' => false,
            ],
            [
                'number' => '01055555555',
                'price' => 15000,
                'provider' => 'vodafone',
                'category_id' => $categories->firstWhere('slug', 'similar')->id,
                'description' => 'رقم فودافون - أرقام متكررة',
                'features' => ['سهل الحفظ', 'أرقام متطابقة'],
                'is_featured' => false,
            ],
            [
                'number' => '01122334455',
                'price' => 8000,
                'provider' => 'orange',
                'category_id' => $categories->firstWhere('slug', 'similar')->id,
                'description' => 'رقم مزدوج - كل رقمين متشابهين',
                'features' => ['سهل الحفظ', 'نمط مميز'],
                'is_featured' => false,
            ],
            
            // أرقام متتالية
            [
                'number' => '01098765432',
                'price' => 12000,
                'provider' => 'etisalat',
                'category_id' => $categories->firstWhere('slug', 'sequential')->id,
                'description' => 'أرقام متتالية عكسية',
                'features' => ['متتالي عكسي', 'مميز'],
                'is_featured' => false,
            ],
            [
                'number' => '01123456789',
                'price' => 10000,
                'provider' => 'vodafone',
                'category_id' => $categories->firstWhere('slug', 'sequential')->id,
                'description' => 'أرقام متتالية من 1 إلى 9',
                'features' => ['متتالي', 'سهل الحفظ'],
                'is_featured' => false,
            ],
            
            // أرقام VIP
            [
                'number' => '01222222222',
                'price' => 35000,
                'provider' => 'orange',
                'category_id' => $categories->firstWhere('slug', 'featured')->id,
                'description' => 'رقم VIP - جميع الأرقام 2',
                'features' => ['VIP', 'نادر', 'للشركات'],
                'is_featured' => true,
                'image_url' => 'https://via.placeholder.com/400x300?text=VIP+2222',
            ],
            [
                'number' => '01099999999',
                'price' => 40000,
                'provider' => 'etisalat',
                'category_id' => $categories->firstWhere('slug', 'featured')->id,
                'description' => 'رقم VIP - جميع الأرقام 9',
                'features' => ['VIP', 'نادر جداً', 'للأعمال'],
                'is_featured' => true,
                'image_url' => 'https://via.placeholder.com/400x300?text=VIP+9999',
            ],
            
            // أرقام عادية بأسعار معقولة
            [
                'number' => '01012345678',
                'price' => 2500,
                'provider' => 'vodafone',
                'category_id' => $categories->firstWhere('slug', 'easy')->id,
                'description' => 'رقم فودافون جيد',
                'features' => ['سعر مناسب'],
                'is_featured' => false,
            ],
            [
                'number' => '01156789012',
                'price' => 3000,
                'provider' => 'orange',
                'category_id' => $categories->firstWhere('slug', 'easy')->id,
                'description' => 'رقم أورانج جيد',
                'features' => ['سعر جيد'],
                'is_featured' => false,
            ],
            [
                'number' => '01201234567',
                'price' => 2800,
                'provider' => 'vodafone',
                'category_id' => $categories->firstWhere('slug', 'easy')->id,
                'description' => 'رقم عادي بسعر مناسب',
                'features' => ['اقتصادي'],
                'is_featured' => false,
            ],
            [
                'number' => '01154321234',
                'price' => 3500,
                'provider' => 'orange',
                'category_id' => $categories->firstWhere('slug', 'sequential')->id,
                'description' => 'رقم بنمط جميل',
                'features' => ['نمط مميز'],
                'is_featured' => false,
            ],
            [
                'number' => '01067890123',
                'price' => 4500,
                'provider' => 'etisalat',
                'category_id' => $categories->firstWhere('slug', 'easy')->id,
                'description' => 'رقم اتصالات مميز',
                'features' => ['جودة عالية'],
                'is_featured' => false,
            ],
            [
                'number' => '01501234567',
                'price' => 2200,
                'provider' => 'we',
                'category_id' => $categories->firstWhere('slug', 'easy')->id,
                'description' => 'رقم WE بسعر ممتاز',
                'features' => ['سعر مناسب', 'WE'],
                'is_featured' => false,
            ],
            [
                'number' => '01098887777',
                'price' => 18000,
                'provider' => 'etisalat',
                'category_id' => $categories->firstWhere('slug', 'similar')->id,
                'description' => 'رقم مميز بتكرار 7 و 8',
                'features' => ['أرقام مكررة', 'مميز'],
                'is_featured' => false,
            ],
            [
                'number' => '01145454545',
                'price' => 8500,
                'provider' => 'orange',
                'category_id' => $categories->firstWhere('slug', 'similar')->id,
                'description' => 'رقم إيقاعي - تكرار 45',
                'features' => ['إيقاعي', 'سهل الحفظ'],
                'is_featured' => false,
            ],
            [
                'number' => '01277777777',
                'price' => 25000,
                'provider' => 'vodafone',
                'category_id' => $categories->firstWhere('slug', 'featured')->id,
                'description' => 'رقم VIP - سبع سبعات',
                'features' => ['VIP', 'أرقام متطابقة'],
                'is_featured' => true,
                'image_url' => 'https://via.placeholder.com/400x300?text=Lucky+7',
            ],
            [
                'number' => '01023232323',
                'price' => 6500,
                'provider' => 'vodafone',
                'category_id' => $categories->firstWhere('slug', 'easy')->id,
                'description' => 'رقم بنمط 23 متكرر',
                'features' => ['نمط متكرر', 'سهل'],
                'is_featured' => false,
            ],
        ];

        foreach ($phoneNumbers as $phoneNumber) {
            PhoneNumber::create($phoneNumber);
        }

        // إضافة مشاهدات عشوائية
        PhoneNumber::all()->each(function ($phone) {
            $phone->views_count = rand(10, 500);
            $phone->save();
        });

        $this->command->info('✅ تم إضافة ' . count($phoneNumbers) . ' رقم بنجاح!');
    }
}
