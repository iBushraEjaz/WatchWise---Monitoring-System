from config import MONGO_URI, DB_NAME
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_feedback_report_from_db(station_id):
    feedbacks = list(db.feedback_log.find({"station_id": station_id}).sort("timestamp", -1))

    return {
        "station_id": station_id,
        "total_feedbacks": len(feedbacks),
        "feedbacks": [
            {
                "timestamp": fb.get("timestamp"),
                "admin_name": fb.get("admin_name", "unknown"),
                "review": fb.get("review", fb.get("feedback", "")),
                "rating": fb.get("rating", 0)
            }
            for fb in feedbacks
        ]
    }

def get_all_feedbacks_sorted_by_station():
    # Fetch all feedbacks and sort by station_id and timestamp
    feedbacks = list(db.feedback_log.find().sort([("station_id", 1), ("timestamp", -1)]))

    # Group feedbacks by station_id
    feedbacks_by_station = {}
    for fb in feedbacks:
        station_id = fb.get("station_id")
        if station_id not in feedbacks_by_station:
            feedbacks_by_station[station_id] = []
        
        feedbacks_by_station[station_id].append({
            "timestamp": fb.get("timestamp"),
            "admin_name": fb.get("admin_name", "unknown"),
            "review": fb.get("review", fb.get("feedback", "")),
            "rating": fb.get("rating", 0)
        })

    return feedbacks_by_station