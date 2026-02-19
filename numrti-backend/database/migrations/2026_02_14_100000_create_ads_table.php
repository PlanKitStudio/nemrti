<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ads', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->string('target_url');
            $table->enum('position', ['header', 'sidebar', 'footer', 'inline', 'blog-header', 'blog-inline', 'blog-footer'])->default('header');
            $table->string('size')->default('728x90');
            $table->boolean('is_active')->default(true);
            $table->decimal('budget', 10, 2)->default(0);
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->unsignedBigInteger('impressions_count')->default(0);
            $table->unsignedBigInteger('clicks_count')->default(0);
            $table->integer('priority')->default(0); // Higher = shown first
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_active', 'position']);
            $table->index(['start_date', 'end_date']);
            $table->index('priority');
        });

        Schema::create('ad_events', function (Blueprint $table) {
            $table->id();
            $table->uuid('ad_id');
            $table->enum('event_type', ['impression', 'click']);
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('page_url')->nullable();
            $table->string('referer')->nullable();
            $table->string('device_type', 20)->nullable(); // mobile, desktop, tablet
            $table->string('country', 100)->nullable();
            $table->string('city', 100)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('ad_id')->references('id')->on('ads')->onDelete('cascade');
            $table->index(['ad_id', 'event_type', 'created_at']);
            $table->index(['event_type', 'created_at']);
            $table->index(['device_type', 'created_at']);
            $table->index('page_url');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_events');
        Schema::dropIfExists('ads');
    }
};
