from datetime import datetime
from pymongo import MongoClient
from config import MONGO_URI, DB_NAME

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def submit_feedback_to_db(data):
    feedback_entry = {
        "station_id": data["station_id"],
        "timestamp": datetime.utcnow(),
        "admin_name": data.get("admin_name", "HR"),  # default if not provided
        "review": data.get("review", ""),
        "rating": int(data.get("rating", 0))  # default to 0 if not provided
    }
    db.feedback_log.insert_one(feedback_entry)
    return {"message": "Feedback submitted successfully."}
