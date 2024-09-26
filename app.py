#IMPORTS

from flask import Flask,Blueprint,render_template,request

#IMPORT ROUTES

from models import messages, users

from routes.base import base
from routes.login import login
from routes.temp import temp

#CREATING OUR APP

app = Flask(__name__)

app.register_blueprint(base)
app.register_blueprint(login)
app.register_blueprint(temp)

@app.route('/')
def index():
    return render_template('index.html')

# CRUD methods for user

@app.route('/api/user/<user_id>', methods=['PUT'])
def create_user(user_id: int):
    try:
        return users.add_user(request.data)
    except Exception as e:
        return {"err": str(e)}, 500

@app.route('/api/user/<user_id>', methods=['GET'])
def get_user(user_id: int):
    try:
        return users.get_user(user_id)
    except Exception as e:
        return {"err": str(e)}, 500

@app.route('/api/user/<user_id>', methods=['POST'])
def update_user(user_id: int):
    try:
        for field, value in request.data:
            users.update_user(user_id, field, value)
        return users.get_user(user_id)
    except Exception as e:
        return {"err": str(e)}, 500

@app.route('/api/user/<user_id>', methods=['DELETE'])
def delete_user(user_id: int):
    try:
        return users.delete_user(user_id)
    except Exception as e:
        return {"err": str(e)}, 500


# CRUD Methods for message

@app.route('/api/message/<msg_id>', methods=['PUT'])
def create_message(msg_id: int):
    try:
        return messages.add_message(request.data)
    except Exception as e:
        return {"err": str(e)}, 500

@app.route('/api/message/<msg_id>', methods=['GET'])
def get_message(msg_id: int):
    try:
        return messages.get_message(msg_id)
    except Exception as e:
        return {"err": str(e)}, 500

@app.route('/api/message/<msg_id>', methods=['POST'])
def update_message(msg_id: int):
    try:
        return messages.update_message(msg_id, request.data)
    except Exception as e:
        return {"err": str(e)}, 500


@app.route('/api/message/<msg_id>', methods=['DELETE'])
def delete_message(msg_id: int):
    try:
        return messages.delete_message(msg_id)
    except Exception as e:
        return {"err": str(e)}, 500




if __name__ == '__main__':
	app.run(host = '0.0.0.0', port=80, debug=True)