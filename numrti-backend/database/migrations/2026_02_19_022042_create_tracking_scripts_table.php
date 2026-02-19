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
        Schema::create('tracking_scripts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');                    // اسم الكود (مثل: Facebook Pixel, GTM, إلخ)
            $table->text('code');                       // الكود نفسه (script tag أو JS snippet)
            $table->enum('page', [                      // الصفحة اللي هيظهر فيها
                'global',       // كل الصفحات
                'home',         // الصفحة الرئيسية
                'numbers',      // صفحة الأرقام
                'number_detail',// تفاصيل رقم
                'cart',         // السلة
                'checkout',     // صفحة الدفع (الخطوة التانية في السلة)
                'thank_you',    // بعد تأكيد الطلب (صفحة طلباتي)
                'blog',         // المدونة
                'contact',      // اتصل بنا
                'auth',         // تسجيل الدخول
            ]);
            $table->enum('position', [                  // مكان الحقن
                'head',         // داخل <head>
                'body_start',   // أول <body>
                'body_end',     // آخر <body>
            ])->default('head');
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracking_scripts');
    }
};
