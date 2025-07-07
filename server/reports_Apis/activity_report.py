from datetime import datetime, timedelta
from pymongo import MongoClient
import pytz
from config import MONGO_URI, DB_NAME
from collections import defaultdict

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_activity_summary_from_db(station_id, period):
    karachi_tz = pytz.timezone("Asia/Karachi")

    # Step 1: Parse the base period
    if period.startswith("week-"):
        base_date = datetime.strptime(clean_period_string(period.replace("week-", "")), "%Y-%m-%d")
        end_date = base_date.replace(hour=16, minute=0, second=0, microsecond=0)
        start_date = (base_date - timedelta(days=6)).replace(hour=8, minute=0, second=0, microsecond=0)

    elif period.startswith("month-"):
        base_date = datetime.strptime(clean_period_string(period.replace("month-", "")), "%Y-%m")
        start_date = base_date.replace(day=1, hour=8, minute=0, second=0, microsecond=0)
        if base_date.month == 12:
            next_month = base_date.replace(year=base_date.year + 1, month=1, day=1)
        else:
            next_month = base_date.replace(month=base_date.month + 1, day=1)
        end_date = (next_month - timedelta(days=1)).replace(hour=16, minute=0, second=0, microsecond=0)

    else:
        # Daily
        base_date = datetime.strptime(clean_period_string(period), "%Y-%m-%d")
        start_date = base_date.replace(hour=8, minute=0, second=0, microsecond=0)
        end_date = base_date.replace(hour=16, minute=0, second=0, microsecond=0)

    # Step 2: Query MongoDB based on 'timestamp' field
    logs = db.activity_log.find({
    "station_id": station_id,
    "block_start_time": {
        "$gte": start_date.strftime("%Y-%m-%d %H:%M:%S"),
        "$lte": end_date.strftime("%Y-%m-%d %H:%M:%S")
    }
})


    # Step 3: Aggregate
    activity_durations = defaultdict(float)
    found_data = False
    for log in logs:
        found_data = True
        activity = log.get("activity", "unknown")
        if not activity:
            activity = "unknown"
        activity = activity.lower()

        # Skip "vacant" and "unknown"
        if activity in ["vacant", "unknown"]:
            continue
        
        duration = log.get("occupancy_duration", 0)
        activity_durations[activity] += duration

    # Step 4: Prepare result
    result = [{"activity_type": k, "total_duration": round(v, 2)} for k, v in activity_durations.items()]
    result.sort(key=lambda x: x["total_duration"], reverse=True)

    if not found_data:
        return {
            "station_id": station_id,
            "period": period,
            "message": "No data found for given period.",
            "activities": []
        }

    return {
        "station_id": station_id,
        "period": period,
        "activities": result
    }

def clean_period_string(period):
    if "T" in period:
        period = period.split("T")[0]
    return period
