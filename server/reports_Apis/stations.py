from datetime import datetime, timedelta
from config import MONGO_URI, DB_NAME
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
def get_total_stations():
    """Returns the total number of unique stations."""
    return db.activity_log.distinct("station_id").__len__()

def get_station_list():
    """Returns a list of all unique station IDs."""
    return db.activity_log.distinct("station_id")
