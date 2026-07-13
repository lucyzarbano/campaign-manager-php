# Campaign Manager Backend

Laravel API for the React Campaign Manager frontend.

## Local setup

```powershell
cd backend
composer install
copy .env.example .env
php artisan key:generate
New-Item -ItemType File database\database.sqlite -Force
php artisan migrate:fresh --seed
php artisan serve --host=127.0.0.1 --port=3000
```

The frontend build currently calls `http://localhost:3000`.

## Demo account

- Username: `demo`
- Password: `password`

Authentication endpoints are available for the current frontend, but the exercise-required campaign endpoints are public.

## API contract

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/campaigns?id=&q=&status=&page=&limit=`
- `GET /api/campaigns/{campaign}`
- `PUT /api/campaigns/{campaign}` with `id` required in the JSON body
- `GET /api/campaigns/{campaign}/creatives`
- `POST /api/campaigns/{campaign}/creatives`
- `DELETE /api/campaigns/{campaign}/creatives/{creative}`

Business rules enforced by the backend:

- Paused campaigns (`status = 0`) cannot accept new creatives.
- Each campaign can have at most 3 creatives.
- Creative data URLs are validated as exactly `320 x 480` pixels.

## Production notes

For production I would move from the local SQLite file to a managed relational database, add request rate limiting per user/IP, store uploaded creative assets in object storage instead of accepting large inline payloads, add image processing/virus scanning, cache campaign list responses by filter, and run the API behind HTTPS with centralized logs and metrics.
