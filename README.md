# Система управления лифтами

Курсовой проект: распределенный монолит с отдельным frontend на Vue 3 и backend REST API на Node.js/Express.

## Состав

- `frontend/` - клиентское приложение Vue 3, Vue Router, Pinia, Vuetify, Axios.
- `backend/` - REST API на Express, Prisma ORM, JWT-авторизация.
- `docs/` - UML/ERD диаграммы, мокапы, описание API.
- `docker-compose.yml` - запуск PostgreSQL, backend и frontend.


## Запуск без Docker и PostgreSQL

Эта версия проекта настроена на SQLite. Достаточно Node.js.

### Быстро

Дважды кликнуть `start-local.bat`.

### Вручную

Backend:

```powershell
cd backend
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

Frontend во втором терминале:

```powershell
cd frontend
npm install
npm run dev
```

Открыть: http://localhost:5173

## Быстрый запуск через Docker

```bash
docker compose up --build
```

После запуска:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- Swagger/описание API: см. `docs/api/openapi.yaml`

## Демо-пользователи после seed

- Администратор: `admin@example.com` / `admin123`
- Диспетчер: `dispatcher@example.com` / `dispatcher123`
- Пассажир: `passenger@example.com` / `passenger123`

## Основной функционал

- Авторизация и разграничение доступа по ролям.
- CRUD для пользователей, лифтов, этажей, правил диспетчеризации.
- Создание и отмена вызовов лифта.
- Автоматический выбор оптимального лифта.
- Журнал событий и ошибок.
- Настройки интерфейса: тема, размер шрифта, режим доступности.
- REST API в формате JSON.

## Использованные паттерны

- Strategy - выбор алгоритма диспетчеризации лифта.
- Observer - уведомление интерфейса и журнала о смене статуса лифта.
- Repository - изоляция доступа к базе данных.
