
import os
import sys

# Add the parent directory to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))

from app.core.rag_chain import get_rag_chain

def test_chain_init():
    print("Testing RAG chain initialization...")
    try:
        # We need a valid vector store for get_rag_chain to work, or it returns None.
        # But get_rag_chain calls get_vector_store().
        # If no index exists, it returns None.
        
        # We assume verify_collection.py ran and created indices.
        # Let's try to get chain for "collection_a"
        chain = get_rag_chain("collection_a")
        
        if chain:
            print("Successfully initialized RAG chain for collection_a")
        else:
            print("RAG chain returned None (expected if index missing, but we expect it to be present from previous test)")
            
    except Exception as e:
        print(f"FAILED to initialize RAG chain: {e}")
        raise e

if __name__ == "__main__":
    test_chain_init()
