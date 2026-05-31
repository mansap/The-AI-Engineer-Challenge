### Mindful Coach — Frontend

Next.js chat UI for the FastAPI mental coach backend in `/api/index.py`.

## Prerequisites

- Node.js 18+ and npm
- Backend running at `http://localhost:8000` (see `/api/README.md`)
- `OPENAI_API_KEY` set in your shell when starting the backend

## Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local   # optional — defaults to localhost:8000
```

## Run locally

**Terminal 1 — Backend** (from project root):

```bash
export OPENAI_API_KEY=sk-your-key-here
uv run uvicorn api.index:app --reload
```

**Terminal 2 — Frontend**:

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | FastAPI backend base URL |

For production, set `NEXT_PUBLIC_API_URL` to your deployed backend URL. On Vercel (same project), leave it unset — the frontend calls `/api/chat` on the same domain.

## Deploy to Vercel

Deploy from the **repository root** (not the `frontend/` folder). The root `vercel.json` builds both:

- **Next.js UI** from `frontend/`
- **FastAPI API** from `api/index.py` (only `/api/chat` is routed to Python)

In Vercel → **Settings → Environment Variables**, add:

| Name | Value |
|---|---|
| `OPENAI_API_KEY` | your OpenAI key (`sk-...`) |

Redeploy after adding or changing env vars.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

## API integration

The frontend sends `POST /api/chat` with `{ "message": "..." }` and displays the `{ "reply": "..." }` response. CORS is already enabled on the backend.
