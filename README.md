<<<<<<< HEAD
# 🎯 نمرتي - منصة بيع الأرقام المميزة

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-11-red?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![MySQL](https://img.shields.io/badge/MySQL-8-orange?style=for-the-badge&logo=mysql)

**منصة متكاملة لبيع أرقام الموبايل المميزة في مصر** 📱✨

[البدء السريع](#-التثبيت-والتشغيل) • [المميزات](#-الميزات) • [الوثائق](#-الوثائق) • [API](#-api-endpoints)

</div>

---

## 📌 **نظرة عامة**

**نمرتي** منصة إلكترونية حديثة تتيح للمستخدمين:
- 🔍 تصفح آلاف الأرقام المميزة
- 🛒 الشراء الآمن والسريع
- 📊 تتبع الطلبات
- 📝 قراءة المدونة
- 💬 التواصل مع الدعم

**كل شيء جاهز ويعمل!** ✅

---

## 🏗️ **التقنيات**

### Backend:
- **Laravel 11** + **Sanctum** (Authentication)
- **MySQL** (Database)
- **Spatie Permissions** (Authorization)

### Frontend:
- **React 18** + **TypeScript**
- **Vite** + **Tailwind CSS**
- **TanStack Query** + **Axios**
- **Shadcn UI Components**

---

## 🚀 **التثبيت والتشغيل**

### **المتطلبات:**
```
PHP >= 8.2
Composer
Node.js >= 18
MySQL >= 8.0
```

### **1. Backend:**
```bash
cd numrti-backend
composer install
cp .env.example .env
php artisan key:generate

# تحديث .env بمعلومات MySQL
php artisan migrate:fresh --seed
php artisan serve
# ✅ http://localhost:8000
```

### **2. Frontend:**
```bash
npm install
npm run dev
# ✅ http://localhost:8080
```

**هذا كل شيء! 🎉**

---

## 🔑 **الحسابات**

| النوع | البريد | كلمة المرور |
|------|--------|-------------|
| Admin | admin@numrti.com | admin123 |
| User | user@numrti.com | user123 |

---

## ✨ **الميزات**

### **للمستخدمين:**
✅ تصفح 20+ رقم مميز
✅ بحث وفلاتر متقدمة
✅ السلة والطلبات
✅ تتبع الطلبات
✅ المدونة (6 مقالات)
✅ التواصل مع الدعم

### **للأدمن:**
✅ لوحة تحكم شاملة
✅ إدارة الأرقام والطلبات
✅ إدارة المستخدمين
✅ إدارة المدونة والرسائل
✅ إحصائيات مباشرة

---

## 📊 **البيانات التجريبية**

بعد تشغيل السيدر:
- **20 رقم** (2,200 - 50,000 ج)
- **6 مقالات** بلوج
- **5 طلبات** (مكتملة، معلقة، ملغية)
- **7 رسائل** تواصل
- **4 فئات** أرقام
- **2 مستخدمين** (admin + user)

---

## 📡 **API Endpoints**

### Authentication:
```
POST   /api/register
POST   /api/login
POST   /api/logout
GET    /api/profile
```

### Phone Numbers:
```
GET    /api/phone-numbers
GET    /api/phone-numbers/{id}
GET    /api/phone-numbers/featured
GET    /api/phone-numbers/search
```

### Orders:
```
GET    /api/orders
POST   /api/orders
GET    /api/orders/{id}
```

### Admin:
```
GET    /api/admin/stats
GET    /api/admin/users
POST   /api/admin/phone-numbers
...
```

**لكل التفاصيل:** [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)

---

## 📖 **الوثائق**

| الملف | الوصف |
|------|-------|
| [QUICK_START.md](QUICK_START.md) | **البدء السريع** ⭐ |
| [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md) | الدليل الشامل |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | خطة التطوير |
| [LARAVEL_CODE_EXAMPLES.md](LARAVEL_CODE_EXAMPLES.md) | أمثلة الكود |

---

## 🎯 **سريع جداً!**

```bash
# Backend
cd numrti-backend && php artisan serve

# Frontend (نافذة جديدة)
npm run dev

# افتح المتصفح
http://localhost:8080

# سجل دخول
admin@numrti.com / admin123
```

**🎉 الآن كل شيء يعمل!**

---

## 📸 **لقطات الشاشة**

*(يمكن إضافة صور لاحقاً)*

---

## 🗺️ **Roadmap**

- [x] Backend Laravel كامل
- [x] Frontend React متكامل
- [x] Authentication & Authorization
- [x] Phone Numbers Management
- [x] Orders System
- [x] Blog System
- [x] Contact System
- [ ] Admin Dashboard UI
- [ ] Upload Images
- [ ] Pagination
- [ ] Favorites System
- [ ] Payment Gateway
- [ ] Notifications

---

## 🤝 **المساهمة**

نرحب بالمساهمات!
1. Fork المشروع
2. أنشئ Branch (`git checkout -b feature/Amazing`)
3. Commit (`git commit -m 'Add Amazing'`)
4. Push (`git push origin feature/Amazing`)
5. افتح Pull Request

---

## 📝 **License**

MIT License - راجع [LICENSE](LICENSE)

---

## 📞 **الاتصال**

- **Email:** info@numrti.com
- **GitHub:** [Your GitHub]

---

## 💖 **شكراً!**

إذا أعجبك المشروع، أعطه ⭐ على GitHub!

---

<div align="center">

**Built with ❤️ in Egypt**

[⬆ العودة للأعلى](#-نمرتي---منصة-بيع-الأرقام-المميزة)

</div>
=======
# nemrti
nemrti - Front &amp; Back
>>>>>>> 847fe0239f2e07c7ff58c95e73a664ce21b4d9fa
