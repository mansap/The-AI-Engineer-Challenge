import os

from dotenv import load_dotenv
from fastapi import HTTPException
from openai import OpenAI
from pydantic import BaseModel

load_dotenv()

SYSTEM_PROMPT = """You are a supportive mental coach.

Default to brief, warm replies (1-3 sentences) for coaching topics like stress, motivation, habits, and confidence.

When the user asks for something specific with a clear format — such as a short story, poem, or a target word count — follow their request and deliver it.

If a request is outside what you can help with, say so briefly and offer to refocus on coaching."""

# GPT-5 spends many tokens on internal reasoning before writing visible text.
DEFAULT_MAX_COMPLETION_TOKENS = 800
CREATIVE_MAX_COMPLETION_TOKENS = 2000
CREATIVE_KEYWORDS = ("story", "poem", "write", "words", "paragraph", "tale", "creative")

_client: OpenAI | None = None


class ChatRequest(BaseModel):
    message: str


def max_completion_tokens_for(message: str) -> int:
    """Use a higher token budget when the user asks for longer creative output."""
    lower = message.lower()
    if any(keyword in lower for keyword in CREATIVE_KEYWORDS):
        return CREATIVE_MAX_COMPLETION_TOKENS
    return DEFAULT_MAX_COMPLETION_TOKENS


def get_openai_client() -> OpenAI:
    """Create the OpenAI client lazily so module import succeeds on Vercel."""
    global _client
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
    if _client is None:
        _client = OpenAI(api_key=api_key)
    return _client


def handle_chat(request: ChatRequest) -> dict[str, str]:
    """Shared chat logic used by both local and Vercel entrypoints."""
    client = get_openai_client()
    response = client.chat.completions.create(
        model="gpt-5",
        max_completion_tokens=max_completion_tokens_for(request.message),
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": request.message},
        ],
    )
    reply = response.choices[0].message.content
    if not reply or not reply.strip():
        reply = "I'm not sure about that — but I'm here if you'd like to talk through something else."
    return {"reply": reply}
