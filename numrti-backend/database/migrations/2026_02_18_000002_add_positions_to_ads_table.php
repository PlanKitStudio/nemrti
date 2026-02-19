<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Change ENUM position column to include new positions
        DB::statement("ALTER TABLE `ads` MODIFY `position` ENUM('header','sidebar','footer','inline','home-mid','numbers-header','numbers-inline','numbers-footer','blog-header','blog-inline','blog-footer') DEFAULT 'header'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE `ads` MODIFY `position` ENUM('header','sidebar','footer','inline','blog-header','blog-inline','blog-footer') DEFAULT 'header'");
    }
};
