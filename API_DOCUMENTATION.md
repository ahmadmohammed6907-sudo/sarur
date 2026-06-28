# 📝 توثيق API - منصة سرور المطورة

يوضح هذا المستند نقاط النهاية (Endpoints) الرئيسية في المنصة وكيفية التعامل معها باستخدام نظام الأخطاء والخدمات الجديد.

## 🛡️ المبادئ العامة

### 1. معالجة الأخطاء
تتبع جميع نقاط النهاية تنسيقاً موحداً للأخطاء:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

### 2. رموز الحالة (Status Codes)
- `200 OK`: نجاح العملية.
- `201 Created`: تم إنشاء المورد بنجاح.
- `400 Bad Request`: خطأ في المدخلات (Validation Error).
- `401 Unauthorized`: غير مصرح (يجب تسجيل الدخول).
- `403 Forbidden`: ليس لديك صلاحيات كافية.
- `404 Not Found`: المورد غير موجود.
- `429 Too Many Requests`: تجاوز معدل الطلبات المسموح.
- `500 Internal Server Error`: خطأ داخلي في الخادم.

## 🔑 المصادقة (Authentication)

### تسجيل الدخول
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Body:** `{ "email": "...", "password": "..." }`

### التسجيل
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Body:** `{ "email": "...", "password": "...", "fullName": "..." }`

## 🏗️ المشاريع (Projects)

### قائمة المشاريع
- **URL:** `/api/projects`
- **Method:** `GET`
- **Query Params:** `category`, `status`, `limit`, `offset`

### إنشاء مشروع
- **URL:** `/api/projects`
- **Method:** `POST`
- **Auth:** Required
- **Body:** `{ "title": "...", "description": "...", "budget": 100 }`

## 🛠️ الخدمات (Services)

### قائمة الخدمات
- **URL:** `/api/services`
- **Method:** `GET`
- **Query Params:** `category`, `minPrice`, `maxPrice`

### تفاصيل خدمة
- **URL:** `/api/services/[id]`
- **Method:** `GET`

## 📊 الصحة والمراقبة (Monitoring)

### فحص الصحة
- **URL:** `/api/health`
- **Method:** `GET`
- **Returns:** تفاصيل حالة الخادم، قاعدة البيانات، واستهلاك الذاكرة.

---
**ملاحظة:** جميع نقاط النهاية تدعم الـ Rate Limiting ورؤوس الأمان (CSP, CSRF) بشكل تلقائي من خلال الـ Middleware المطور.
