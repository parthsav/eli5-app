import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI, OpenAIError
from pydantic import BaseModel, Field

load_dotenv()

SYSTEM_PROMPT = (
    "You are 'ELI5 Bot'. Explain whatever the user asks as if they are 5 years old. "
    "Use simple words, short sentences, a friendly tone, and one concrete analogy. "
    "Keep responses under 150 words."
)

MODEL = "gpt-4o-mini"

app = FastAPI(title="ELI5 API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

_client: OpenAI | None = None


def get_client() -> OpenAI:
    global _client
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY not configured. Set it in .env or your shell.",
        )
    if _client is None:
        _client = OpenAI(api_key=api_key)
    return _client


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)


class ChatResponse(BaseModel):
    reply: str


@app.get("/")
def root() -> dict[str, str]:
    return {"status": "ok", "service": "eli5-api"}


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    client = get_client()

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": request.message},
            ],
        )
    except OpenAIError as exc:
        raise HTTPException(
            status_code=502, detail=f"OpenAI API error: {exc}"
        ) from exc

    reply = response.choices[0].message.content or ""
    return ChatResponse(reply=reply)
