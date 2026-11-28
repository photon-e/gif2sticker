# GIF2Sticker

A free, accountless, mobile-first browser app for converting GIFs and videos into animated WhatsApp stickers. Uploaded media and public X post links are converted to animated WebP; media is held in a temporary directory and removed after the response.

## Requirements

- Docker Engine and Docker Compose v2 (recommended)
- Or Node.js 20+ / npm and Python 3.10+

## Run with Docker Compose

1. Copy `.env.example` to `.env` and adjust values for your machine. The example values are development-only.
2. Start the stack:

   ```sh
   docker compose up --build
   ```

3. Open [http://localhost:3000](http://localhost:3000). The API health endpoint is [http://localhost:8000/api/health/](http://localhost:8000/api/health/).

PostgreSQL, Redis, and the Django API expose container health checks. Django runs migrations at startup. To stop the stack, press Ctrl+C; run `docker compose down` to remove containers. Add `-v` only if you also intend to delete the local database volume.

## Run services locally

The backend defaults to SQLite for local use. In one terminal:

```sh
cd backend
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
DJANGO_SECRET_KEY=local-development-only .venv/bin/python manage.py migrate
DJANGO_SECRET_KEY=local-development-only .venv/bin/python manage.py runserver
```

In another terminal:

```sh
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `NEXT_PUBLIC_API_URL` can point the frontend at a different API origin. To use PostgreSQL and the Celery worker locally, start PostgreSQL and Redis and set their connection values in the root `.env`.

## Conversion API

`POST /api/conversions/` accepts either multipart form data with a `file` field (GIF, MP4, MOV, or WebM; up to 100 MB), or JSON/form data with a public `url` to an X status containing video. It returns an animated WebP sticker at 512 × 512 pixels, at most 500 KB, and up to 10 seconds long. X posts must be public and retrievable by yt-dlp. Conversion runs synchronously; anonymous requests are rate-limited to 20 per hour. Temporary source and output files are deleted after each request.

## Tests and checks

```sh
cd backend && python manage.py test
cd frontend && npm test
```

The frontend test command runs the Node test suite. `npm run typecheck` validates TypeScript.

## Architecture

- `frontend/`: Next.js App Router, TypeScript, Tailwind CSS, reusable UI components, Lucide icons.
- `backend/`: Django REST Framework project with `core`, `conversions`, and `media_processing` apps; PostgreSQL configuration, Redis/Celery integration, structured logging, and a health API.
- `docker-compose.yml`: web app, API, PostgreSQL, Redis, and Celery worker.
