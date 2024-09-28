from dotenv import load_dotenv
load_dotenv()

#IMPORTS
from flask import Flask,Blueprint,render_template,request
from os import environ

#IMPORT ROUTES

from routes.login import login
from routes.temp import temp
from routes.api import api
from routes.auth import auth, oauth
from routes.base import base

#CREATING OUR APP

app = Flask(__name__)
app.secret_key = environ.get('SECRET_KEY')

oauth.init_app(app)

# app.register_blueprint(login)
# app.register_blueprint(temp)
app.register_blueprint(api, url_prefix='/api')
app.register_blueprint(auth)
app.register_blueprint(base)

if __name__ == '__main__':
	app.run(host = '0.0.0.0', port=80, debug=True)