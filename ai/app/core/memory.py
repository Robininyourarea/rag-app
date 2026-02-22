from langchain_mongodb.chat_message_histories import MongoDBChatMessageHistory
from typing import List, Dict, Any, Optional
import pymongo
import json
import logging
from app.config.config import settings

logger = logging.getLogger(__name__)

class SessionService:
    """Service to handle session history and statistics"""

    def __init__(self):
        self.session_histories: Dict[str, MongoDBChatMessageHistory] = {}

    def get_or_create_session_history(
        self, session_id: str
    ) -> MongoDBChatMessageHistory:
        """Get or create MongoDB chat message history for a session"""
        if session_id not in self.session_histories:
            self.session_histories[session_id] = MongoDBChatMessageHistory(
                connection_string=settings.MONGODB_URL,
                database_name=settings.MONGO_INITDB_DATABASE,
                collection_name=settings.MONGODB_COLLECTION_CHAT_HISTORY,
                session_id=session_id,
            )
        return self.session_histories[session_id]

    def get_session_history(self, session_id: str) -> List[Dict[str, Any]]:
        """Get chat history for a session"""
        try:
            chat_history = self.get_or_create_session_history(session_id)
            messages = []

            for message in chat_history.messages:
                messages.append(
                    {
                        "type": message.type,
                        "content": message.content,
                        "timestamp": getattr(message, "additional_kwargs", {}).get(
                            "timestamp"
                        ),
                    }
                )

            return messages
        except Exception as e:
            logger.error(f"Error getting session history: {e}")
            return []

    def clear_session_history(self, session_id: str) -> bool:
        """Clear chat history for a session"""
        try:
            chat_history = self.get_or_create_session_history(session_id)
            chat_history.clear()

            # Remove from local cache
            if session_id in self.session_histories:
                del self.session_histories[session_id]

            return True
        except Exception as e:
            logger.error(f"Error clearing session history: {e}")
            return False

    def get_session_stats(self, session_id: str) -> Dict[str, Any]:
        """Get session statistics"""
        try:
            chat_history = self.get_or_create_session_history(session_id)
            messages = chat_history.messages

            if not messages:
                return {
                    "session_id": session_id,
                    "message_count": 0,
                    "user_messages": 0,
                    "ai_messages": 0,
                }

            user_messages = len([m for m in messages if m.type == "human"])
            ai_messages = len([m for m in messages if m.type == "ai"])

            return {
                "session_id": session_id,
                "message_count": len(messages),
                "user_messages": user_messages,
                "ai_messages": ai_messages,
                "first_message": messages[0].content if messages else None,
                "last_message": messages[-1].content if messages else None,
            }
        except Exception as e:
            logger.error(f"Error getting session stats: {e}")
            return {"session_id": session_id, "message_count": 0}

    def get_all_sessions(self) -> List[Dict[str, Any]]:
        """Get list of all chat sessions with metadata"""
        try:
            # Connect to MongoDB directly to query distinct session IDs
            client = pymongo.MongoClient(settings.MONGODB_URL)
            db = client[settings.MONGO_INITDB_DATABASE]
            collection = db[settings.MONGODB_COLLECTION_CHAT_HISTORY]
            
            # Create a temporary instance to get the key names          
            temp_history = MongoDBChatMessageHistory(
                connection_string=settings.MONGODB_URL,
                database_name=settings.MONGO_INITDB_DATABASE,
                collection_name=settings.MONGODB_COLLECTION_CHAT_HISTORY,
                session_id="temp"
            )
            
            # Get unique session IDs
            session_ids = collection.distinct(temp_history.session_id_key)
            
            # For each session, get the first and last message to show preview and timestamp
            sessions = []
            for session_id in session_ids:
                if session_id == "temp": continue

                # Get first message timestamp (creation time)
                first_message = collection.find_one(
                    {temp_history.session_id_key: session_id},
                    sort=[("_id", 1)]
                )
                
                # Get last message for preview
                last_message = collection.find_one(
                    {temp_history.session_id_key: session_id},
                    sort=[("_id", -1)]
                )
                
                if first_message and last_message:
                    # Parse the message content
                    last_message_content = json.loads(last_message[temp_history.history_key])
                        
                    sessions.append({
                        "session_id": session_id,
                        "created_at": first_message.get("_id").generation_time.isoformat(), # Convert to string for JSON serialization
                        "updated_at": last_message.get("_id").generation_time.isoformat(),
                        "preview": last_message_content.get("data", {}).get("content", "")[:50] + "...",
                        "message_count": collection.count_documents({
                            temp_history.session_id_key: session_id
                        })
                    })

            # Sort by most recent activity
            sessions.sort(key=lambda x: x["updated_at"], reverse=True)
            return sessions
            
        except Exception as e:
            logger.error(f"Error getting sessions: {e}")
            raise

session_service = SessionService()
