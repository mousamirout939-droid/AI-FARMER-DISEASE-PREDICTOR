# Installation Guide

This project has three independent services: a **React frontend**, a **Node/Express backend**,
and a **Python FastAPI AI service**, plus **MongoDB** for storage. You can run everything with
Docker Compose (fastest) or run each service manually (better for active development).

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | 20.x |
| Python | 3.12 |
| MongoDB | 7.x (local) or MongoDB Atlas (cloud, free tier works) |
| Docker + Docker Compose | optional, for containerized setup |

## Option A: Docker Compose (all services)

```bash
# from the project root
cp backend/.env.example backend/.env
cp ai-service/.env.example ai-service/.env
cp frontend/.env.example frontend/.env

docker compose up --build
```

This starts MongoDB, the AI service (port 8000), the backend (port 5000), and the frontend
(port 5173, served via nginx on container port 80). Seed demo data once containers are up:

```bash
docker compose exec backend npm run seed
```

## Option B: Manual setup (recommended for development)

### 1. MongoDB

Either run MongoDB locally (`mongod`) or create a free MongoDB Atlas cluster — see
`docs/MONGODB_ATLAS_SETUP.md`.

### 2. AI service (FastAPI)

```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Visit `http://localhost:8000/docs` for interactive Swagger docs.

> No trained model ships with this repo (see `dataset/raw/README.md` for why). The service
> runs fine without one — it flags every response with `"model_status": "untrained_demo_mode"`.
> Train a real model with `python -m app.ml.train` once you've populated `dataset/raw/`.

### 3. Backend (Node/Express)

```bash
cd backend
npm install
cp .env.example .env    # edit MONGO_URI, JWT secrets, etc.
npm run seed             # creates demo users, diseases, medicines
npm run dev
```

Visit `http://localhost:5000/api-docs` for Swagger docs, `http://localhost:5000/health` for a
health check.

Demo accounts created by `npm run seed`:

| Role | Email | Password |
|---|---|---|
| Admin | admin@aifarmer.app | Admin@12345 |
| Farmer | farmer@aifarmer.app | Farmer@12345 |
| Expert | expert@aifarmer.app | Expert@12345 |

### 4. Frontend (React + Vite)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Visit `http://localhost:5173`.

## Running tests

```bash
# Backend
cd backend && npm test

# AI service
cd ai-service && python -m pytest tests/ -v

# Frontend build check
cd frontend && npm run build
```

## Troubleshooting

- **"AI service is unavailable" when predicting**: make sure `uvicorn` is running on port 8000
  and `AI_SERVICE_URL` in `backend/.env` points to it.
- **CORS errors**: confirm `CLIENT_URL` in `backend/.env` and `CORS_ORIGINS` in `ai-service/.env`
  match the frontend's actual origin.
- **Image upload fails**: Cloudinary credentials are required for persistent image storage —
  fill in `CLOUDINARY_*` in `backend/.env` (free tier: https://cloudinary.com).
