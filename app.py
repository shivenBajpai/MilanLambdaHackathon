#IMPORTS

from flask import Flask,Blueprint

#IMPORT ROUTES

from routes.base import base

#CREATING OUR APP

app = Flask(__name__)

app.register_blueprint(base)

#RUNNING THE APP

if __name__ == '__main__':
	app.run(host = '0.0.0.0', port=80, debug=True)