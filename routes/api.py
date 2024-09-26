from flask import Flask,Blueprint,render_template,request
from models import messages, users

api = Blueprint('api', __name__, template_folder='../templates')

# CRUD methods for user

@api.route('/user/create', methods=['PUT'])
def create_user():
    try:
        return users.add_user(request.data)
    except Exception as e:
        return {"err": str(e)}, 500

@api.route('/user/<user_id>', methods=['GET'])
def get_user(user_id: str):
    try:
        return users.get_user(user_id)
    except Exception as e:
        return {"err": str(e)}, 500

@api.route('/user/<user_id>', methods=['POST'])
def update_user(user_id: str):
    try:
        for field, value in request.data:
            users.update_user(user_id, field, value)
        return users.get_user(user_id)
    except Exception as e:
        return {"err": str(e)}, 500

@api.route('/user/<user_id>', methods=['DELETE'])
def delete_user(user_id: str):
    try:
        return users.delete_user(user_id)
    except Exception as e:
        return {"err": str(e)}, 500


# CRUD Methods for message

@api.route('/message/create', methods=['PUT'])
def create_message():
    try:
        return messages.add_message(request.data)
    except Exception as e:
        return {"err": str(e)}, 500

@api.route('/message/<msg_id>', methods=['GET'])
def get_message(msg_id: str):
    try:
        return messages.get_message(msg_id)
    except Exception as e:
        return {"err": str(e)}, 500

@api.route('/message/<msg_id>', methods=['POST'])
def update_message(msg_id: str):
    try:
        return messages.update_message(msg_id, request.data)
    except Exception as e:
        return {"err": str(e)}, 500

@api.route('/message/<msg_id>', methods=['DELETE'])
def delete_message(msg_id: str):
    try:
        return messages.delete_message(msg_id)
    except Exception as e:
        return {"err": str(e)}, 500

