#IMPORTS

from pymongo import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime
from bson.objectid import ObjectId
import pytz

uri = "mongodb+srv://aritron1806:Am180906@cluster0.s15oq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&authSource=admin"

# Create a new client and connect to the server

client = MongoClient(uri, server_api=ServerApi('1'))
db = client.Main_DB
messages = db.messages
users = db.users

class NotFoundError(Exception):
    pass

# Send a ping to confirm a successful connection

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

#Message Schema

message_Schema = {
    "$jsonSchema" : {
        "bsonType": "object",
        "required": ["from_id", "to_id", "message", "timestamp"],
        "properties": {
            "from_id": {
                "bsonType": "objectId",
                "description": "It's the _id of the message sender"
            },
            "to_id": {
                "bsonType": "objectId",
                "description": "It's the _id of the message reciever"
            },
            "message": {
                "bsonType": "string",
                "description": "The content of the message"
            },
            "timestamp": {
                "bsonType": "datetime",
                "description": "Timestamp of the message"
            },
            "anon": {
                "bsonType": "bool",
                "description": "True for messages in anonymous chats. False otherwise."
            }
        }
    }
}

#CRUD FUNCTIONS

#CREATE MESSAGE COLLECTION

def create_messages():

    if(messages != None):
        return "Already Exists"

    try:
        db.create_collection("messages")
    except Exception as e:
        raise Exception(e)

    db.command("collMod", "messages", validator=message_Schema)

    return message_Schema["$jsonSchema"]["properties"].keys()

#ADD MESSAGE ENTRY

def add_message(messageDetails:dict, anon:bool):

    user1 = users.find_one({
        "_id": ObjectId(messageDetails["from_id"])
    })

    user2 = users.find_one({
        "_id": ObjectId(messageDetails["to_id"])
    })

    if((not user1) or (not user2)):
        exception = "Either one or both users not found in users collection"
        raise NotFoundError(exception)
    
    if(user1 == user2):
        exception = "Both User ids are same"
        raise Exception(exception)
  
    messageDetails["from_id"] = ObjectId(messageDetails["from_id"])
    messageDetails["to_id"] = ObjectId(messageDetails["to_id"])
    messageDetails["timestamp"] = datetime.now()

    try:
        inserted_record = messages.insert_one(messageDetails)
    except Exception as e:
        if e.__class__.__name__ == "WriteError":
            exception = "Check messageSchema. Input values are not according to it"
        else:
            exception = e
        raise Exception(exception)
    
    return inserted_record.inserted_id

#READ MESSAGES BETWEEN 2 USERS SORTED BY TIMESTAMP

def get_message(from_id:str, to_id:str, anon:bool):

    message_list_from = messages.find({
        "from_id": ObjectId(from_id),
        "to_id": ObjectId(to_id),
        "anon": anon
    })

    message_list_to = messages.find({
        "from_id": ObjectId(to_id),
        "to_id": ObjectId(from_id),
        "anon": anon
    })

    message_list = list(message_list_from) + list(message_list_to)

    if(len(message_list) == 0):
        exception = f"Couldn't find any messages between user1:{from_id} and user2:{to_id}"
        raise NotFoundError(exception)
    
    message_list_sorted = sorted(message_list, key=lambda d:d['timestamp'])

    return list(message_list_sorted)   

def update_message(id, new_message):
    
    message = messages.find_one({
        "_id": ObjectId(id)
    })

    if(not message):
        exception = f"Couldn't find any message with id: {id}"
        raise NotFoundError(exception)
    
    messages.update_one({
        "_id": ObjectId(id)
    },
    {
        "$set": {
            "message": new_message
        }
    })

    return messages.find_one({"_id": ObjectId(id)})

def delete_message(id):

    message = messages.find_one({
        "_id" : ObjectId(id)
    })

    if(not message):
        exception = f"Couldn't find any message with id: {id}"
        raise NotFoundError(exception)

    messages.delete_one({
        "_id": ObjectId(id)
    })

    return 1