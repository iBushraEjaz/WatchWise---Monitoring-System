from pymongo import MongoClient
from config import MONGO_URI, DB_NAME, COLLECTION_NAME

# MongoDB connection
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]
from datetime import datetime, date as DateClass

def log_emission_to_db_bulk(summary_list):
    if not summary_list:
        return
    try:
        
        db["activity_log"].insert_many(summary_list)
        print(f"✅ {len(summary_list)} records inserted to DB.")
    except Exception as e:
        print("❌ Bulk DB insert failed:", e)

