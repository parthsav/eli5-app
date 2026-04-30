# ELI5 API

FastAPI backend for the "Explain Like I'm 5" app.

## Endpoint

`POST /api/chat`

Request body:

```json
{ "message": "What is gravity?" }
```

Response:

```json
{ "reply": "Gravity is like an invisible hug from the Earth..." }
```

## Run locally

From the project root:

```bash
uv sync
export OPENAI_API_KEY=sk-...   # or put it in .env at the project root
uv run uvicorn api.index:app --reload
```

The server listens on `http://localhost:8000`.
