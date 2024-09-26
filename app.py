#IMPORTS

from flask import Flask,Blueprint,render_template,request

#IMPORT ROUTES

from routes.base import base
from routes.login import login
from routes.temp import temp
from routes.api import api

#CREATING OUR APP

app = Flask(__name__)

app.register_blueprint(base)
app.register_blueprint(login)
app.register_blueprint(temp)
app.register_blueprint(api, url_prefix='/api')


if __name__ == '__main__':
	app.run(host = '0.0.0.0', port=80, debug=True)