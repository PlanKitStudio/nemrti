<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        // Seed default payment settings
        DB::table('payment_settings')->insert([
            ['key' => 'vodafone_cash_number', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'vodafone_cash_name', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'instapay_number', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'instapay_name', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'bank_name', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'bank_account_number', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'bank_account_name', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'bank_iban', 'value' => '', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_settings');
    }
};
