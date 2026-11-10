
# Campaign Manager — Laravel & React

A full-stack campaign management application built with PHP, Laravel, React and TypeScript.

The project demonstrates REST API development, relational data persistence, authentication, business rule validation, and frontend/backend integration.

## Tech Stack

**Backend**
- PHP 8.1+ / Laravel 10
- Laravel Sanctum
- SQLite
- REST APIs

**Frontend**
- React / TypeScript
- Vite
- Material UI

## Features

- Campaign listing and filtering
- Campaign editing
- Creative asset management
- Image validation (320 × 480 pixels)
- Maximum of three creatives per campaign
- Creative uploads blocked for paused campaigns
- User registration and login endpoints
- CSV-based database seeding

## Architecture

The application consists of two independent components:

- `backend/` — Laravel REST API, database models, migrations and business logic
- `frontend/` — React single-page application

## Getting Started

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Create `backend/database/database.sqlite`, then run:

```bash
php artisan migrate:fresh --seed
php artisan serve --host=127.0.0.1 --port=3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Notes

This is a demonstration project. Authentication endpoints are available, but campaign management endpoints are currently public.

Production deployment would require appropriate authorization, secure asset storage, rate limiting, logging and monitoring.
