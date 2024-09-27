from flask import Flask,Blueprint,render_template,request, g
from routes.auth import oauth
from models import messages, users, anon
from datetime import datetime

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

@api.route('/message/create', methods=['POST'])
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
    
    try:
        from_id = request.args['from_id']
        to_id = request.args['to_id']
        if from_id != request.cookies.get('userid') \
            and to_id != request.cookies.get('userid'):
            return {"err": "Unauthorized"}, 401
        anon = request.args.get('anon', None)
        timestamp = datetime.from_timestamp(int(request.args.get('timestamp', None)))
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


@api.route('/anon/create', methods=['POST'])
@require_auth
def create_anon():
    try:
       return anon.add_anon(request.data)
    except Exception as e:
        return {"err": str(e)}, 500

@api.route('/anon/<anon_id>', methods=['GET'])
@require_auth
def get_anon(anon_id: str): 
    try:
        convo = anon.get_anon(anon_id)
        convo['_id'] = str(convo['_id'])
        return convo
    except Exception as e:
        return {"err": str(e)}, 500

@api.route('/anon/<anon_id>/<message_id>', methods=['PUT'])
@require_auth
def anon_add_message(anon_id: str, message_id: str): 
    try:
        userid = request.cookies.get('userid')
        convo = anon.get_anon(anon_id)
        if userid != str(convo['from_id']) or userid != str(convo['to_id']):
            return {"err": "Unauthorized"}, 401
        return anon.update_anon(anon_id, message_id)
    except Exception as e:
        return {"err": str(e)}, 500

@api.route('/user/<user_id>', methods=['DELETE'])
@require_auth
def delete_anon(anon_id: str):
    try:
        userid = request.cookies.get('userid')
        convo = anon.get_anon(anon_id)
        if userid != str(convo['from_id']) or userid != str(convo['to_id']):
            return {"err": "Unauthorized"}, 401
        return anon.delete_anon(anon_id)
    except Exception as e:
        return {"err": str(e)}, 500

queue = []

to_be_informed = {}

@api.route('/matchmake', methods=['POST'])
@require_auth
def matchmake(): 
    user1 = request.cookies.get('userid')

    if user1 in to_be_informed:
        anon_id = to_be_informed[user1]
        del to_be_informed[user1]
        convo = anon.get_anon(anon_id)
        convo['_id'] = str(convo['_id'])
        return convo
        

    if not queue:
        queue.append(user1)
        return "Waiting", 404

    user2 = queue[0]
    queue = queue[1:]

    anon_id = anon.create_anon({
        "from_id": user1,
        "to_id": user2,
        "messages": []
    })

    convo = anon.get_anon(anon_id)
    convo['_id'] = str(convo['_id'])
    return convo
