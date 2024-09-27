from flask import Flask,Blueprint,render_template,request, g
from routes.auth import oauth
from models import messages, users

from functools import wraps

api = Blueprint('api', __name__, template_folder='../templates')

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Use in testing
        # return f(*args, **kwargs)
        
        userid = request.cookies.get('userid', None)
        token = request.cookies.get('token', None)
        
        if userid in oauth.logged_in and oauth.logged_in.get(userid) == token:
            return f(*args, **kwargs)
        return {"err": "Unauthorized"}, 401

    return decorated_function

# CRUD methods for user

@api.route('/user/create', methods=['POST'])
@require_auth
def create_user():
    userid = request.cookies.get('userid', None)
    token = request.cookies.get('token', None)

    if (userid is None or token is None):
        return {"err": "Unauthorized"}, 401

    try:
        return users.add_user(request.data)
    except Exception as e:
        return {"err": str(e)}, 500

@api.route('/user/<user_id>', methods=['GET'])
@require_auth
def get_user(user_id: str): 
    try:
        user = users.get_user(user_id)
        user['_id'] = str(user['_id'])
        return user
    except Exception as e:
        return {"err": str(e)}, 500

@api.route('/user/<user_id>', methods=['PUT'])
@require_auth
def update_user(user_id: str):
    if user_id != request.cookies.get('userid'):
        return {"err": "Unauthorized"}, 401

    try:
        for field, value in request.data:
            users.update_user(user_id, field, value)
        user = users.get_user(user_id)
        user['_id'] = str(user['_id'])
        return user
    except Exception as e:
        return {"err": str(e)}, 500

@api.route('/user/<user_id>', methods=['DELETE'])
@require_auth
def delete_user(user_id: str):
    if user_id != request.cookies.get('userid'):
        return {"err": "Unauthorized"}, 401

    try:
        return users.delete_user(user_id)
    except Exception as e:
        return {"err": str(e)}, 500


# CRUD Methods for message

@api.route('/message/create', methods=['POSTT'])
@require_auth
def create_message():
    if request.data.get('from_id') != request.cookies.get('userid'):
        return {"err": "Unauthorized"}, 401

    try: 
        return messages.add_message(request.data)
    except Exception as e:
        return {"err": str(e)}, 500

@api.route('/message/get', methods=['GET'])
@require_auth
def get_message():
    if request.data.get('from_id') != request.cookies.get('userid') \
        and requests.data.get('to_id') != request.cookies.get('userid'):
        return {"err": "Unauthorized"}, 401
    
    try:
        from_id = request.data['from_id']
        to_id = request.data['to_id']
        anon = request.data.get('anon', None)
        timestamp = request.data.get('timestamp', None) 
        msg = users.get_message(from_id, to_id, anon, timestamp)
        msg['_id'] = str(msg['_id'])
        return msg
    except Exception as e:
        return {"err": str(e)}, 500

@api.route('/message/<msg_id>', methods=['PUT'])
@require_auth
def update_message(msg_id: str):
    try:
        return messages.update_message(msg_id, request.data)
    except Exception as e:
        return {"err": str(e)}, 500

@api.route('/message/<msg_id>', methods=['DELETE'])
@require_auth
def delete_message(msg_id: str):
    try:
        return messages.delete_message(msg_id)
    except Exception as e:
        return {"err": str(e)}, 500

