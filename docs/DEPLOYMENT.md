# Deployment Guide

Recommended production topology:

| Service | Platform | Config |
|---|---|---|
| Frontend (React/Vite) | Vercel | `deployment/vercel/vercel.json` |
| Backend (Node/Express) | Render | `deployment/render/render.yaml` |
| AI service (FastAPI) | Railway | `deployment/railway/railway.json` |
| Database | MongoDB Atlas | `docs/MONGODB_ATLAS_SETUP.md` |
| Images | Cloudinary | free tier, see `backend/.env.example` |

## 1. Database — MongoDB Atlas

Follow `docs/MONGODB_ATLAS_SETUP.md`. You'll end up with a `MONGO_URI` connection string.

## 2. AI service — Railway

```bash
cd ai-service
npm i -g @railway/cli   # or brew install railway
railway login
railway init
cp ../deployment/railway/railway.json ./railway.json
railway up
```

Set env vars in the Railway dashboard from `ai-service/.env.example`. Railway builds from the
`Dockerfile` in `ai-service/`. Note the public URL Railway assigns — you'll need it as
`AI_SERVICE_URL` for the backend.

> Model checkpoints: Railway's filesystem is ephemeral on redeploy. For a real trained model,
> either bake the checkpoint into the Docker image (`COPY checkpoints/ ./checkpoints/` before
> the image is pushed) or mount a persistent volume.

## 3. Backend — Render

1. Push this repo to GitHub.
2. In the Render dashboard: **New** → **Blueprint** → point at the repo. Render reads
   `deployment/render/render.yaml` automatically if placed at the repo root, or create the
   service manually with:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `node src/server.js`
   - Health check path: `/health`
3. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL`
   (your Vercel URL), `AI_SERVICE_URL` (your Railway URL), Cloudinary/SMTP/Weather/Gemini keys.
4. Deploy. Confirm `https://<your-render-app>.onrender.com/health` returns `200`.

## 4. Frontend — Vercel

```bash
cd frontend
npx vercel
```

Or connect the GitHub repo in the Vercel dashboard with root directory `frontend`. Set:

- `VITE_API_BASE_URL` = `https://<your-render-app>.onrender.com/api/v1`
- `VITE_SOCKET_URL` = `https://<your-render-app>.onrender.com`

Deploy with `npx vercel --prod`.

## 5. Wire it together

After all three are live, update:

- Render backend env: `CLIENT_URL` = your Vercel URL, `AI_SERVICE_URL` = your Railway URL
- Railway AI service env: `CORS_ORIGINS` includes your Vercel URL and Render URL

Redeploy the backend and AI service after changing env vars so CORS picks up the new origins.

## 6. CI/CD

`.github/workflows/ci.yml` runs backend tests, AI service tests, and a frontend build on every
push/PR. Extend it with deploy steps using `RENDER_API_KEY` / `RAILWAY_TOKEN` / `VERCEL_TOKEN`
repo secrets once you're ready to automate deploys on merge to `main`.

## Self-hosted alternative: Docker Compose

For a single-VM deployment instead of the three-platform setup above:

```bash
docker compose up --build -d
docker compose exec backend npm run seed
```

Put a reverse proxy (Caddy/Nginx/Traefik) in front for TLS termination and route
`/api` to the backend container and everything else to the frontend container.
