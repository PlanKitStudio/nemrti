<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Add conversions_count to ads table
        Schema::table('ads', function (Blueprint $table) {
            $table->unsignedBigInteger('conversions_count')->default(0)->after('clicks_count');
        });

        // Expand event_type enum to include 'conversion' and add fraud columns
        // For SQLite compatibility, we alter the column differently
        if (DB::getDriverName() === 'sqlite') {
            // SQLite doesn't support altering enums; event_type is already a string column
        } else {
            DB::statement("ALTER TABLE ad_events MODIFY COLUMN event_type ENUM('impression', 'click', 'conversion') NOT NULL");
        }

        Schema::table('ad_events', function (Blueprint $table) {
            $table->boolean('is_suspicious')->default(false)->after('city');
            $table->string('fraud_reason', 100)->nullable()->after('is_suspicious');
        });
    }

    public function down(): void
    {
        Schema::table('ads', function (Blueprint $table) {
            $table->dropColumn('conversions_count');
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE ad_events MODIFY COLUMN event_type ENUM('impression', 'click') NOT NULL");
        }

        Schema::table('ad_events', function (Blueprint $table) {
            $table->dropColumn(['is_suspicious', 'fraud_reason']);
        });
    }
};
