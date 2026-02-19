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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('order_number')->nullable()->unique()->after('id');
        });

        // Generate order numbers for existing orders
        $orders = \App\Models\Order::orderBy('created_at')->get();
        $counter = 1;
        foreach ($orders as $order) {
            $order->update(['order_number' => 'ORD-' . str_pad($counter, 5, '0', STR_PAD_LEFT)]);
            $counter++;
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('order_number');
        });
    }
};
