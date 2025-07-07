# auth_routes.py
import random
import smtplib
import bcrypt
from email.mime.text import MIMEText
from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from config import MONGO_URI, DB_NAME
from pymongo import MongoClient
from Access.control import generate_token
from dotenv import load_dotenv
import os

# Connect to MongoDB
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
userlog = db['users']



load_dotenv()  

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
auth_bp = Blueprint('auth_bp', __name__)

def send_email(receiver, subject, body):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = SMTP_EMAIL
    msg['To'] = receiver

    server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
    server.login(SMTP_EMAIL, SMTP_PASSWORD)
    server.sendmail(SMTP_EMAIL, receiver, msg.as_string())
    server.quit()

@auth_bp.route('/send_verification_code', methods=['POST'])
def send_verification_code_route():
    data = request.get_json()
    email = data.get('email')

    if email != ADMIN_EMAIL:
        return jsonify({'success': False, 'message': 'Unauthorized email address.'}), 401

    code = str(random.randint(100000, 999999))
    userlog.update_one({'email': email}, {'$set': {'verification_code': code}}, upsert=True)
    send_email(email, 'Your Verification Code', f'Your verification code is: {code}')

    return jsonify({'success': True, 'message': 'Verification code sent!'})

@auth_bp.route('/verify_code', methods=['POST'])
def verify_code_route():
    data = request.get_json()
    code = data.get('code')
    record = userlog.find_one({'email': ADMIN_EMAIL})

    if record and record.get('verification_code') == code:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': 'Invalid verification code.'}), 400

@auth_bp.route('/update_password', methods=['POST'])
def update_password_route():
    data = request.get_json()
    password = data.get('password')
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    userlog.update_one({'email': ADMIN_EMAIL}, {'$set': {'password': hashed}})

    return jsonify({'success': True, 'message': 'Password updated successfully!'})


@auth_bp.route('/api/login', methods=['POST'])
def login_api():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = userlog.find_one({'email': email})

    if user and bcrypt.checkpw(password.encode('utf-8'), user['password']):
        token = generate_token(email)
        return jsonify({'success': True, 'token': token})
    else:
        return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

