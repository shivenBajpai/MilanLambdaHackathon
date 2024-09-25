#IMPORTS

from flask import Blueprint,render_template, render_template, request, redirect, flash

#CREATING BLUEPRINT

temp = Blueprint('temp', __name__, template_folder='../templates')

#CREATING THE ROUTE

@temp.route('/temp/<email>')
def index(email):
    return render_template('temp.html', email=email)
