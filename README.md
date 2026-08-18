# Система заявок

## О проекте

«Система заявок» — небольшое веб-приложение для приёма и обработки заявок. Пользователь создаёт заявку через форму, а сотрудник просматривает список, открывает карточку и меняет статус. Данные хранятся в PostgreSQL и отдаются через REST API.

## Возможности

- Создание заявки с ФИО, email, телефоном, темой и описанием.
- Просмотр списка заявок, отсортированных от новых к старым.
- Просмотр подробной информации по заявке.
- Изменение статуса заявки: новая, в работе, выполнена, отклонена.
- Серверная валидация входящих данных и понятные ошибки в интерфейсе.
- Хранение заявок в реляционной базе данных.

## Технологический стек

| Область | Технологии |
| --- | --- |
| Frontend | React, TypeScript, Vite, React Router |
| Backend | Node.js, TypeScript, Express |
| База данных | PostgreSQL |
| ORM | Prisma |
| Валидация на сервере | Zod |
| Локальная инфраструктура | Docker Compose |
| Контроль версий | Git |
| Пакетный менеджер | pnpm |

## Архитектура

```text
React
 ↓
API service
 ↓
REST API
 ↓
Express
 ↓
Service
 ↓
Repository
 ↓
Prisma
 ↓
PostgreSQL
```

- **Frontend** отображает страницы, собирает пользовательский ввод и вызывает REST API через сервисный слой.
- **API service** выполняет HTTP-запросы к backend и разбирает ответы.
- **REST API** является контрактом между frontend и backend.
- **Routes** сопоставляют HTTP-метод и URL с контроллером.
- **Controllers** принимают запрос, передают данные в сервис и формируют HTTP-ответ.
- **Services** содержат бизнес-логику создания заявки и смены статуса.
- **Repositories** изолируют операции чтения и записи.
- **Prisma** связывает репозитории с PostgreSQL.
- **Schemas** содержат Zod-схемы серверной валидации.
- **Middleware** обрабатывает ошибки и CORS для запросов frontend.

## Структура проекта

```text
request-system/
├── frontend/
│   ├── src/
│   │   ├── errors/          # Ошибки HTTP-слоя frontend
│   │   ├── pages/           # Страницы приложения
│   │   ├── router/          # Маршрутизация
│   │   ├── services/        # Обращение к REST API
│   │   ├── types/           # TypeScript-типы frontend
│   │   ├── utils/           # Форматирование, разбор id, валидация формы
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── backend/
│   ├── prisma/
│   │   ├── migrations/       # Применённые миграции базы
│   │   └── schema.prisma     # Модель заявки и подключение Prisma
│   ├── src/
│   │   ├── config/          # Конфигурация и переменные окружения
│   │   ├── controllers/     # Обработка HTTP-запросов
│   │   ├── errors/          # AppError
│   │   ├── middleware/      # Обработка ошибок
│   │   ├── repositories/    # Доступ к данным
│   │   ├── routes/          # API-маршруты
│   │   ├── schemas/         # Zod-схемы
│   │   ├── services/        # Бизнес-логика
│   │   └── utils/           # Разбор идентификатора заявки
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Database

Данные хранятся в PostgreSQL. Локально база запускается через Docker Compose. Prisma описывает схему, хранит миграции и генерирует типизированный клиент.

## Request model

| Поле | Тип | Описание |
| --- | --- | --- |
| `id` | integer | Уникальный идентификатор, увеличивается автоматически |
| `applicantName` | string | ФИО заявителя |
| `email` | string | Email заявителя |
| `phone` | string | Телефон заявителя |
| `subject` | string | Тема заявки |
| `description` | string | Описание заявки |
| `createdAt` | datetime | Дата и время создания, задаётся сервером |
| `status` | enum | Текущий статус; по умолчанию `NEW` |

Клиент не задаёт `id`, `createdAt` и `status` при создании заявки.

### Status

| Техническое значение | Отображаемое значение |
| --- | --- |
| `NEW` | Новая |
| `IN_PROGRESS` | В работе |
| `COMPLETED` | Выполнена |
| `REJECTED` | Отклонена |

## API

Базовый путь API: `/api`. Backend слушает порт из `PORT`, по умолчанию `3000`.

### GET /health

Техническая проверка, что сервер запущен.

Успешный ответ (`200 OK`):

```json
{
  "success": true,
  "message": "Server is running"
}
```

### POST /api/requests

Создаёт новую заявку. Поля `createdAt` и `status` клиент не передаёт: время задаётся автоматически, статус всегда начинается с `NEW`.

Тело запроса:

```json
{
  "applicantName": "Иван Иванов",
  "email": "ivan@example.com",
  "phone": "+77001234567",
  "subject": "Проблема с услугой",
  "description": "Описание проблемы"
}
```

Успешный ответ (`201 Created`):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "applicantName": "Иван Иванов",
    "email": "ivan@example.com",
    "phone": "+77001234567",
    "subject": "Проблема с услугой",
    "description": "Описание проблемы",
    "createdAt": "2026-08-18T00:00:00.000Z",
    "status": "NEW"
  }
}
```

При ошибке валидации сервер отвечает `400 Bad Request`:

```json
{
  "success": false,
  "message": "Ошибка валидации",
  "errors": {
    "email": ["Укажите корректный email"]
  }
}
```

### GET /api/requests

Возвращает все заявки, отсортированные по `createdAt DESC`. Если заявок нет, `data` содержит пустой массив.

Успешный ответ (`200 OK`):

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "applicantName": "Иван Иванов",
      "email": "ivan@example.com",
      "phone": "+77001234567",
      "subject": "Проблема с услугой",
      "description": "Описание проблемы",
      "createdAt": "2026-08-18T00:00:00.000Z",
      "status": "NEW"
    }
  ]
}
```

### GET /api/requests/:id

Возвращает одну заявку. Параметр `id` должен быть положительным целым числом.

Успешный ответ (`200 OK`):

```json
{
  "success": true,
  "data": {
    "id": 1,
    "applicantName": "Иван Иванов",
    "email": "ivan@example.com",
    "phone": "+77001234567",
    "subject": "Проблема с услугой",
    "description": "Описание проблемы",
    "createdAt": "2026-08-18T00:00:00.000Z",
    "status": "NEW"
  }
}
```

- `400 Bad Request` — некорректный `id`.
- `404 Not Found` — заявки нет: `{ "success": false, "message": "Заявка не найдена" }`.

### PATCH /api/requests/:id/status

Изменяет статус заявки.

Тело запроса:

```json
{
  "status": "IN_PROGRESS"
}
```

Допустимые значения: `NEW`, `IN_PROGRESS`, `COMPLETED`, `REJECTED`.

Успешный ответ (`200 OK`) возвращает обновлённую заявку:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "applicantName": "Иван Иванов",
    "email": "ivan@example.com",
    "phone": "+77001234567",
    "subject": "Проблема с услугой",
    "description": "Описание проблемы",
    "createdAt": "2026-08-18T00:00:00.000Z",
    "status": "IN_PROGRESS"
  }
}
```

- `400 Bad Request` — некорректный `id` или недопустимый `status`.
- `404 Not Found` — заявки нет.

## Frontend

Frontend — React-приложение на Vite. Страницы ходят в API только через `frontend/src/services/api.ts` и переменную `VITE_API_URL`.

| Маршрут | Назначение |
| --- | --- |
| `/requests` | Список заявок |
| `/requests/new` | Форма создания заявки |
| `/requests/:id` | Карточка заявки и смена статуса |

Список показывает идентификатор, ФИО, тему, дату, статус, состояния загрузки, ошибки и пустого списка. Форма проверяет обязательные поля на клиенте и создаёт заявку через `POST /api/requests`, после успеха открывается карточка. На карточке отображаются все поля заявки и можно сменить статус через `PATCH /api/requests/:id/status`.

## Валидация

Серверная валидация Zod остаётся основным механизмом защиты. Frontend дополнительно проверяет, что все поля формы заполнены, а email имеет корректный формат. Ошибки показываются рядом с полями. Сообщения сервера при `400` также выводятся у соответствующих полей, если backend их вернул.

## Обработка ошибок

Frontend не показывает stack trace, ошибки Prisma и внутренние детали сервера.

- Список: «Не удалось загрузить заявки.» / «Заявок пока нет.»
- Карточка: «Загрузка заявки...» / «Не удалось загрузить заявку.» / «Заявка не найдена.»
- Создание: «Не удалось создать заявку.»
- Смена статуса: «Не удалось изменить статус.»

Backend отвечает `400` на некорректные данные, `404` если заявка не найдена, `500` при непредвиденной ошибке.

## Environment variables

Корневой `.env` используется Docker Compose:

```text
POSTGRES_DB=request_system
POSTGRES_USER=request_system_user
POSTGRES_PASSWORD=change_me
POSTGRES_PORT=5432
```

`backend/.env` используется Express и Prisma:

```text
PORT=3000
DATABASE_URL="postgresql://request_system_user:change_me@localhost:5432/request_system?schema=public"
```

`frontend/.env` используется Vite:

```text
VITE_API_URL=http://localhost:3000/api
```

Шаблоны лежат в `.env.example`, `backend/.env.example` и `frontend/.env.example`. Файлы `.env` не коммитятся.

## Запуск проекта

1. Клонируйте репозиторий.
2. Скопируйте `.env.example` в `.env`.
3. Скопируйте `backend/.env.example` в `backend/.env`.
4. Скопируйте `frontend/.env.example` в `frontend/.env`.
5. Запустите PostgreSQL:

```bash
docker compose up -d
```

6. Установите зависимости backend и примените миграции:

```bash
cd backend
pnpm install
pnpm exec prisma migrate deploy
```

7. Запустите backend:

```bash
pnpm dev
```

8. В другом терминале установите зависимости frontend и запустите интерфейс:

```bash
cd frontend
pnpm install
pnpm dev
```

9. Откройте frontend в браузере, обычно `http://localhost:5173`. Неизвестные адреса перенаправляются на `/requests`.

## Docker

`docker-compose.yml` поднимает только PostgreSQL 16. Backend и frontend запускаются локально через pnpm, чтобы удобнее разрабатывать и отлаживать API.

## Development

Полезные команды backend из папки `backend`:

```bash
pnpm dev
pnpm build
pnpm exec prisma validate --schema prisma/schema.prisma
pnpm exec prisma migrate deploy
```

Полезные команды frontend из папки `frontend`:

```bash
pnpm dev
pnpm build
```

Для новой миграции в разработке:

```bash
pnpm exec prisma migrate dev --name <имя_миграции>
```

## Git workflow

- Для каждого этапа создаётся отдельная тематическая ветка.
- В репозиторий не попадают секреты, `node_modules`, `dist` и локальные `.env`.
- Коммиты формулируются кратко в стиле Conventional Commits.
- `main` содержит проверенное состояние проекта.
