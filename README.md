# Dua.me

Anonymous dua and guidance web app MVP scaffold.

## Monorepo Layout
- `frontend/` React + MUI client with sender page, receiver inbox, sharing helpers, auth and admin views.
- `backend/` Express + Socket.IO + PostgreSQL-oriented API.

## Quick Start
1. Copy env files:
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env`
2. Install dependencies in each app.
3. Run backend then frontend.

## Core API
- `POST /auth/google`, `POST /auth/email`, `GET /auth/logout`
- `POST /users/profile`, `GET /users/:username`
- `POST /messages/send/:username`, `GET /messages/inbox`, `POST /messages/reply/:id`, `POST /messages/report/:id`
- `GET /admin/reports`, `DELETE /admin/users/:id`, `DELETE /admin/messages/:id`
