#IMPORTS

from flask import Blueprint,render_template,url_for
from ..models import reset_db

#CREATING BLUEPRINT

base = Blueprint('base', __name__, template_folder='../templates')

#CREATING THE ROUTE

