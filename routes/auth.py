from authlib.integrations.flask_client import OAuth
from flask import url_for, Blueprint, redirect
#Authlib
oauth = OAuth()

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
  client_id= "245515350791-2r5d6ptj9h4ava8ujeledkj644aamurf.apps.googleusercontent.com",
  client_secret = "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",
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
    return google.authorize_redirect(redirect_uri)


@auth.route('/authorize')
def authorize():
    """Google login page will apear in this will provide you with 
    information of user"""
    google = oauth.create_client('google')
    token = google.authorize_access_token()
    user = token.get('userinfo') # This is the dict for userinfo
    resp = redirect('/messages')
    return resp
    #user will return a dict of info like: email = user.get("email")
    #Save the user info to database and login the user
