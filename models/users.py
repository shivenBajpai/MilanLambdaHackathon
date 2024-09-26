#IMPORTS

from pymongo import MongoClient, errors
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId

uri = "mongodb+srv://aritron1806:Am180906@cluster0.s15oq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&authSource=admin"

# Create a new client and connect to the server

client = MongoClient(uri, server_api=ServerApi('1'))
db = client.Main_DB
users = db.users

# Send a ping to confirm a successful connection

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

#Users Schema

users_Schema = {
    "$jsonSchema" :{
        "bsonType": "object",
        "required": ["username", "email", "gender", "pfp", "OAuth"],
        "properties": {
            "username": {
                "bsonType": "string",
                "description": "Must be a string."
            },
            "email": {
                "bsonType": "string",
                "description": "Must be a string containing @"
            },
            "gender": {
                "bsonType": "string",
                "enum": ["Male", "Female", "Other"],
                "description": "Must be a string in [\"Male\", \"Female\", \"Other\"]"
            },
            "pfp": {
                "bsonType": "string",
                "description": "Must be an URL"
            },
            "OAuth": {
                "bsonType": "string",
                "description": "Must be an OAuth token"
            },
            "contacts": {
                "bsonType": "array",
                "items": {
                    "bsonType": "objectID",
                    "description": "It's the id of the users, the Current User has a DM open with."
                }
            }
        }
    }
}

#Func to create Users collection

def create_users():

    if(users != None):
        return "Already Exists"

    try:
        db.create_collection("users")
    except Exception as e:
        raise Exception(e)

    db.command("collMod", "users", validator=users_Schema)

    db.users.create_index("username", unique=True)
    db.users.create_index("email", unique=True)

    return users_Schema["$jsonSchema"]["properties"].keys()

#func to add User

def add_user(userDetails:dict):

    try:
        inserted_record = users.insert_one(userDetails)
    except Exception as e:
        if e.__class__.__name__ == "DuplicateKeyError":
            exception = f"User with either Username: {userDetails["username"]} or Email: {userDetails["email"]} already exists in the users collection."
        elif e.__class__.__name__ == "WriteError":
            exception = "Check userSchema. Input values are not according to it"
        else:
            exception = e
        raise Exception(exception)
    
    return inserted_record.inserted_id

#Read users and find by id

def get_user(id):

    user = users.find_one({
        "_id" : ObjectId(id)
    })

    if(not user):
        exception = f"Couldn't find any user with id: {id}"
        raise Exception(exception)
    
    return user

#update one field of users collection

def update_user(id, field, new_value):

    user = users.find_one({
        "_id" : ObjectId(id)
    })

    if(not user):
        exception = f"Couldn't find any user with id: {id}"
        raise Exception(exception)

    users.update_one({
        "_id" : ObjectId(id)
    },
    {
        "$set" : {
            field: new_value
        }
    })

    return users.find_one({"_id":ObjectId(id)})

def delete_user(id):

    user = users.find_one({
        "_id" : ObjectId(id)
    })

    if(not user):
        exception = f"Couldn't find any user with id: {id}"
        raise Exception(exception)

    users.delete_one({
        "_id": ObjectId(id)
    })

    return 1
