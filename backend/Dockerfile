FROM node:22-alpine

WORKDIR /app

# نسخ ملفات الحزم
COPY package*.json ./
COPY prisma ./prisma/

# تثبيت كل المكتبات (بما فيها devDeps للـ nest CLI)
RUN npm install --ignore-scripts

# نسخ باقي الكود
COPY . .

# توليد Prisma Client
RUN npx prisma generate

# بناء المشروع
RUN npm run build

# تشغيل السيرفر
CMD ["node", "dist/main"]
