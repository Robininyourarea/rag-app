from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.rag_chain import get_rag_chain
import uuid

router = APIRouter()

from typing import Optional

class ChatRequest(BaseModel):
    query: str
    session_id: Optional[str] = None
    collection_name: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    session_id: str
    collection_name: Optional[str] = None

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):

    # Generate session ID if not provided
    if not request.session_id:
        request.session_id = str(uuid.uuid4())
        
    try:
        rag_chain = get_rag_chain(request.collection_name)
        if not rag_chain:
             raise HTTPException(status_code=400, detail="Vector store not initialized. Please upload a document first.")
        
        response = rag_chain.invoke(
            {"input": request.query},
            config={"configurable": {"session_id": request.session_id}}
        )
        
        return ChatResponse(answer=response["answer"], session_id=request.session_id, collection_name=request.collection_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
