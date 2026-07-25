# GitHub Actions CI/CD

The actual workflow file lives at `.github/workflows/ci.yml` in the repo root
(GitHub only picks up workflows from that exact path). It runs on every push
and PR to `main`/`develop` and:

1. Installs and tests the Node.js backend (`backend/`)
2. Installs and tests the Python AI service (`ai-service/`)
3. Installs and builds the React frontend (`frontend/`)
4. Builds all three Docker images to catch Dockerfile regressions

To add deployment automation, extend `ci.yml` with steps that call the
Render/Railway/Vercel CLIs using repo secrets (`RENDER_API_KEY`,
`RAILWAY_TOKEN`, `VERCEL_TOKEN`), triggered only on pushes to `main`.
