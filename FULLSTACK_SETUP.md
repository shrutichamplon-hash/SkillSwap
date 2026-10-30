# SkillSwap Full-Stack Setup (MySQL + Node.js)

## 1) Create MySQL database
Run in MySQL:

```sql
CREATE DATABASE IF NOT EXISTS skillswap;
```

## 2) Configure backend env
Copy `server/.env.example` to `server/.env` and set your MySQL credentials.

## 3) Install backend dependencies

```bash
cd server
npm install
```

## 4) Start backend

```bash
npm start
```

API runs at: `http://localhost:4000/api`

On first run, schema + seed are auto-created from:
- `server/sql/schema.sql`
- `server/sql/seed.sql`

## 5) Run frontend
Open project with Live Server (or any local static server), for example:
- `http://127.0.0.1:5500/index.html`

## 6) Auth flow
- Register from `register.html` (API first, local fallback)
- Login from `login.html` (API first, local fallback)

## 7) New feature pages
- `Ai_match.html`
- `creds_batch.html` (and alias `cred_batch.html`)
- `leaderboard.html`
- `notes.html`
- `consult.html`

These pages use API when backend is available, and fallback demo/local data if API is offline.
