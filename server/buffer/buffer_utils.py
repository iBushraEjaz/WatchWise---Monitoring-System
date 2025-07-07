import eventlet
eventlet.monkey_patch()
from datetime import datetime, timedelta
import time
from threading import Lock
import json
import os
from database.mongo_logger import log_emission_to_db_bulk  # import this instead
from dateutil import parser
import pytz

# Activity buffer and lock for synchronizing access
activity_buffer = {}
buffer_lock = Lock()

def process_activities():
    summarized_data = []

    for station_id, activities in activity_buffer.items():
        if not activities:
            continue

        # Sort activities just in case
        activities.sort(key=lambda x: x['timestamp'])

        previous_timestamp = None
        current_activity = None
        start_time = None
        occupancy_duration = 0

        for activity in activities:
            timestamp = datetime.fromisoformat(activity['timestamp'])
            activity_type = activity['activity']

            if previous_timestamp is None:
                # First activity
                previous_timestamp = timestamp
                current_activity = activity_type
                start_time = timestamp
                continue

            if current_activity != activity_type:
                # Log the previous activity block
                summarized_data.append({
                    "station_id": station_id,
                    "activity": current_activity,
                    "start_time": start_time,
                    "end_time": previous_timestamp,
                    "occupancy_duration": occupancy_duration,
                    "date": start_time.date()
                })

                # Reset for new activity
                current_activity = activity_type
                start_time = timestamp
                occupancy_duration = 0

            # Accumulate occupancy duration only if not vacant
            if activity_type != "vacant":
                occupancy_duration += (timestamp - previous_timestamp).total_seconds() / 60  # minutes

            previous_timestamp = timestamp

        # Final activity log
        if current_activity and start_time and previous_timestamp:
            summarized_data.append({
                "station_id": station_id,
                "activity": current_activity,
                "start_time": start_time,
                "end_time": previous_timestamp,
                "occupancy_duration": occupancy_duration,
                "date": start_time.date()
            })

    return summarized_data


def get_30min_block_start(timestamp: datetime) -> datetime:
    """Returns the start of the 30-minute block for the given timestamp"""
    minute = timestamp.minute
    if minute < 30:
        start_of_block = timestamp.replace(minute=0, second=0, microsecond=0)
    else:
        start_of_block = timestamp.replace(minute=30, second=0, microsecond=0)
    return start_of_block

def get_30min_block_end(timestamp: datetime) -> datetime:
    """Returns the end of the 30-minute block for the given timestamp"""
    block_start = get_30min_block_start(timestamp)
    block_end = block_start + timedelta(minutes=30)
    return block_end

from datetime import datetime
from collections import defaultdict

def summarize_activities(activities):
    # Parse timestamps and sort
    for act in activities:
        act["parsed_time"] = datetime.fromisoformat(act["timestamp"])

        # Ensure timezone-aware
        if act["parsed_time"].tzinfo is None:
            act["parsed_time"] = pytz.timezone("Asia/Karachi").localize(act["parsed_time"])

    activities.sort(key=lambda x: x["parsed_time"])

    summaries = []
    grouped = defaultdict(list)

    # Group by (station_id, activity, 30-min block)
    for act in activities:
        block_start = get_30min_block_start(act["parsed_time"])
        key = (act["station_id"], act["activity"], block_start)
        grouped[key].append(act)

    for (station_id, activity, block_start), group in grouped.items():
        group.sort(key=lambda x: x["parsed_time"])
        start_time = group[0]["parsed_time"]
        end_time = group[-1]["parsed_time"]
        duration = (end_time - start_time).total_seconds() if end_time != start_time else 1  # default to 1 second


        # Only count occupancy if activity isn't vacant
        occupancy_duration = duration if activity.lower() != "vacant" else 0
        date_in_karachi = act["parsed_time"].astimezone(pytz.timezone("Asia/Karachi")).date()
        summaries.append({
            "station_id": station_id,
            "activity": activity,
            "duration": duration,
            "occupancy_duration": occupancy_duration,
            "date": date_in_karachi.isoformat(),
            "block_start_time": block_start.strftime("%Y-%m-%d %H:%M:%S"),
            "block_end_time": (block_start + timedelta(minutes=30)).strftime("%Y-%m-%d %H:%M:%S"),
        })

    return summaries



def log_summaries_to_db(summaries):
    log_emission_to_db_bulk(summaries)



# Disk buffer management
BUFFER_FILE_PATH = "buffer.jsonl"

def load_buffer_from_disk():
    if os.path.exists(BUFFER_FILE_PATH):
        with open(BUFFER_FILE_PATH, "r") as file:
            try:
                return [json.loads(line) for line in file if line.strip()]
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")
                return []  # fallback to empty buffer
    return []


def append_to_disk_buffer(station_data):
    with open(BUFFER_FILE_PATH, "a") as file:
        json.dump(station_data, file)
        file.write("\n")

def delete_disk_buffer():
    if os.path.exists(BUFFER_FILE_PATH):
        os.remove(BUFFER_FILE_PATH)

# Function to process and store data every 30 minutes
def process_buffer_every_30_minutes():
    while True:
        time.sleep(180)  # currently set for testing every 60 seconds

        with buffer_lock:
            activities_copy = {k: v[:] for k, v in activity_buffer.items()}

        flat_activities = [item for sublist in activities_copy.values() for item in sublist]
        summaries = summarize_activities(flat_activities)

        if summaries:
            try:
                log_summaries_to_db(summaries)

                with buffer_lock:
                    activity_buffer.clear()
                    delete_disk_buffer()
                    print("🧹 Buffer cleared after successful DB log.")
            except Exception as e:
                print("❌ Logging failed, buffer not cleared:", e)
        # Optionally backup summaries to file

            # Copy the buffer safely
            activities_copy = {k: v[:] for k, v in activity_buffer.items()}
            activity_buffer.clear()
            delete_disk_buffer()

        # Flatten, summarize, and log outside the lock
        flat_activities = [item for sublist in activities_copy.values() for item in sublist]
        summaries = summarize_activities(flat_activities)

        

# Start processing in a separate thread
eventlet.spawn(process_buffer_every_30_minutes)



