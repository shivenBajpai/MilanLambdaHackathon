#IMPORTS

from pymongo import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime
from bson.objectid import ObjectId
import pytz

uri = "mongodb+srv://aritron1806:Am180906@cluster0.s15oq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&authSource=admin"

#CREATE DB CLIENT CONNECTION

client = MongoClient(uri, server_api=ServerApi('1'))
db = client.Main_DB
messages = db.messages
users = db.users
anon_convos = db.anon

#EXCEPTIONS
class NotFoundError(Exception):
    pass

class WriteError(Exception):
    pass

#SEND A PING TO CONFIRM CONNECTION

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

#MESSAGE SCHEMA

message_Schema = {
    "$jsonSchema" : {
        "bsonType": "object",
        "required": ["from_id", "to_id", "message", "timestamp", "anon"],
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
                "bsonType": "date",
                "description": "Timestamp of the message"
            },
            "anon": {
                "bsonType": ["objectId", "null"],
                "description": "True for messages in anonymous chats. False otherwise."
            }
        }
    }
}

#CRUD FUNCTIONS

#CREATE MESSAGE COLLECTION => NOT FOR CURRENT USE

def create_messages():

    if(messages != None):
        return "Already Exists"

    try:
        db.create_collection("messages")
    except Exception as e:
        raise Exception(e)

    db.command("collMod", "messages", validator=message_Schema)

    return message_Schema["$jsonSchema"]["properties"].keys()

#ADD MESSAGE ENTRY => TAKES DICTIONARY AS IN SCHEMA EXCEPT ANON [WHICH IT EITHER TAKES AS A CONVO ID OR NULL] => RETURS INSERTED ID
#ADDS INSERTED MESSAGE ID TO THE RESPECTIVE ANON CONVO IF ANON PARAM IS GIVEN IN THE FORM OF ANON ID

def add_message(messageDetails:dict):

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
    
    anon = messageDetails.get("anon", None)
    
    if(not anon):
        messageDetails["anon"] = None
    else:
        messageDetails["anon"] = ObjectId(anon)
  
    messageDetails["from_id"] = ObjectId(messageDetails["from_id"])
    messageDetails["to_id"] = ObjectId(messageDetails["to_id"])
    messageDetails["timestamp"] = datetime.now()

    anon_event = None
    if(anon):
        anon_event = anon_convos.find_one({
            "_id": ObjectId(anon)
        })

        if(not anon_event):
            exception = "Anonymous Conversation not found"
            raise NotFoundError(exception)

    try:
        inserted_record = messages.insert_one(messageDetails)
    except Exception as e:
        if e.__class__.__name__ == "WriteError":
            exception = "Check messageSchema. Input values are not according to it"
            raise WriteError(exception)
        else:
            exception = e
            raise Exception(exception)

    if(anon_event):
        anon_convos.update_one({
            "_id": ObjectId(anon)
        },
        {
            "$addToSet": {
                "messages": inserted_record.inserted_id
            }
        })

    if(not anon):
        users.update_one({
            "_id": ObjectId(messageDetails["from_id"])
        },
        {
            "$addToSet": {
                "contacts": ObjectId(messageDetails["to_id"])
            }
        })

        users.update_one({
            "_id": ObjectId(messageDetails["to_id"])
        },
        {
            "$addToSet": {
                "contacts": ObjectId(messageDetails["from_id"])
            }
        })

    

    return str(inserted_record.inserted_id)

#READ MESSAGES BETWEEN 2 USERS SORTED BY TIMESTAMP => TAKES FROM AND TO ID'S AND OPTIONAL ARGS ARE ANON AND TIMESTAMP => RETURN LIST OF MESSAGE OBJECT DICTIONARIES SORTED BY TIMESTAMP
#IF ANON PARAM IS GIVEN AS ANON CONVO ID, GIVES MESSAGES FROM ANON CONVO ONLY
#IF TIMESTAMP IS GIVEN, SENDS MESSAGES AFTER PARTICULAR TIMESTAMP ONLY [GREATER THAN OR EQUAL TO]
#ADDS USER1 TO USER2'S CONTACT LIST AND VICE VERSA IF CONTACT DOESN'T EXIST ALREADY

def get_message(from_id:str, to_id:str, anon=None, timestamp=None):

    user1 = users.find_one({
        "_id": ObjectId(from_id)
    })

    user2 = users.find_one({
        "_id": ObjectId(to_id)
    })

    if((not user1) or (not user2)):
        exception = "Either one or both users not found in users collection"
        raise NotFoundError(exception)
    
    if(user1 == user2):
        exception = "Both User ids are same"
        raise Exception(exception)

    if(not anon):
        anon = None
    else:
        anon = ObjectId(anon)
        anon_event = anon_convos.find_one({
            "_id": anon
        })
        if(not anon_event):
            exception = f"Anonymous conversation with id:{anon} not found."
            raise NotFoundError(exception)

    query = {
        "from_id": ObjectId(from_id),
        "to_id": ObjectId(to_id),
        "anon": anon
    }

    if(timestamp):
        query["timestamp"] = {
            "$gte": timestamp
        }
    
    message_list_from = list(messages.find(query))

    query["from_id"] = ObjectId(to_id)
    query["to_id"] = ObjectId(from_id)

    message_list_to = list(messages.find(query))

    message_list = message_list_from + message_list_to

    for index,i  in enumerate(message_list):
        message_list[index]["_id"] = str(i["_id"])
        message_list[index]["from_id"] = str(i["from_id"])
        message_list[index]["to_id"] = str(i["to_id"])
        message_list[index]["timestamp"] = int(i['timestamp'].timestamp()*1000) 
        if(anon):
            message_list[index]["anon"] = str(i["anon"])
    
    if(len(message_list) == 0):
        message_list_sorted = message_list
    else:
        message_list_sorted = sorted(message_list, key=lambda d:d['timestamp'])

    if(not anon):
        return_object = {
            "message_list": message_list_sorted,
            "anon_list": []
        }

        anon_event_list_from = list(anon_convos.find({
            "from_id": ObjectId(from_id),
            "to_id": ObjectId(to_id),
            "reveal": 3
        }))

        anon_event_list_to = list(anon_convos.find({
            "from_id": ObjectId(to_id),
            "to_id": ObjectId(from_id),
            "reveal": 3
        }))

        anon_event_list = anon_event_list_from + anon_event_list_to

        for i in anon_event_list:
            return_object["anon_list"].append(str(i["_id"]))
            
    else:
        return_object = list(message_list_sorted)

    return return_object  

#UPDATE MESSAGE CONTENT BY ID => TAKES MESSAGE ID AND NEW MESSAGE VALUE =>  RETURNS UPDATED MESSAGE OBJECT DICTIONARY

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

    return_object = messages.find_one({"_id": ObjectId(id)})
    return_object["from_id"] = str(return_object["from_id"])
    return_object["to_id"] = str(return_object["to_id"])
    if(not return_object["anon"]):
        return_object["anon"] = str(return_object["anon"])

    return return_object
 
#DELETE MESSAGE BY ID => TAKES MESSAGE ID => RETURNS 1 IF REMOVED SUCCESSFULLY
#ALSO REMOVES IT FROM ANON CONVO'S MESSAGE LIST IF DELETED

def delete_message(id):

    message = messages.find_one({
        "_id" : ObjectId(id)
    })

    if(not message):
        exception = f"Couldn't find any message with id: {id}"
        raise NotFoundError(exception)
    
    if(message["anon"]):
        try:
            anon_convos.update_one({
                "_id": message["anon"]
            },
            {
                "$pull": {
                    "messages": ObjectId(id)
                }
            })
        except Exception as e:
            raise Exception(e)

    messages.delete_one({
        "_id": ObjectId(id)
    })

    return 1