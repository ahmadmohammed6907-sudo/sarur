# 🚀 منصة سرور (Sarur Platform) - نسخة SaaS المطورة

منصة متكاملة لربط المستقلين، الوكالات، والشركات في نظام بيئي متميز. تم تطوير هذه النسخة لتكون جاهزة للإنتاج بجودة تجارية مع التركيز على الأداء، الأمان، والـ SEO.

## ✨ المميزات الرئيسية المطورة

### 1. 🏗️ بنية تحتية قوية (Infrastructure)
- **معالجة أخطاء موحدة:** نظام `AppError` المركزي لجميع أنواع الأخطاء.
- **خدمات مفصلة (Service Layer):** فصل منطق العمل عن الـ API لسهولة الصيانة والاختبار.
- **نظام تسجيل مركزي (Logging):** تتبع شامل لجميع الأحداث والأخطاء.
- **أمان متقدم:** حماية من CSRF, XSS, SQL Injection، وتحديد معدل الطلبات (Rate Limiting).

### 2. ⚡ أداء فائق (Performance)
- **تحسين الصور:** استخدام Next.js Image Optimization و WebP.
- **استراتيجية Caching:** نظام تخزين مؤقت متقدم مع stale-while-revalidate.
- **مراقبة Web Vitals:** تتبع مقاييس الأداء الأساسية لضمان تجربة مستخدم سريعة.
- **تحسين الـ Bundle:** تطبيق Code Splitting و Dynamic Imports.

### 3. 🔍 تهيئة محركات البحث (SEO)
- **Sitemap ديناميكي:** يشمل جميع الخدمات، المشاريع، والمستقلين.
- **Structured Data:** دعم كامل لـ JSON-LD (Organization, Product, Service, FAQ).
- **Meta Tags محسّنة:** لكل صفحة بشكل تلقائي.
- **Robots.txt:** ملف robots محسّن لجميع أنواع الـ crawlers.

### 4. 🛠️ استقرار ومراقبة (Stability)
- **Health Check API:** مراقبة صحة المنصة وقاعدة البيانات.
- **Error Pages:** صفحات خطأ (404, 500) مخصصة وودية.
- **تحقق من البيانات:** استخدام Zod للتحقق من صحة جميع المدخلات.

## 🚀 البدء السريع

### المتطلبات الأساسية
- Node.js 18+
- PostgreSQL
- npm / pnpm / yarn

### التثبيت
```bash
# تثبيت التبعيات
npm install

# إعداد قاعدة البيانات
npm run db:push

# تشغيل المشروع في وضع التطوير
npm run dev
```

## 📂 هيكل المشروع المطور

- `src/services/`: طبقة الخدمات (Business Logic).
- `src/lib/errors.ts`: نظام معالجة الأخطاء الموحد.
- `src/lib/security.ts`: مساعدات الأمان والتحقق.
- `src/lib/cache.ts`: نظام التخزين المؤقت.
- `src/lib/seo.ts`: مساعدات الـ SEO.
- `src/lib/logger.ts`: نظام التسجيل المركزي.
- `src/app/api/health/`: نقطة نهاية فحص الصحة.

## 🔒 متغيرات البيئة (.env)

تأكد من إعداد المتغيرات التالية:
- `DATABASE_URL`: رابط قاعدة بيانات PostgreSQL.
- `NEXT_PUBLIC_APP_URL`: رابط المنصة الرئيسي.
- `NEXT_PUBLIC_ANALYTICS_ENDPOINT`: (اختياري) رابط تتبع البيانات.

## 🛠️ الأوامر المتاحة

- `npm run dev`: تشغيل وضع التطوير.
- `npm run build`: بناء المشروع للإنتاج.
- `npm run start`: تشغيل النسخة المبنية.
- `npm run typecheck`: فحص أنواع TypeScript.
- `npm run lint`: فحص جودة الكود.

## 📄 التوثيق الإضافي

- [Audit_Report.md](./Audit_Report.md): تقرير التدقيق الشامل.
- [Refactoring_Plan.md](./Refactoring_Plan.md): خطة إعادة الهيكلة.
- [Performance_SEO_Strategy.md](./Performance_SEO_Strategy.md): استراتيجية الأداء والـ SEO.

---
تم التطوير بواسطة **Manus AI** لضمان أعلى معايير الجودة والاحترافية.
