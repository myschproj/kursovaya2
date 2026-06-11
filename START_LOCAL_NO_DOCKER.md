# Запуск проекта локально без Docker и PostgreSQL

Эта версия проекта использует SQLite, поэтому PostgreSQL, psql, Docker и WSL не нужны.

## 1. Проверить Node.js

```powershell
node -v
npm -v
```

## 2. Запустить backend

Открой первый терминал PowerShell:

```powershell
cd C:\Users\Александр\Downloads\elevator-control-course-local\backend
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

Backend будет доступен по адресу:

```text
http://localhost:3000/api/health
```

## 3. Запустить frontend

Открой второй терминал PowerShell:

```powershell
cd C:\Users\Александр\Downloads\elevator-control-course-local\frontend
npm install
npm run dev
```

Frontend будет доступен по адресу:

```text
http://localhost:5173
```

## Демо-вход

```text
admin@example.com
admin123
```

Дополнительные пользователи:

```text
dispatcher@example.com / dispatcher123
passenger@example.com / passenger123
```

## Быстрый запуск через BAT

Можно дважды кликнуть по файлу `start-local.bat`. Он установит зависимости, создаст SQLite-базу, заполнит демо-данные и откроет два окна: backend и frontend.
