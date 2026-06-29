# 🍋 LimeBalance Admin

Admin panel for **LimeBalance**. Shares the same backend (`/api`) and visual design system
as the user cabinet, but is a separate frontend app.

This is **stage 1**: project scaffolding only — packages, build/deploy config, the app shell
(layout, routing, auth, theme) and the **login** page. Admin pages are built on top of this
shell in the next stage.

## 🛠 Tech Stack

| Area | Tooling |
|------|---------|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| UI | Mantine v9 + Tabler Icons |
| Data fetching | TanStack Query |
| State | Zustand |
| Forms & validation | React Hook Form + Zod |
| Routing | React Router |
| Linting/format | Biome |

The app is English-only (no i18n).

## 🚀 Getting Started

```bash
npm install
cp .env.example .env   # fill in the values
npm run dev            # http://localhost:5173
```

In dev, Vite proxies `/api` to `http://localhost:3000` (the backend) — see `vite.config.ts`.

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Lint with Biome |
| `npm run format` | Format with Biome |
| `npm run test:e2e` | Run Playwright E2E tests |

## 🐳 Deploy

`docker compose up` for local containers, or push to `main` to trigger the GitHub Actions
pipeline (`.github/workflows/deploy.yml`) which builds the image, pushes it to GHCR and
restarts the `limebalance-admin` container on the VPS.
# limebalance-admin
