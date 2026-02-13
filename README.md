# Dua.me MVP

Anonymous dua/guidance web app with React + Material UI frontend and Node/Express + PostgreSQL backend.

## Features implemented
- Magic-link email auth + Google OAuth backend routes.
- Profile generation with unique `@username` share link.
- Anonymous message send with templates and rate limit (10/min/IP).
- Receiver inbox with realtime Socket.IO updates, reply, and report actions.
- Admin reports dashboard with decrypted message content and temporary sender IP log.
- Payments stubs (`/payments/bkash/init`, `/payments/sslcommerz/init`).
- Production serving of frontend build from backend.

## Local setup
1. Install dependencies:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
2. Configure envs:
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env`
3. Create PostgreSQL database and run schema:
   - `createdb duame`
   - `psql "$DB_URL" -f backend/src/schema.sql`
4. Seed one admin user (replace with your email):
   - `psql "$DB_URL" -c "update users set is_admin=true where email='you@example.com';"`

## Run
- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm start`

## Core flow check
1. Login via magic link endpoint (dev response contains link).
2. Open `/profile` and share generated `@username` link.
3. Anonymous sender opens `/@username` and sends message.
4. Receiver opens `/inbox` and sees realtime update, can reply/report.
5. Admin opens `/admin` to moderate reports.

## Deploy (Hostinger VPS)
- Build frontend: `cd frontend && npm run build`
- Start backend cluster: `pm2 start ecosystem.config.js`
- Use `nginx.conf.example` and configure TLS via Certbot.
