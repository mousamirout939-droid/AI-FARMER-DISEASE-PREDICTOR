# Vercel Deployment (Frontend)

1. Copy `deployment/vercel/vercel.json` into `frontend/vercel.json`
2. From the `frontend/` directory: `npx vercel` (or connect the repo in the Vercel dashboard, root directory = `frontend`)
3. Set project environment variables:
   - `VITE_API_BASE_URL` = your deployed backend URL + `/api/v1`
   - `VITE_SOCKET_URL` = your deployed backend URL
4. Deploy: `npx vercel --prod`
