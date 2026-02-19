<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_name')->nullable()->after('notes');
            $table->string('customer_phone')->nullable()->after('customer_name');
            $table->string('customer_whatsapp')->nullable()->after('customer_phone');
            $table->string('customer_city')->nullable()->after('customer_whatsapp');
            $table->text('customer_address')->nullable()->after('customer_city');
            $table->string('payment_proof')->nullable()->after('customer_address');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'customer_name',
                'customer_phone',
                'customer_whatsapp',
                'customer_city',
                'customer_address',
                'payment_proof',
            ]);
        });
    }
};
