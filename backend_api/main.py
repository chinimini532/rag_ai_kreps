from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

from controller.gui_api import chat_api, ingest_api, dashboard_api

app = FastAPI(
    title="RAG AI Assistant API",
    description="Local API bridge between React UI and RAG backend",
    version="1.0"
)

# ---------- Request Schemas ----------

class ChatRequest(BaseModel):
    query: str
    top_k: Optional[int] = 3


# ---------- API Endpoints ----------

@app.post("/chat")
def chat_endpoint(req: ChatRequest):
    """
    Homepage chatbot API
    """
    return chat_api(req.query, req.top_k)


@app.post("/ingest")
def ingest_endpoint():
    """
    Document ingestion & indexing API
    """
    return ingest_api()


@app.get("/dashboard")
def dashboard_endpoint():
    """
    Analytics dashboard API
    """
    return dashboard_api()
