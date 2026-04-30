# Explain Like I'm 5

A tiny LLM-powered web app built for the
[AI Engineer Challenge](https://github.com/AI-Maker-Space/The-AI-Engineer-Challenge).
You type a question, the app asks OpenAI to explain it like you're 5, and shows
the answer.

```
+-------------------+        POST /api/chat        +--------------------+        +-------------+
|  Next.js (3000)   |  ------------------------->  |  FastAPI (8000)    | -----> |  OpenAI API |
|  app/page.tsx     |  <-- { reply: "..." } -----  |  api/index.py      | <----- |  gpt-4o-mini|
+-------------------+                              +--------------------+        +-------------+
```

## Stack

- **Backend:** FastAPI + OpenAI Python SDK, Python 3.12, managed by [`uv`](https://github.com/astral-sh/uv)
- **Frontend:** Next.js 16 (App Router, TypeScript, Tailwind CSS)
- **Notebook:** Jupyter playground for prompt iteration
- **Model:** `gpt-4o-mini`

## Project layout

```
ai-engineering-proj/
├── api/
│   ├── index.py            # FastAPI app, /api/chat endpoint
│   └── README.md
├── frontend/               # Next.js app
│   └── app/page.tsx        # ELI5 UI
├── notebooks/
│   └── eli5_playground.ipynb
├── pyproject.toml          # uv-managed Python deps
├── .env.example            # OPENAI_API_KEY=sk-...
└── README.md
```

## Prerequisites

- Python 3.12 (auto-installed by `uv` if missing)
- [`uv`](https://github.com/astral-sh/uv) (`brew install uv` or `pip install uv`)
- Node.js 20+ and `npm` (install via [`nvm`](https://github.com/nvm-sh/nvm) if needed)
- An OpenAI API key

## 1. Set your API key

```bash
cp .env.example .env
# edit .env and replace sk-replace-me with your real OpenAI key
```

## 2. Run the backend

```bash
uv sync
uv run uvicorn api.index:app --reload
```

Server: `http://localhost:8000` (interactive docs at `/docs`).

Quick test:

```bash
curl -X POST http://localhost:8000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"What is gravity?"}'
```

## 3. Run the frontend

In a second terminal:

```bash
cd frontend
npm install   # only the first time
npm run dev
```

Open `http://localhost:3000`, type a question, hit **Explain**.

By default the frontend talks to `http://localhost:8000`. To override, copy
`frontend/.env.local.example` to `frontend/.env.local` and edit
`NEXT_PUBLIC_API_URL`.

## 4. Optional: prompt prototyping in Jupyter

```bash
uv run jupyter lab notebooks/eli5_playground.ipynb
```

The notebook calls the same model and system prompt the backend uses, which
makes it easy to iterate on the ELI5 prompt before changing `api/index.py`.

## Deploying

Vercel deployment is intentionally out of scope here. To deploy later, install
the Vercel CLI (`npm i -g vercel`) and run `vercel` from the project root; the
official challenge repo's `vercel.json` is a good reference.
