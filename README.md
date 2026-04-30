# Explain Like I'm 5

A tiny LLM-powered web app built for the
[AI Engineer Challenge](https://github.com/AI-Maker-Space/The-AI-Engineer-Challenge).
You type a question, the app asks OpenAI to explain it like you're 5, and shows
the answer.

```
+-------------------+        POST /api/chat        +--------------------+        +-------------+
|  Next.js (UI)     |  ------------------------->  |  FastAPI (api/)    | -----> |  OpenAI API |
|  app/page.tsx     |  <-- { reply: "..." } -----  |  api/index.py      | <----- |  gpt-4o-mini|
+-------------------+                              +--------------------+        +-------------+
```

## Stack

- **Backend:** FastAPI + OpenAI Python SDK, Python 3.12, managed by [`uv`](https://github.com/astral-sh/uv) locally
- **Frontend:** Next.js 16 (App Router, TypeScript, Tailwind CSS)
- **Notebook:** Jupyter playground for prompt iteration
- **Model:** `gpt-4o-mini`
- **Deploy:** Vercel (Next.js + Python serverless function under one URL)

## Project layout

```
ai-engineering-proj/
├── api/
│   └── index.py            # FastAPI app, /api/chat (also a Vercel Python function)
├── app/                    # Next.js App Router
│   ├── page.tsx            # ELI5 UI
│   └── layout.tsx
├── public/                 # static assets
├── notebooks/
│   └── eli5_playground.ipynb
├── package.json            # Next.js deps
├── pyproject.toml          # uv-managed Python deps (local dev)
├── requirements.txt        # Python deps for Vercel
├── vercel.json             # /api/* -> api/index function
├── next.config.ts
├── tsconfig.json
├── .env.example
└── README.md
```

## Prerequisites

- Python 3.12 (auto-installed by `uv` if missing)
- [`uv`](https://github.com/astral-sh/uv) (`brew install uv` or `pip install uv`)
- Node.js 20+ and `npm`
- An OpenAI API key

## 1. Set your API key

```bash
cp .env.example .env
# edit .env and replace sk-replace-me with your real OpenAI key
```

## 2. Run locally — backend

```bash
uv sync
uv run uvicorn api.index:app --reload
```

Backend listens on `http://localhost:8000` (interactive docs at `/docs`).

## 3. Run locally — frontend

In a second terminal:

```bash
npm install   # only the first time
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
npm run dev
```

Open `http://localhost:3000`. The `NEXT_PUBLIC_API_URL` override tells the
frontend to talk to your local uvicorn server instead of the same-origin
`/api/chat` (which is what's used in production on Vercel).

## 4. Optional: prompt prototyping in Jupyter

```bash
uv run jupyter lab notebooks/eli5_playground.ipynb
```

## Deploying to Vercel

The repo is Vercel-ready. On every push to `main` Vercel will:

1. Detect Next.js at the repo root and build/serve the frontend.
2. Detect `api/index.py` and deploy it as a Python serverless function.
3. Use `vercel.json` to forward any `/api/*` request to that function.

You only need to set one environment variable in the Vercel project settings:

```
OPENAI_API_KEY = sk-...   # Production (and Preview, if desired)
```

Result:

```
https://<your-project>.vercel.app/          → Next.js page (ELI5 UI)
https://<your-project>.vercel.app/api/chat  → FastAPI endpoint
```

No CORS configuration needed in production because both are served from the
same origin.
