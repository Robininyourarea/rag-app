from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from pydantic import BaseModel
from typing import List, Optional
import shutil
import os
from app.ingestion.loader import load_pdf
from app.ingestion.splitter import split_documents
from app.vector_store.faiss_store import add_documents_to_vector_store
from app.core.rag_chain import get_rag_chain
from app.memory.mongo_memory import session_service
import app.utils.logger # Initialize logger

app = FastAPI()

class ChatRequest(BaseModel):
    query: str
    session_id: str

class ChatResponse(BaseModel):
    answer: str
    session_id: str

@app.get("/")
def read_root():
    return {"message": "Hello from RAG Chat AI!"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        documents = load_pdf(temp_file_path)
        chunks = split_documents(documents)
        add_documents_to_vector_store(chunks)

        os.remove(temp_file_path)

        return {"message": "File processed and added to vector store", "chunks": len(chunks)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        rag_chain = get_rag_chain()
        if not rag_chain:
             raise HTTPException(status_code=400, detail="Vector store not initialized. Please upload a document first.")
        
        response = rag_chain.invoke(
            {"input": request.query},
            config={"configurable": {"session_id": request.session_id}}
        )
        
        return ChatResponse(answer=response, session_id=request.session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sessions")
def get_sessions():
    return session_service.get_all_sessions()

@app.get("/sessions/{session_id}")
def get_session_history(session_id: str):
    return session_service.get_session_history(session_id)

@app.delete("/sessions/{session_id}")
def clear_session(session_id: str):
    success = session_service.clear_session_history(session_id)
    if success:
         return {"message": "Session history cleared"}
    raise HTTPException(status_code=404, detail="Session not found")
