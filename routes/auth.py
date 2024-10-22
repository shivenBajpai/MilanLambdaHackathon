from authlib.integrations.flask_client import OAuth
from flask import url_for, Blueprint, redirect, request
from models import users
import requests
from os import environ
#Authlib

oauth = OAuth()
oauth.logged_in = {}

auth = Blueprint('auth', __name__, template_folder='../templates')

#Register google outh
google = oauth.register(
  name='google',
  server_metadata_url = 'https://accounts.google.com/.well-known/openid-configuration',
  access_token_url = "https://accounts.google.com/o/oauth2/token",
  authorize_url = "https://accounts.google.com/o/oauth2/auth",
  access_tokens_params=None,
  authorize_params=None,
  # Collect client_id and client secret from google auth api  
  client_id= environ.get('OAUTH_CLIENT_ID'),
  client_secret = environ.get('OAUTH_CLIENT_SECRET'),
  client_kwargs={
    'scope': 'email profile'
  }
)

@auth.route('/login')
def google_login():
    # Here is the authorized url page
    redirect_uri = url_for('auth.authorize', _external=True)
    google = oauth.create_client('google')
    #then return the user to authorized login page of google
    resp = google.authorize_redirect(redirect_uri)
    
    resp.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    resp.headers["Pragma"] = "no-cache"
    resp.headers["Expires"] = "0"
    resp.headers['Cache-Control'] = 'public, max-age=0' 
    return resp


@auth.route('/logout')
def logout():
    userid = request.cookies.get("userid", None)
    token = request.cookies.get("token", None)
    
    resp = redirect("/") 
    if userid in oauth.logged_in and oauth.logged_in.get(userid) == token:
        del oauth.logged_in['userid']

    resp.delete_cookie('userid')
    resp.delete_cookie('token')

    resp.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    resp.headers["Pragma"] = "no-cache"
    resp.headers["Expires"] = "0"
    resp.headers['Cache-Control'] = 'public, max-age=0' 
    
    return resp

@auth.route('/authorize')
def authorize():
    """Google login page will apear in this will provide you with 
    information of user"""
    google = oauth.create_client('google')
    token = google.authorize_access_token()
    user = token.get('userinfo') # This is the dict for userinfo

    res = requests.get(
      "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
      headers={"Authorization": "Bearer {}".format(token['access_token'])}
    )
    userdata = res.json()

    try:
        user = users.get_user_by_email(userdata['email'])
        id = str(user['_id'])
        print(id)
    except Exception as e:
        print(e)
        id = users.add_user({
            "username": userdata['name'],
            "email": userdata['email'],
            "pfp": userdata['picture'],
        })

    oauth.logged_in[id] = token['access_token']

    print(token)
    oauth.logged_in[id] = token["access_token"]
    resp = redirect('/messages')
    resp.set_cookie('userid', id)
    resp.set_cookie('token', token['access_token'])
    return resp
    #user will return a dict of info like: email = user.get("email")
    #Save the user info to database and login the user
