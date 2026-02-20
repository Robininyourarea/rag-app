from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables.history import RunnableWithMessageHistory
from app.vector_store.faiss_store import get_vector_store
from app.config.config import settings
from app.memory.mongo_memory import session_service
from app.core.prompt import contextualize_q_prompt, qa_prompt
from app.core.prompt import contextualize_q_prompt, qa_prompt
from langchain_classic.chains import create_history_aware_retriever, create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain

def get_rag_chain(collection_name:str=None):
    """
    Create and return the RAG chain with history.
    """
    vector_store = get_vector_store(collection_name)
    try:
        if not vector_store:
            return None

        retriever = vector_store.as_retriever()
        
        llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=settings.GOOGLE_API_KEY)

        history_aware_retriever = create_history_aware_retriever(
            llm, retriever, contextualize_q_prompt
        )

        question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
        rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

        rag_chain_with_history = RunnableWithMessageHistory(
            rag_chain,
            get_session_history=session_service.get_or_create_session_history,
            input_messages_key="input",
            history_messages_key="chat_history",
            output_messages_key="answer",
        )

        return rag_chain_with_history
    except Exception as e:
        print(f"Error creating RAG chain: {e}")
        return None
