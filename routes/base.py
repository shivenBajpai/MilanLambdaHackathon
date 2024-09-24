#IMPORTS

from flask import Blueprint,render_template,url_for

#CREATING BLUEPRINT

base = Blueprint('base', __name__, template_folder='../templates')

#CREATING THE ROUTE

@base.route('/')
def index():
    return render_template('index.html')
