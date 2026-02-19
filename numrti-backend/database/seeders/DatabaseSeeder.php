<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call seeders in order
        $this->call([
            RoleSeeder::class,
            CategorySeeder::class,
            BlogCategorySeeder::class,
        ]);

        // Create super admin user
        $superAdmin = User::create([
            'full_name' => 'Super Admin',
            'email' => 'superadmin@numrti.com',
            'password' => bcrypt('superadmin123'),
            'phone' => '01000000001',
        ]);
        $superAdmin->assignRole('super-admin');

        $this->command->info('Super Admin created: superadmin@numrti.com / superadmin123');

        // Create admin user
        $admin = User::create([
            'full_name' => 'Admin',
            'email' => 'admin@numrti.com',
            'password' => bcrypt('admin123'),
            'phone' => '01000000000',
        ]);
        $admin->assignRole('admin');

        $this->command->info('Admin user created: admin@numrti.com / admin123');

        // Create test user
        $user = User::create([
            'full_name' => 'Test User',
            'email' => 'user@numrti.com',
            'password' => bcrypt('user123'),
            'phone' => '01111111111',
        ]);
        $user->assignRole('user');

        $this->command->info('Test user created: user@numrti.com / user123');
        
        // Call data seeders (must be after users are created)
        $this->call([
            PhoneNumberSeeder::class,
            BlogPostSeeder::class,
            OrderSeeder::class,
            ContactSeeder::class,
            PageSeeder::class,
        ]);
    }
}
