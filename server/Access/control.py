# jwt_utils.py
import jwt
import datetime
from flask import request, jsonify
import jwt
import datetime
from dotenv import load_dotenv
import os
from functools import wraps
load_dotenv()

# Get the secret key from environment variables
SECRET_KEY = os.getenv("JWT_SECRET_KEY")  # Ensure you have set this in .env

def generate_token(email):
    # Set the expiration time for the token (e.g., 1 hour)
    expiration_time = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    
    # Generate the JWT token
    token = jwt.encode(
        {'email': email, 'exp': expiration_time},
        SECRET_KEY,
        algorithm='HS256'  # Use HMAC SHA256 for signing
    )
    
    return token

def decode_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


# Function to verify JWT token
def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # Check if the token is in the request header
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]  # "Bearer <token>"
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        
        try:
            # Decode the token
            decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            # You can use the decoded token's email (or other info) to identify the user
            current_user = decoded_token['email']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated_function

