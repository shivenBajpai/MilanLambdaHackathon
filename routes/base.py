#IMPORTS

from flask import Blueprint, send_from_directory
import os

#CREATING BLUEPRINT

base = Blueprint('base', __name__, template_folder='../templates')

#CREATING THE ROUTE

@base.route("/")
@base.route("/messages")
def index():
    return send_from_directory("frontend/dist/", "index.html")

@base.route('/<path:path>')
def serve_bundle(path):
    if os.path.exists("frontend/dist/" + path):
        return send_from_directory("frontend/dist/", path)
    else:
        return send_from_directory("frontend/dist/", "index.html")

