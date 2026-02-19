<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BlogPostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('email', 'admin@numrti.com')->first();
        $categories = BlogCategory::all();
        
        if (!$admin || $categories->isEmpty()) {
            $this->command->error('يجب تشغيل DatabaseSeeder و BlogCategorySeeder أولاً');
            return;
        }

        $newsCategory = $categories->firstWhere('slug', 'news');
        $tipsCategory = $categories->firstWhere('slug', 'tips');
        $updatesCategory = $categories->firstWhere('slug', 'updates');

        $posts = [
            [
                'title' => 'كيف تختار رقم الهاتف المناسب لعملك؟',
                'slug' => 'how-to-choose-business-phone-number',
                'excerpt' => 'دليل شامل لاختيار رقم هاتف مميز يعكس هوية عملك ويسهل تذكره',
                'content' => "<h2>أهمية اختيار الرقم المناسب</h2>\n<p>رقم الهاتف هو أول نقطة اتصال بينك وبين عملائك، لذلك من المهم اختيار رقم يعكس احترافية عملك.</p>\n\n<h3>معايير اختيار الرقم:</h3>\n<ul>\n<li><strong>سهولة الحفظ:</strong> اختر رقماً يسهل تذكره</li>\n<li><strong>الارتباط بالعلامة التجارية:</strong> حاول أن يحتوي الرقم على أرقام لها علاقة بعملك</li>\n<li><strong>الاحترافية:</strong> تجنب الأرقام العشوائية</li>\n<li><strong>التميز:</strong> رقم مميز يجعل عملك لا يُنسى</li>\n</ul>\n\n<h3>أمثلة على أرقام مميزة للأعمال:</h3>\n<p>الأرقام المتكررة مثل 01000000000 أو الأرقام المتتالية مثل 01234567890 تكون أسهل في التذكر.</p>",
                'category_id' => $tipsCategory->id,
                'author_id' => $admin->id,
                'featured_image' => 'https://placehold.co/800x450/2563eb/ffffff?text=Business+Phone',
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'إطلاق مجموعة جديدة من الأرقام المميزة',
                'slug' => 'new-premium-numbers-launch',
                'excerpt' => 'نعلن عن إطلاق مجموعة جديدة من الأرقام المميزة بأسعار تنافسية',
                'content' => "<h2>أرقام VIP جديدة</h2>\n<p>يسعدنا أن نعلن عن إضافة مجموعة جديدة من الأرقام المميزة إلى مخزوننا.</p>\n\n<h3>ما الجديد؟</h3>\n<ul>\n<li>أرقام بتكرار واحد (مثل 01111111111)</li>\n<li>أرقام متتالية فريدة</li>\n<li>أرقام VIP لجميع الشبكات</li>\n<li>عروض خاصة لفترة محدودة</li>\n</ul>\n\n<p>لا تفوت الفرصة! تصفح المجموعة الجديدة الآن.</p>",
                'category_id' => $newsCategory->id,
                'author_id' => $admin->id,
                'featured_image' => 'https://placehold.co/800x450/16a34a/ffffff?text=New+Numbers',
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'تحديثات على نظام الطلبات',
                'slug' => 'order-system-updates',
                'excerpt' => 'تحسينات جديدة على نظام الطلبات لتجربة أفضل',
                'content' => "<h2>تحديثات مهمة</h2>\n<p>قمنا بتحديث نظام الطلبات لتوفير تجربة أسرع وأكثر سهولة.</p>\n\n<h3>التحسينات الجديدة:</h3>\n<ul>\n<li>عملية دفع أسرع</li>\n<li>تتبع الطلبات بشكل فوري</li>\n<li>إشعارات تلقائية</li>\n<li>دعم فني محسّن</li>\n</ul>",
                'category_id' => $updatesCategory->id,
                'author_id' => $admin->id,
                'featured_image' => 'https://placehold.co/800x450/7c3aed/ffffff?text=System+Update',
                'published_at' => now()->subDay(),
            ],
            [
                'title' => '5 نصائح لحماية رقم هاتفك',
                'slug' => '5-tips-protect-phone-number',
                'excerpt' => 'تعرف على أفضل الممارسات لحماية رقم هاتفك من الاحتيال',
                'content' => "<h2>حماية رقم هاتفك</h2>\n<p>في عصر التكنولوجيا، أصبح حماية رقم الهاتف أمراً ضرورياً.</p>\n\n<h3>النصائح الخمس:</h3>\n<ol>\n<li><strong>لا تشارك رقمك علناً:</strong> تجنب نشر رقمك على المنصات العامة</li>\n<li><strong>استخدم المصادقة الثنائية:</strong> فعّل المصادقة الثنائية على حساباتك</li>\n<li><strong>احذر من الروابط المشبوهة:</strong> لا تنقر على روابط من مصادر مجهولة</li>\n<li><strong>سجل رقمك في قائمة عدم الإزعاج:</strong> لتقليل المكالمات الترويجية</li>\n<li><strong>راقب نشاط رقمك:</strong> تحقق بانتظام من الأنشطة غير المعتادة</li>\n</ol>",
                'category_id' => $tipsCategory->id,
                'author_id' => $admin->id,
                'featured_image' => 'https://placehold.co/800x450/dc2626/ffffff?text=Security+Tips',
                'published_at' => now()->subDays(7),
            ],
            [
                'title' => 'الفرق بين شبكات المحمول في مصر',
                'slug' => 'difference-between-mobile-networks-egypt',
                'excerpt' => 'مقارنة شاملة بين فودافون، أورانج، اتصالات، وWE',
                'content' => "<h2>مقارنة الشبكات</h2>\n<p>دليلك الشامل للاختيار بين شبكات المحمول المختلفة في مصر.</p>\n\n<h3>فودافون:</h3>\n<ul>\n<li>أكبر شبكة في مصر</li>\n<li>تغطية ممتازة</li>\n<li>خدمات متنوعة</li>\n</ul>\n\n<h3>أورانج:</h3>\n<ul>\n<li>عروض تنافسية</li>\n<li>خدمة عملاء جيدة</li>\n<li>شبكة قوية</li>\n</ul>\n\n<h3>اتصالات:</h3>\n<ul>\n<li>أسعار مناسبة</li>\n<li>عروض إنترنت جيدة</li>\n<li>تغطية واسعة</li>\n</ul>\n\n<h3>WE:</h3>\n<ul>\n<li>الأحدث في السوق</li>\n<li>عروض مميزة للشباب</li>\n<li>تكنولوجيا حديثة</li>\n</ul>",
                'category_id' => $tipsCategory->id,
                'author_id' => $admin->id,
                'featured_image' => 'https://placehold.co/800x450/ea580c/ffffff?text=Network+Comparison',
                'published_at' => now()->subDays(10),
            ],
            [
                'title' => 'عرض خاص: خصم 20% على جميع الأرقام المميزة',
                'slug' => 'special-offer-20-discount',
                'excerpt' => 'لفترة محدودة: خصم 20% على جميع الأرقام المميزة',
                'content' => "<h2>عرض لا يُفوّت!</h2>\n<p>لمدة أسبوع فقط، احصل على خصم 20% على جميع الأرقام المميزة.</p>\n\n<h3>تفاصيل العرض:</h3>\n<ul>\n<li>خصم 20% على جميع الأرقام</li>\n<li>سريان العرض لمدة أسبوع</li>\n<li>يشمل أرقام VIP</li>\n<li>لا يوجد حد أدنى للشراء</li>\n</ul>\n\n<p>اطلب الآن واحصل على الرقم الذي تحلم به بسعر مميز!</p>",
                'category_id' => $newsCategory->id,
                'author_id' => $admin->id,
                'featured_image' => 'https://placehold.co/800x450/0891b2/ffffff?text=20%25+OFF',
                'published_at' => now(),
            ],
        ];

        foreach ($posts as $post) {
            BlogPost::create($post);
        }

        $this->command->info('✅ تم إضافة ' . count($posts) . ' مقال بنجاح!');
    }
}
