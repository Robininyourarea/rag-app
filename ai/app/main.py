from fastapi import FastAPI
from app.api.routes import document, chat, session
import app.utils.logger # Initialize logger

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from RAG Chat AI!"}

app.include_router(document.router, tags=["Documents"])
app.include_router(chat.router, tags=["Chat"])
app.include_router(session.router, tags=["Sessions"])
