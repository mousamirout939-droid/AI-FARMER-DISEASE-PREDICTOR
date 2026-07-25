# 🌾 AI Farmer Disease Predictor

**AI Powered Smart Farming Assistant** — photograph a crop leaf, get an instant AI diagnosis
(disease, confidence, severity, treatment plan), plus weather-based risk alerts, market prices,
government scheme lookup, and a farmer community — all in one platform.

> **Portfolio / scaffold project.** This is a genuinely working full-stack application — every
> file listed below runs — built as a broad, functional scaffold covering the platform's core
> surface area. It intentionally does **not** ship a pre-trained 100+ class deep learning model
> or live third-party API keys (Gemini, Cloudinary, weather, SMS/OTP) — those require your own
> accounts/datasets. See [`Scope & Honesty Notes`](#scope--honesty-notes) below for exactly
> what's real vs. what you need to plug in.

## Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌───────────────────┐
│  React Frontend │─────▶│  Node/Express API │─────▶│  FastAPI AI Service│
│  (Vite, Tailwind)│      │  (JWT, MongoDB)   │      │  (PyTorch, OpenCV) │
└─────────────────┘      └──────────────────┘      └───────────────────┘
                                   │
                                   ▼
                          ┌──────────────────┐
                          │  MongoDB Atlas    │
                          └──────────────────┘
```

- **frontend/** — React 19 + Vite + TailwindCSS + Redux Toolkit + React Query + React Router +
  Framer Motion + Chart.js. PWA-enabled, dark/light mode, role-based dashboards (farmer/expert/admin).
- **backend/** — Node.js + Express + MongoDB/Mongoose + JWT auth (access + refresh + OTP + Google
  login) + Socket.io (chat/notifications) + Cloudinary uploads + PDF/QR report generation +
  Swagger docs + Jest tests.
- **ai-service/** — Python 3.12 + FastAPI + PyTorch (MobileNetV3 transfer learning) + OpenCV +
  GradCAM explainability + ONNX export + a real, runnable training pipeline.

## Quickstart

```bash
git clone <this-repo>
cd ai-farmer-disease-predictor

# 1. AI service
cd ai-service && pip install -r requirements.txt && cp .env.example .env
uvicorn app.main:app --reload --port 8000 &
cd ..

# 2. Backend
cd backend && npm install && cp .env.example .env
npm run seed && npm run dev &
cd ..

# 3. Frontend
cd frontend && npm install && cp .env.example .env
npm run dev
```

Visit `http://localhost:5173`. Full instructions, Docker Compose setup, and troubleshooting:
[`docs/INSTALLATION.md`](docs/INSTALLATION.md).

Demo logins (created by `npm run seed`):

| Role | Email | Password |
|---|---|---|
| Admin | admin@aifarmer.app | Admin@12345 |
| Farmer | farmer@aifarmer.app | Farmer@12345 |
| Expert | expert@aifarmer.app | Expert@12345 |

## Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [API Documentation](docs/API_DOCUMENTATION.md) (+ Swagger at `/api-docs` and `/docs`, Postman
  collection at `postman/AI-Farmer.postman_collection.json`)
- [Deployment Guide](docs/DEPLOYMENT.md) (Vercel + Render + Railway + MongoDB Atlas)
- [MongoDB Atlas Setup](docs/MONGODB_ATLAS_SETUP.md)
- [Dataset & Model Training](ai-service/dataset/raw/README.md)

## Scope & honesty notes

Being upfront about what's genuinely functional vs. what needs your own setup:

✅ **Fully working out of the box:**
- Auth (register/login/JWT/refresh/OTP/password reset), role-based access, all CRUD APIs
- The complete upload → AI service → diagnosis → MongoDB → PDF report pipeline
- GradCAM heatmaps, blur/brightness quality checks, severity scoring, bounding-box estimation
- Admin analytics dashboard, community feed, notifications, support tickets, appointments
- Docker/Compose for all three services, CI pipeline, all builds verified

⚠️ **Runs, but needs your own credentials/data to be "real":**
- **The AI model itself** — no dataset ships (100+ disease classes × 50+ crops needs ~50k+
  labeled images, far too large to bundle). The training pipeline (`app/ml/train.py`) is real
  and works against any ImageFolder-structured dataset. Until trained, the service runs in
  `untrained_demo_mode` — fully functional pipeline, clearly-flagged non-meaningful predictions.
- **Weather / Gemini chatbot / Cloudinary / SMTP** — real integration code, but needs API keys
  in `.env`. Weather and market-price endpoints fall back to clearly-labeled demo data without keys.
- **Video calling** — appointment booking and room-ID generation work; no WebRTC/video SDK is
  wired in (would need a Twilio/Agora/Daily account).

## Tech stack

React 19 · Vite · TailwindCSS · Redux Toolkit · React Query · Framer Motion · Chart.js ·
Node.js · Express · MongoDB/Mongoose · Socket.io · JWT · Cloudinary · Python 3.12 · FastAPI ·
PyTorch · OpenCV · Docker · GitHub Actions

## License

MIT — see [`LICENSE`](LICENSE).
