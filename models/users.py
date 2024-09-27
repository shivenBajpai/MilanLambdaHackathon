#IMPORTS

from pymongo import MongoClient, errors
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId

uri = "mongodb+srv://aritron1806:Am180906@cluster0.s15oq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&authSource=admin"

#CREATE CONNECTION TO DB 

client = MongoClient(uri, server_api=ServerApi('1'))
db = client.Main_DB
users = db.users

#EXCEPTIONS

class NotFoundError(Exception):
    pass

class WriteError(Exception):
    pass

class DuplicateKeyError(Exception):
    pass


#SEND A PING TO CONFIRM CONECTION

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

#USERS SCHEMA

users_Schema = {
    "$jsonSchema" :{
        "bsonType": "object",
        "required": ["username", "email", "pfp", "contacts"],
        "properties": {
            "username": {
                "bsonType": "string",
                "description": "Must be a string."
            },
            "email": {
                "bsonType": "string",
                "description": "Must be a string containing @"
            },
            "pfp": {
                "bsonType": "string",
                "description": "Must be an URL"
            },
            "contacts": {
                "bsonType": "array",
                "items": {
                    "bsonType": "objectId",
                    "description": "It's the id of the users, the Current User has a DM open with."
                }
            }
        }
    }
}

#CRUD FUNCTIONS

#CREATE USERS COLLECTION => NOT FOR CURRENT USE

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

#ADD USER FUNCTION => TAKES Dictionary as in schema except CONTACTS => RETURNS INSERTED ID

def add_user(userDetails:dict):

    userDetails["contacts"] = []

    try:
        inserted_record = users.insert_one(userDetails)
    except Exception as e:
        if e.__class__.__name__ == "DuplicateKeyError":
            exception = f"User with either Username: {userDetails["username"]} or Email: {userDetails["email"]} already exists in the users collection."
            raise DuplicateKeyError(exception)
        elif e.__class__.__name__ == "WriteError":
            exception = "Check userSchema. Input values are not according to it"
            raise WriteError(exception)
        else:
            exception = e
            raise Exception(exception)
    
    return str(inserted_record.inserted_id)

#READS USERS BY ID => RETURNS OBJECT DICTIONARY

def get_user(id:str):

    user = users.find_one({
        "_id" : ObjectId(id)
    })

    if(not user):
        exception = f"Couldn't find any user with id: {id}"
        raise NotFoundError(exception)
    
    return user

#UPDATE ONE FIELD OF THE DICTIONARY => TAKES User_id, NAME OF FIELD AS IN SCHEMA, NEW VALUE FOR FIELD =>  RETURNS UPDATED USER OBJECT DICTIONARY

def update_user(id:str, field:str, new_value:str):

    user = users.find_one({
        "_id" : ObjectId(id)
    })

    if(not user):
        exception = f"Couldn't find any user with id: {id}"
        raise NotFoundError(exception)

    users.update_one({
        "_id" : ObjectId(id)
    },
    {
        "$set" : {
            field: new_value
        }
    })

    return users.find_one({"_id":ObjectId(id)})

#DELETES DICTIONARY BY ID => RETURNS 1 IF SUCCESSFUL

def delete_user(id:str):

    user = users.find_one({
        "_id" : ObjectId(id)
    })

    if(not user):
        exception = f"Couldn't find any user with id: {id}"
        raise NotFoundError(exception)

    users.delete_one({
        "_id": ObjectId(id)
    })

    return 1

#ADDITIONAL FUNCTIONS

#READS USER BY EMAIL => RETURNS OBJECT DICTIONARY

def get_user_by_email(email:str):

    user = users.find_one({
        "email" : email
    })

    if(not user):
        exception = f"Couldn't find any user with email: {email}"
        raise NotFoundError(exception)
    
    return user

#GET ALL CONTACTS OF AN USER => TAKES ID => RETURNS LIST OF USER DICTIONARY OBJECTS CORRESPONDING TO ALL CONTACTS

def get_contacts(id:str):

    user = users.find_one({
        "_id": ObjectId(id)
    })

    if(not user):
        exception = f"Couldn't find any user with id: {id}"
        raise NotFoundError(exception)
    
    contact_list = user["contacts"]
    
    return_object = []

    for i in contact_list:
        contacted_user = users.find_one({
            "_id": ObjectId(i)
        })
        return_object.append(contacted_user)

    return return_object
