<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use Illuminate\Database\Seeder;

class BlogCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'أخبار',
                'slug' => 'news',
                'description' => 'آخر أخبار الأرقام والعروض',
            ],
            [
                'name' => 'نصائح',
                'slug' => 'tips',
                'description' => 'نصائح لاختيار رقم مناسب',
            ],
            [
                'name' => 'عروض',
                'slug' => 'offers',
                'description' => 'أحدث العروض والتخفيضات',
            ],
            [
                'name' => 'تحديثات',
                'slug' => 'updates',
                'description' => 'تحديثات النظام والميزات الجديدة',
            ],
        ];

        foreach ($categories as $category) {
            BlogCategory::create($category);
        }

        $this->command->info('Blog categories created successfully!');
    }
}
