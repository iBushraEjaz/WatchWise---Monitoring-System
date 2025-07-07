import eventlet
eventlet.monkey_patch()  
from flask import Flask
from flask_socketio import SocketIO
import cv2
import requests
import time
import base64
from flask_cors import CORS
from buffer.buffer_work import restore_buffer_once_on_startup, start_buffer_processing
from buffer.buffer_utils import append_to_disk_buffer,activity_buffer,buffer_lock
from database.login import auth_bp  
from Routes.routes import report_bp


app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

COLAB_URL =  "https://327c-34-105-106-14.ngrok-free.app"


background_task_greenlet = None 

def do_handshake():
    try:
        res = requests.post(f"{COLAB_URL}/handshake", json={"initiate": "yes"})
        print("Handshake:", res.json())
        return res.ok
    except Exception as e:
        print("Handshake failed:", e)
        return False

def send_frame_to_colab(frame):
    _, img_encoded = cv2.imencode(".jpg", frame)
    try:
        res = requests.post(f"{COLAB_URL}/predict", files={"frame": img_encoded.tobytes()})
        return res.json()
    except Exception as e:
        print("Prediction error:", e)
        return {}

def video_loop():
    cap = cv2.VideoCapture(0)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        result = send_frame_to_colab(frame)
        if isinstance(result, list) and result:

            for station_data in result:
                if 'box' in station_data:
                    x1, y1, x2, y2 = station_data['box']
                    expand_top = 22  
                    expand_bottom = 10
                    y1_new = max(y1 - expand_top, 0)
                    y2 = min(y2 + expand_bottom, frame.shape[0])

                    activity = station_data.get('activity', '')
                    cv2.rectangle(frame, (x1, y1_new), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(frame, activity, (x1, max(y1_new - 10, 0)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            with buffer_lock:
                for station_data in result:
                    print(f" Prediction: {station_data['station_id']} →  {station_data['activity']} at {station_data['timestamp']}")
                    socketio.emit("prediction", station_data)
                    append_to_disk_buffer(station_data)

                    if station_data['station_id'] not in activity_buffer:
                        activity_buffer[station_data['station_id']] = []

                    activity_buffer[station_data['station_id']].append(station_data)

        _, buffer = cv2.imencode('.jpg', frame)
        frame_base64 = base64.b64encode(buffer).decode('utf-8')
        socketio.emit('video_frame', {'frame': frame_base64})

        time.sleep(1)
 


@app.route("/")
def index():
    return "Backend Running"

@socketio.on("connect")
def client_connect():
    print("Client connected")


app.register_blueprint(auth_bp)  
app.register_blueprint(report_bp)

if __name__ == "__main__":
    restore_buffer_once_on_startup()

    if do_handshake():
        eventlet.spawn(video_loop)  
        start_buffer_processing()  
        socketio.run(app, port=5000)  
    else:
        print("Cannot start — handshake with Colab failed.")


      
