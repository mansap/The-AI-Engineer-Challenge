"""Vercel serverless entrypoint — maps POST /api/chat to this file."""

from fastapi import FastAPI, HTTPException

try:
    from chat_logic import ChatRequest, handle_chat
except ImportError:
    from api.chat_logic import ChatRequest, handle_chat

app = FastAPI()


@app.post("/")
def chat(request: ChatRequest):
    try:
        return handle_chat(request)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling OpenAI API: {str(e)}")
