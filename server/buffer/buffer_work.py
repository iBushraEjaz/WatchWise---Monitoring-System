# buffer_tasks.py
import eventlet
from buffer.buffer_utils import load_buffer_from_disk, buffer_lock, activity_buffer, process_buffer_every_30_minutes

background_task_greenlet = None

def restore_buffer_once_on_startup():
    restored = load_buffer_from_disk()
    if restored:
        with buffer_lock:
            for entry in restored:
                sid = entry.get("station_id")
                if sid:
                    activity_buffer.setdefault(sid, []).append(entry)
        print("Buffer restored from disk.")

def start_buffer_processing():
    global background_task_greenlet
    if background_task_greenlet is None or background_task_greenlet.dead:
        background_task_greenlet = eventlet.spawn(process_buffer_every_30_minutes)
        print("Buffer processing task started.")
    else:
        print("Buffer processing task is already running.")
