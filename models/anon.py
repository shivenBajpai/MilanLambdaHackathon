#IMPORTS

from pymongo import MongoClient, errors
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId

uri = "mongodb+srv://aritron1806:Am180906@cluster0.s15oq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&authSource=admin"

#CREATE CONNECTION TO DB 

client = MongoClient(uri, server_api=ServerApi("1"))
db = client.Main_DB
users = db.users
messages = db.messages
anon_convos = db.anon

#SEND A PING TO CONFIRM CONECTION

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to mongoDB!")
except Exception as e:
    print(e)

#ANON SCHEMA

anon_Schema = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["from_id", "to_id", "messages"],
        "properties": {
            "from_id": {
                "bsonType": "objectID",
                "description": "It's the _id of the message sender"
            },
            "to_id": {
                "bsonType": "objectID",
                "description": "It's the _id of the message reciever"
            },
            "messages": {
                "bsonType": "array",
                "items": {
                    "bsonType": "objectID",
                    "description": "The _id of the message in the anonymous convo"
                }
            }
        }
    }
}

#CRUD FUNCTIONS

#CREATE ANON COLLECTION

def create_anon():

    if(anon_convos != None):
        return "Already Exists"
    
    try:
        db.create_collection("anon")
    except Exception as e:
        raise Exception(e)
    
    db.command("collMod", "anon", validator=anon_Schema)

    return anon_Schema["$jsonSchema"]["properties"].keys()

#ADD ANON ENTRY

def add_anon(anon_details:dict):

    user1 = users.find_one({
        "_id": ObjectId(anon_details["from_id"])
    })

    user2 = users.find_one({
        "_id": ObjectId(anon_details["to_id"])
    })

    if((not user1) or (not user2)):
        exception = "Either one or both users not found in users collection"
        raise Exception(exception)
    
    if(user1 == user2):
        exception = "Both User ids are same"
        raise Exception(exception)

    