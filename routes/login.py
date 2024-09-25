#IMPORTS

from flask import Blueprint,render_template, render_template, request, redirect, flash
from models.users import users_Schema, add_users

#CREATING BLUEPRINT

login = Blueprint('login', __name__, template_folder='../templates')

#CREATING THE ROUTE

@login.route('/login', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        dict1 = {
            "username": "aric",
            "email": request.form.get('email'),
            "gender": "Male",
            "pfp": "url",
            "OAuth": "token"
        }
        try:
            id = add_users(dict1)
            print(id)
        except Exception as e:
            print(e)
        return redirect('/temp/' + request.form.get("email"))

    return render_template('index.html')
