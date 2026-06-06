# AK Bikes — Setup Guide

Second-hand bike showroom (Next.js + Express + MongoDB).

## Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI

## Bike photos (`public/Bikes/`)

Name files by registration number:

- `TS12EY5770-1.jpg`, `TS12EY5770-2.jpg`, …

Then run:

```bash
cd backend
npm run attach-images
npm run import
```

Bikes with no matching files keep empty `images` and show `/placeholder.svg` on the site.

## 1. Inventory (`bikes (1).json`)

Real inventory lives at the repo root. It includes `description` and `images` (4 slots; empty until you add photo URLs).

Regenerate descriptions:

```bash
cd backend
npm run update-json
```

## 2. Backend

```bash
cd backend
cp .env.example .env   # edit MONGODB_URI and ADMIN_KEY
npm install
npm run attach-images  # map public/Bikes/REG-1.jpg → JSON (by registration number)
npm run import         # sync bikes (1).json to MongoDB
npm run dev            # http://localhost:5001 (5000 may be in use)
```

### API

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/bikes` | List (search, filters, sort, pagination) |
| GET | `/api/bikes/:id` | Single bike by inventory `id` |
| POST | `/api/bikes` | Create (header `x-admin-key`) |
| PUT | `/api/bikes/:id` | Update |
| DELETE | `/api/bikes/:id` | Delete |
| PATCH | `/api/bikes/:id/status` | `{ "status": "unsold" \| "sold" }` |

Query params: `search`, `status`, `year`, `priceRange`, `sort` (`latest` \| `price-asc` \| `price-desc`), `page`, `limit`.

## 3. Frontend

```bash
cp .env.local.example .env.local
npm install   # or pnpm install
npm run dev   # http://localhost:3000
```

- Showroom: `/` — bike cards from API, placeholder image when `images` are empty
- Admin: `/admin` — dashboard, CRUD, mark sold/unsold (uses `NEXT_PUBLIC_ADMIN_KEY`)

## 4. Authentication (Login / Signup)

Backend auth API: `POST /api/auth/signup`, `POST /api/auth/login`, `GET /api/auth/me` (Bearer JWT).

### Backend `.env` (add to `backend/.env`)

```env
JWT_SECRET=your-long-random-secret-at-least-32-chars
JWT_EXPIRES_IN=7d
ADMIN_EMAILS=admin@akbikes.com
```

### Create admin user (after MongoDB is running)

```bash
cd backend
npm run seed-admin
```

Default credentials: `admin@akbikes.com` / `admin123` (override via `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`).

### Pages

- Login: `http://localhost:3001/login`
- Signup: `http://localhost:3001/signup`
- Profile: `/profile` (after login)
- Admin: `/admin` (requires login + `admin` role)

Signup with an email listed in `ADMIN_EMAILS` receives the admin role automatically.

## 5. Production

- Set `MONGODB_URI`, `CORS_ORIGIN`, `ADMIN_KEY` on the API host
- Set `NEXT_PUBLIC_API_URL` to your deployed API
- Run `npm run import` once against production DB
- Deploy Next.js (Vercel) and Express (Railway, Render, VPS, etc.)
