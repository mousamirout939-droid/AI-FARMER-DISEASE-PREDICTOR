# Railway Deployment (AI Service)

1. Install the Railway CLI: `npm i -g @railway/cli`
2. From the `ai-service/` directory: `railway login && railway init`
3. Copy `deployment/railway/railway.json` into `ai-service/railway.json`
4. Set environment variables in the Railway dashboard (see `ai-service/.env.example`)
5. Deploy: `railway up`
6. Railway assigns a public URL — use it as `AI_SERVICE_URL` in the backend's environment.
