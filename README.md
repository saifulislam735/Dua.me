# Dua.me MVP

Dua.me is an anonymous dua/guidance app with optional receiver authentication (Google OAuth or email magic link), encrypted messages, realtime inbox updates, reporting, and admin moderation.

## Core flows complete
- Anonymous sender can post to `@username` links (no login required).
- Receiver logs in (Google or magic-link), creates/edits profile username, shares link + QR.
- Receiver inbox updates in realtime over Socket.IO, supports reply and report.
- Admin can view open reports with decrypted message text and remove users/messages.
- Payments sandbox stubs are wired (bKash/SSLCommerz) + premium featured-profile toggle stub.

## Tech stack
- Frontend: React + MUI + react-toastify + socket.io-client + qrcode.react
- Backend: Node.js + Express + PostgreSQL + Passport Google OAuth + JWT + Socket.IO

## Local development
### 1) Configure environment
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Fill `backend/.env`:
- `DB_URL`, `JWT_SECRET`, `SESSION_SECRET`
- Google OAuth values from Google Cloud Console (OAuth web app):
  - https://console.cloud.google.com/apis/credentials
  - callback URI: `http://localhost:4000/auth/google/callback`
- SMTP credentials (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`) for real magic-link emails.

### 2) Install deps
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3) Prepare DB
```bash
createdb duame
psql "$DB_URL" -f backend/src/schema.sql
```

(Optional) seed admin:
```bash
psql "$DB_URL" -c "update users set is_admin=true where email='you@example.com';"
```

### 4) Run
```bash
cd backend && npm run dev
cd frontend && npm start
```

## Docker Compose (dev)
```bash
docker compose up --build
```
Services:
- `postgres` (5432)
- `backend` (4000)
- `frontend` (3000)

## Production (Hostinger KVM2)
1. Build frontend:
```bash
cd frontend && npm run build
```
2. Copy build assets into backend public dir:
```bash
rm -rf backend/public && mkdir -p backend/public
cp -r frontend/build/* backend/public/
```
3. Start clustered backend:
```bash
pm2 start ecosystem.config.js
```
4. Configure Nginx with websocket upgrade (see `nginx.conf.example`) and TLS via Certbot.

## API notes
- Auth: `/auth/google`, `/auth/email/magic-link`, `/auth/magic/verify`, `/auth/me`
- User: `/users/profile`, `/users/premium`, `/users/:username`
- Message: `/messages/send/:username`, `/messages/inbox`, `/messages/reply/:id`, `/messages/report/:id`
- Admin: `/admin/reports`, `/admin/messages/:id`, `/admin/users/:id`
- Payments: `/payments/bkash/init`, `/payments/bkash/execute`, `/payments/sslcommerz/init`, `/payments/sslcommerz/complete`
