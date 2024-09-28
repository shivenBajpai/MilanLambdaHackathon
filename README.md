
<div align="center">
<img src="logo.svg" style="margin: auto" width="100px">
<div style="font-size: 100px">Anonymia</div>
</div>


## What is it?
 - It's a **chat app** where you can talk to all your friends!
 - ... and **meet new people anonymously**!


## Who made it?

Aric, Saadiq, Shiven and Shivram from S.N. Bose!

## How do I run it?

First install all the Python dependencies

```
pip install -r requirements.txt
```

Then install frontend dependencies and build the bundle.

```
cd frontend
npm install
npm run build
```

Create a file called `.env` with the following secrets:
```
MONGO_URL = "mongodb url"
OAUTH_CLIENT_SECRET = "oauth client secret" 
OAUTH_CLIENT_ID = "oauth client id" 
SECRET_KEY = "secret key"
```

Start the server with

```
flask run
```

Then open https://localhost:5000 in your browser.

## How's it made?

- **Flask** on the backend
- **MongoDB** as a database
- **React** on the frontend
- ...with **Tailwind** for CSS
