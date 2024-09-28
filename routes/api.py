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
        return f(*args, **kwargs)
        
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
        users.delete_user(user_id)
        return {"ok": "ok"}
    except Exception as e:
        return {"err": str(e)}, 500
    
@api.route('/user/search/<user_id>', methods=['GET'])
@require_auth
def search_user(user_id:str):
    if user_id != request.cookies.get('userid'):
        return {"err": "Unauthorized"}, 401

    try:
        search_list = users.search_user(user_id, request.data)
        return search_list
    except Exception as e:
        return {"err" : str(e)}, 500

# CRUD Methods for message

@api.route('/message/create', methods=['POST'])
@require_auth
def create_message():
    data = request.json
    if data.get('from_id') != request.cookies.get('userid'):
        return {"err": "Unauthorized"}, 401

    try: 
        return messages.add_message(data)
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
        timestamp = datetime.fromtimestamp(int(request.args.get('timestamp', 0)))
        msg = messages.get_message(from_id, to_id, anon, timestamp)
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
        messages.delete_message(msg_id)
        return {"ok": "ok"}
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
    global queue
    print(queue)
    user1 = request.cookies.get('userid')

    if user1 in to_be_informed:
        anon_id = to_be_informed[user1]
        del to_be_informed[user1]
        convo = anon.get_anon_dict(anon_id)
        return convo 

    if not queue:
        queue.append(user1)
        return {"err": "Waiting"}, 420

    if queue[0] == user1:
        return {"err": "Waiting"}, 420

    user2 = queue[0]
    queue = queue[1:]

    anon_id = anon.add_anon({
        "from_id": user1,
        "to_id": user2,
        "messages": []
    })

    convo = anon.get_anon_dict(anon_id)
    to_be_informed[user2] = anon_id
    return convo

@api.route('/reveal/<anon_id>', methods=['POST'])
@require_auth
def reveal(anon_id: str):
    userid = request.cookies.get('userid')

    try:
        convo = anon.get_anon_dict(anon_id)
        if userid == convo['from_id'] and userid != convo['to_id']:
            return {"err": "Unauthorized"}, 401
        anon.reveal_anon(anon_id, userid)
        return {"ok": "ok"}
    except Exception as e:
        {"err": str(e)}, 500