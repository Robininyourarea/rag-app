from fastapi import APIRouter, HTTPException
from app.core.rag_chain import get_rag_chain
from app.models.chat import ChatRequest, ChatResponse
import uuid

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):

    # Generate session ID if not provided
    if not request.session_id:
        request.session_id = str(uuid.uuid4())
        
    try:
        rag_chain = get_rag_chain(request.session_id)
        if not rag_chain:
             raise HTTPException(status_code=400, detail="Vector store not initialized. Please upload a document first.")
        
        response = rag_chain.invoke(
            {"input": request.query},
            config={"configurable": {"session_id": request.session_id}}
        )
        
        return ChatResponse(answer=response["answer"], session_id=request.session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
