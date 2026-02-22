from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from typing import List
import os
from app.ingestion.embedder import get_embedder
import logging
from fastapi import HTTPException

logger = logging.getLogger(__name__)

# Path to the FAISS index (ai/faiss_index/)
INDEX_PATH = "faiss_index"

def get_index_path(collection_name:str=None):
    if collection_name:
        return os.path.join(INDEX_PATH, collection_name)
    return os.path.join(INDEX_PATH, "default")

def get_vector_store(collection_name:str=None):
    try:
        embedder = get_embedder()
        index_path = get_index_path(collection_name)
        if os.path.exists(index_path):
            return FAISS.load_local(index_path, embedder, allow_dangerous_deserialization=True)
        return None
    except Exception as e:
        logger.error(f"Error getting vector store: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def create_vector_store(documents: List[Document], collection_name:str=None):
    try:
        embedder = get_embedder()
        vector_store = FAISS.from_documents(documents, embedder)
        index_path = get_index_path(collection_name)
        vector_store.save_local(index_path)
        return vector_store
    except Exception as e:
        logger.error(f"Error creating vector store: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def add_documents_to_vector_store(documents: List[Document], collection_name:str=None):
    try:
        vector_store = get_vector_store(collection_name)
        if vector_store:
            embedder = get_embedder()
            new_store = FAISS.from_documents(documents, embedder)
            vector_store.merge_from(new_store)
            index_path = get_index_path(collection_name)
            vector_store.save_local(index_path)
        else:
            create_vector_store(documents, collection_name)
    except Exception as e:
        logger.error(f"Error adding documents to vector store: {e}")
        raise HTTPException(status_code=500, detail=str(e))
