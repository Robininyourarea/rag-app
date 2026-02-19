# AI RAG Server

This describes the AI RAG (Retrieval-Augmented Generation) Server, built with FastAPI, LangChain, and Google Gemini. It provides endpoints for document ingestion (PDF), chat with history, and session management.

## Features

- **Document Ingestion**: Upload PDF files to be processed and stored in a vector database (FAISS).
- **RAG Chat**: Chat with your documents using Google's Gemini Pro model.
- **Session Management**: Maintain chat history per session, stored in MongoDB.
- **Modular API**: Clean and scalable API structure.

## Prerequisites

- **uv**: An extremely fast Python package and project manager.
- **MongoDB**: A running MongoDB instance (local or remote).
- **Google API Key**: Access to Google Gemini models.

## Installation

1.  **Clone the repository** and navigate to the `ai` directory:
    ```bash
    cd ai
    ```

2.  **Install dependencies using uv**:
    ```bash
    uv sync
    ```
    This command will create a virtual environment and install all dependencies defined in `pyproject.toml` (or `requirements.txt`).

## Configuration

1.  **Create a `.env` file** by copying the example:
    ```bash
    cp .env.example .env
    # Windows
    copy .env.example .env
    ```

2.  **Update `.env` with your credentials**:
    Open `.env` and set the following variables:
    -   `GOOGLE_API_KEY`: Your Google Cloud API Key for Gemini.
    -   `MONGO_INITDB_ROOT_USERNAME`: MongoDB username.
    -   `MONGO_INITDB_ROOT_PASSWORD`: MongoDB password.
    -   `MONGO_INITDB_DATABASE`: Database name.
    -   `MONGODB_HOST`: Hostname of your MongoDB server (e.g., `localhost`).
    -   `MONGODB_PORT`: Port of your MongoDB server (default `27017`).

    *Note: The `MONGODB_URL` is automatically constructed from these values, but you can override it by setting `MONGODB_URL` directly.*

## Running the Server

Start the FastAPI server using `uv run`:

```bash
uv run uvicorn app.main:app --reload
```

The server will start at `http://localhost:8000`.

## API Documentation

Once the server is running, you can access the interactive API documentation (Swagger UI) at:

**[http://localhost:8000/docs](http://localhost:8000/docs)**

### Key Endpoints

-   **`POST /upload`**: Upload a PDF file to the knowledge base.
-   **`POST /chat`**: Send a query to the RAG chat. Requires a `session_id`.
-   **`GET /sessions`**: List all active chat sessions.
-   **`GET /sessions/{session_id}`**: Get chat history for a specific session.
-   **`DELETE /sessions/{session_id}`**: Clear chat history for a session.

## Project Structure

```
ai/
├── app/
│   ├── api/
│   │   └── routes/       # API endpoints (chat, document, session)
│   ├── config/           # Configuration settings
│   ├── core/             # Core logic (RAG chain, prompts)
│   ├── ingestion/        # Document processing (loader, splitter)
│   ├── memory/           # Chat history management
│   ├── utils/            # Utilities (logging)
│   ├── vector_store/     # Vector database interface
│   └── main.py           # Application entry point
├── .env                  # Environment variables
├── pyproject.toml        # Python dependencies (uv)
└── README.md             # This file
```
