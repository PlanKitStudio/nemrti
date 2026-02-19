<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('phone_numbers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('number')->unique();
            $table->decimal('price', 10, 2);
            $table->uuid('category_id')->nullable();
            $table->enum('provider', ['vodafone', 'orange', 'etisalat', 'we']);
            $table->string('pattern_type')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_sold')->default(false);
            $table->integer('views_count')->default(0);
            $table->text('description')->nullable();
            $table->json('features')->nullable();
            $table->string('image_url')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            // Foreign keys
            $table->foreign('category_id')
                  ->references('id')
                  ->on('categories')
                  ->onDelete('set null');
            
            // Indexes for better performance
            $table->index(['is_sold', 'is_featured']);
            $table->index('provider');
            $table->index('price');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('phone_numbers');
    }
};
