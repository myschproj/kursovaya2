@echo off
chcp 65001 >nul
set "ROOT=%~dp0"
echo ==========================================
echo  Локальный запуск без Docker/PostgreSQL
echo ==========================================

echo.
echo [1/4] Установка backend-зависимостей...
cd /d "%ROOT%backend"
call npm install
if errorlevel 1 pause & exit /b 1

echo.
echo [2/4] Подготовка SQLite-базы Prisma...
call npx prisma generate
if errorlevel 1 pause & exit /b 1
call npx prisma db push
if errorlevel 1 pause & exit /b 1
call npm run seed
if errorlevel 1 pause & exit /b 1

echo.
echo [3/4] Установка frontend-зависимостей...
cd /d "%ROOT%frontend"
call npm install
if errorlevel 1 pause & exit /b 1

echo.
echo [4/4] Запуск серверов...
start "Elevator Backend" cmd /k "cd /d ""%ROOT%backend"" && npm run dev"
start "Elevator Frontend" cmd /k "cd /d ""%ROOT%frontend"" && npm run dev"

echo.
echo Готово. Через несколько секунд открой:
echo http://localhost:5173
echo.
echo Логин: admin@example.com
echo Пароль: admin123
echo.
pause
