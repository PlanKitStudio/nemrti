# 🚀 Numrti Laravel Backend

Laravel 11 Backend API for Numrti - Phone Number Marketplace

## 📋 Features

- ✅ Laravel 11 with PHP 8.3
- ✅ MySQL Database
- ✅ RESTful API Architecture
- ✅ Laravel Sanctum Authentication
- ✅ Role-Based Access Control (Admin/User)
- ✅ UUID Primary Keys
- ✅ Comprehensive API Resources
- ✅ Form Request Validation
- ✅ Seeded Test Data

## 🛠️ Tech Stack

- **Framework**: Laravel 11
- **Database**: MySQL 8.0+
- **Authentication**: Laravel Sanctum
- **Authorization**: Spatie Laravel Permission
- **PHP**: 8.3+

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts with UUID
- **categories** - Phone number categories
- **phone_numbers** - Phone numbers inventory
- **orders** - Customer orders
- **order_items** - Order line items
- **favorites** - User favorites
- **blog_categories** - Blog categories
- **blog_posts** - Blog articles
- **contacts** - Contact form messages

## 🚀 Quick Start

### Prerequisites
- PHP 8.3 or higher
- Composer
- MySQL 8.0 or higher
- XAMPP/WAMP (for local development)

### Installation

1. **Install dependencies**
   ```bash
   composer install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Update .env file**
   ```env
   DB_CONNECTION=mysql
   DB_DATABASE=numrti
   DB_USERNAME=root
   DB_PASSWORD=
   
   FRONTEND_URL=http://localhost:5173
   ```

4. **Create database**
   - Create database: `numrti` in phpMyAdmin
   - Collation: `utf8mb4_unicode_ci`

5. **Run migrations and seeders**
   ```bash
   php artisan migrate:fresh --seed
   ```

6. **Start the server**
   ```bash
   php artisan serve
   ```
   Server runs on: **http://localhost:8000**

## 👤 Default Accounts

### Admin
- **Email**: admin@numrti.com
- **Password**: admin123

### User
- **Email**: user@numrti.com
- **Password**: user123

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

### API Base URL
```
http://localhost:8000/api
```

### Quick Examples

#### Login
```bash
POST /api/login
{
  "email": "admin@numrti.com",
  "password": "admin123"
}
```

#### Get Phone Numbers
```bash
GET /api/phone-numbers?provider=vodafone&min_price=100
```

#### Create Order (Authenticated)
```bash
POST /api/orders
Authorization: Bearer {token}
{
  "items": [
    {
      "phone_number_id": "uuid",
      "quantity": 1
    }
  ]
}
```

## 📁 Project Structure

```
app/
├── Http/
│   ├── Controllers/Api/    # 8 API Controllers
│   ├── Requests/          # 7 Form Requests
│   ├── Resources/         # 6 API Resources
│   └── Middleware/        # RoleMiddleware
├── Models/                # 9 Eloquent Models
database/
├── migrations/            # 13 Database Migrations
└── seeders/              # 4 Seeders
routes/
└── api.php               # All API Routes
```

## 🔐 Authentication

Use Sanctum tokens:
```http
Authorization: Bearer {your-token}
```

Get token by logging in:
```bash
POST /api/login
POST /api/register
```

## 🧪 Testing

```bash
# Login as admin
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@numrti.com","password":"admin123"}'

# Get phone numbers
curl http://localhost:8000/api/phone-numbers

# Get user (with token)
curl http://localhost:8000/api/user \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔧 Useful Commands

```bash
# Clear cache
php artisan cache:clear
php artisan config:clear

# View routes
php artisan route:list

# Fresh database
php artisan migrate:fresh --seed

# Check migration status
php artisan migrate:status
```

## 📦 Seeded Data

- **4 Categories**: أرقام مميزة، سهلة الحفظ، متتالية، VIP
- **3 Blog Categories**: أخبار، نصائح، تحديثات
- **2 Users**: Admin & Test User
- **Roles & Permissions**: Admin (all), User (limited)

## 🔒 Security

- ✅ Sanctum API Authentication
- ✅ Role-based Authorization
- ✅ Request Validation
- ✅ CSRF Protection
- ✅ SQL Injection Prevention
- ✅ Password Hashing

## 🚀 Production

```bash
# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Update .env
APP_ENV=production
APP_DEBUG=false
```

---

**Status**: ✅ **Ready for Integration**

**Next Steps**: 
1. ✅ Server Running: http://localhost:8000
2. ✅ Database Setup Complete
3. ✅ Test Accounts Ready
4. 📱 Integrate with React Frontend

**Built with ❤️ using Laravel 11**
