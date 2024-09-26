#IMPORTS

from flask import Blueprint, send_from_directory

#CREATING BLUEPRINT

base = Blueprint('base', __name__, template_folder='../templates')

#CREATING THE ROUTE

@base.route("/")
def index():
    return send_from_directory("frontend/dist/", "index.html")

@base.route('/<path:path>')
def serve_bundle(path):
    return send_from_directory("frontend/dist/", path)

