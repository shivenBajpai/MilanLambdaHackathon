#IMPORTS

from flask import Flask,Blueprint,request

from models import reset_db

#CREATING OUR APP

def json_err(errcode, msg):
    return 


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


# CRUD methods for user

@app.route('/api/user/<user_id>', methods=['PUT'])
def create_user(user_id: int):
    try:
        return database.create_user(user_id, request.data)
    except Exception as e:
        return {"err": str(e)}, 500

@app.route('/api/user/<user_id>', method=['GET'])
def get_user(user_id: int):
    try:
        return database.get_user(user_id)
    except Exception as e:
        return {"err": str(e)}, 500

@app.route('/api/user/<user_id>', methods=['POST'])
def update_user(user_id: int):
    try:
        return database.update_user(user_id, request.data)
    except Exception as e:
        return {"err": str(e)}, 500

@app.route('/api/user/<user_id>', methods=['DELETE'])
def delete_user(user_id: int):
    try:
        return database.delete_user(user_id)
    except Exception as e:
        return {"err": str(e)}, 500


# CRUD Methods for message

@app.route('/api/message/<msg_id>', methods=['PUT'])
def create_message(msg_id: int):
    try:
        return database.create_message(msg_id, request.data)
    except Exception as e:
        return {"err": str(e)}, 500

@app.route('/api/message/<msg_id>', method=['GET'])
def get_message(msg_id: int):
    try:
        return database.get_message(msg_id)
    except Exception as e:
        return {"err": str(e)}, 500

@app.route('/api/message/<msg_id>', methods=['POST'])
def update_message(msg_id: int):
    try:
        return database.update_message(msg_id, request.data)
    except Exception as e:
        return {"err": str(e)}, 500


@app.route('/api/message/<msg_id>', methods=['DELETE'])
def delete_message(msg_id: int):
    try:
        return database.delete_message(msg_id)
    except Exception as e:
        return {"err": str(e)}, 500




if __name__ == '__main__':
    app.run(host = '0.0.0.0', port=80, debug=True)