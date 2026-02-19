<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'أرقام مميزة',
                'slug' => 'featured',
                'description' => 'أرقام مميزة ومتسلسلة',
                'icon' => '⭐',
            ],
            [
                'name' => 'أرقام متشابهة',
                'slug' => 'similar',
                'description' => 'أرقام متشابهة ومتناسقة',
                'icon' => '🔄',
            ],
            [
                'name' => 'أرقام متسلسلة',
                'slug' => 'sequential',
                'description' => 'أرقام بتسلسل منتظم',
                'icon' => '📊',
            ],
            [
                'name' => 'أرقام سهلة الحفظ',
                'slug' => 'easy',
                'description' => 'أرقام سهلة التذكر',
                'icon' => '🧠',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        $this->command->info('Categories created successfully!');
    }
}
