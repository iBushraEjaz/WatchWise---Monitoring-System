from datetime import datetime, timedelta
import pytz
from pymongo import MongoClient
from config import MONGO_URI, DB_NAME

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Karachi timezone
karachi_tz = pytz.timezone("Asia/Karachi")

def parse_date(date_str):
    """Parse full ISO datetime string to Karachi timezone."""
    dt = datetime.strptime(date_str.split('.')[0], "%Y-%m-%dT%H:%M:%S") if 'T' in date_str else datetime.strptime(date_str, "%Y-%m-%d")
    dt = pytz.utc.localize(dt)  # Parse as UTC first
    return dt.astimezone(karachi_tz)

def format_duration(seconds):
    """Format seconds into human-readable time."""
    if seconds < 60:
        return f"{round(seconds)} seconds"
    elif seconds < 3600:
        return f"{round(seconds/60, 2)} minutes"
    else:
        return f"{round(seconds/3600, 2)} hours"

def get_working_report_from_db(station_id, period, selected_date):
    try:
        base_date = parse_date(selected_date)
    except Exception as e:
        return {"error": f"Invalid date format: {str(e)}"}

    query = {"station_id": station_id}

    # Handle daily period
    if period == "daily":
        start_of_day = base_date.replace(hour=8, minute=0, second=0, microsecond=0)
        end_of_day = base_date.replace(hour=16, minute=0, second=0, microsecond=0)
        query["block_start_time"] = {
            "$gte": start_of_day.strftime("%Y-%m-%d %H:%M:%S"),
            "$lt": end_of_day.strftime("%Y-%m-%d %H:%M:%S")
        }
        total_period_seconds = (end_of_day - start_of_day).total_seconds()

    # Handle weekly period
    elif period == "weekly":
        end_of_day = base_date.replace(hour=16, minute=0, second=0, microsecond=0)
        start_of_week = (base_date - timedelta(days=6)).replace(hour=8, minute=0, second=0, microsecond=0)
        query["block_start_time"] = {
            "$gte": start_of_week.strftime("%Y-%m-%d %H:%M:%S"),
            "$lte": end_of_day.strftime("%Y-%m-%d %H:%M:%S")
        }
        total_period_seconds = 7 * 8 * 3600  # 7 days, 8 hours each

    # Handle monthly period
    elif period == "monthly":
        start_of_month = base_date.replace(day=1, hour=8, minute=0, second=0, microsecond=0)
        if start_of_month.month == 12:
            next_month = start_of_month.replace(year=start_of_month.year + 1, month=1)
        else:
            next_month = start_of_month.replace(month=start_of_month.month + 1)
        end_of_month = (next_month - timedelta(days=1)).replace(hour=16, minute=0, second=0, microsecond=0)
        query["block_start_time"] = {
            "$gte": start_of_month.strftime("%Y-%m-%d %H:%M:%S"),
            "$lte": end_of_month.strftime("%Y-%m-%d %H:%M:%S")
        }
        num_days = (next_month - start_of_month).days
        total_period_seconds = num_days * 8 * 3600  # each day 8 hours

    else:
        return {"error": "Invalid period. Must be 'daily', 'weekly', or 'monthly'."}

    # Query the activity logs from MongoDB
    logs = list(db.activity_log.find(query))

    if not logs:
        return {"message": "No data found for this period."}

    # Sum the working activities
    working_activities = {
        "using laptop", "using computer", "using mobile", "using phone", "using tablet",
        "reading papers", "using papers", "reading book", "using book"
    }

    total_duration = 0
    for log in logs:
        activity = log.get("activity", "").lower()
        duration = log.get("duration", 0)

        # Only sum durations for working activities
        if activity in working_activities:
            total_duration += duration

    return {
        "station_id": station_id,
        "period": period,
        "total_duration_seconds": total_duration,  # Send raw seconds here
        "formatted_duration": format_duration(total_duration)  # Add formatted duration as well
    }
