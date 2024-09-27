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

#EXCEPTIONS
class NotFoundError(Exception):
    pass

class WriteError(Exception):
    pass

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
        "required": ["from_id", "to_id", "messages", "reveal"],
        "properties": {
            "from_id": {
                "bsonType": "objectId",
                "description": "It's the _id of the message sender"
            },
            "to_id": {
                "bsonType": "objectId",
                "description": "It's the _id of the message reciever"
            },
            "messages": {
                "bsonType": "array",
                "items": {
                    "bsonType": "objectId",
                    "description": "The _id of the message in the anonymous convo"
                }
            },
            "reveal": {
                "bsonType": "int",
                "enum": [0, 1, 2, 3],
                "description": "Can only take values 0, 1, 2, or 3."
            }
        }
    }
}

#CRUD FUNCTIONS

#CREATE ANON COLLECTION => NOT TO BE USED ANYMORE

def create_anon():

    if(anon_convos != None):
        return "Already Exists"

    try:
        db.create_collection("anon")
    except Exception as e:
        raise Exception(e)

    db.command("collMod", "anon", validator=anon_Schema)

    return anon_Schema["$jsonSchema"]["properties"].keys()

#ADD ANON ENTRY =>  TAKES DICTIONARY AS IN ANON_SCHEMA EXCEPT REVEAL, AND MESSAGES IS AN EMPTY LIST
#RETURN ID OF INSERTED MESSAGE RECORD

def add_anon(anon_details:dict):

    user1 = users.find_one({
        "_id": ObjectId(anon_details["from_id"])
    })

    user2 = users.find_one({
        "_id": ObjectId(anon_details["to_id"])
    })

    if((not user1) or (not user2)):
        exception = "Either one or both users not found in users collection"
        raise NotFoundError(exception)
    
    if(user1 == user2):
        exception = "Both User ids are same"
        raise Exception(exception)

    for index,i in enumerate(anon_details["messages"]):
        anon_details["messages"][index] = ObjectId(i)

    anon_details["from_id"] = ObjectId(anon_details["from_id"])
    anon_details["to_id"] = ObjectId(anon_details["to_id"])
    anon_details["reveal"] = 0

    try:
        inserted_record = anon_convos.insert_one(anon_details)
    except Exception as e:
        if e.__class__.__name__ == "WriteError":
            exception = "Check AnonSchema. Input values are not according to it"
            raise WriteError(exception)
        else:
            exception = e
            raise Exception(exception)

    return str(inserted_record.inserted_id)

#READ ALL MESSAGES OF AN ANON CONVO => TAKES IN ANON_CONVERSATION ID AND OPTIONALLY TIMESTAMP IF FRONTEND WANTS MESSAGES AFTER AND ON A PARTICULAR DATETIME
#RETURNS A LIST OF DICTIONARIES SORTED BY TIMESTAMP

def get_anon(id:str, timestamp=None):

    anon_entry = anon_convos.find_one({
        "_id": ObjectId(id)
    })

    if(not anon_entry):
        exception = "Anonymous Convo not found"
        raise NotFoundError(exception)
    
    query = {}

    if(timestamp):
        query["timestamp"] = {
            "$gte": timestamp
        }
    
    message_list = []

    for i in list(anon_entry["messages"]):
        query["_id"] = ObjectId(i)
        try:
            message_anon = messages.find(query)
        except Exception as e:
            raise Exception(e)
        
        message_anon["from_id"] = str(message_anon["from_id"])
        message_anon["to_id"] = str(message_anon["to_id"])
        if(message_anon["anon"]):
            message_anon["anon"] = str(message_anon["anon"])

        message_list.append(message_anon)

    return sorted(message_list, key=lambda d:d['timestamp'])

#UPDATE ANON BY ADDING A MESSAGE TO IT => TAKES IN ANON_CONVO ID AND MESSAGE ID TO ADD
#RETURNS UPDATED ANON CONVO DICTIONARY OBJECT

def update_anon(convo_id:str,message_id:str):

    message = messages.find_one({
        "_id": ObjectId(message_id)
    })

    if(not message):
        exception = "Message ID not found"
        raise NotFoundError(exception)
    
    anon_entry = anon_convos.find_one({
        "_id": ObjectId(convo_id)
    })

    if(not anon_entry):
        exception = "Convo ID not found"
        raise NotFoundError(exception)
    
    anon_convos.update_one({
        "_id": ObjectId(convo_id)
    },
    {
        "$addToSet": {
            "messages": ObjectId(message_id)
        }
    })

    result_object = anon_convos.find_one({"_id": ObjectId(convo_id)})
    result_object["from_id"] = str(result_object["from_id"])
    result_object["to_id"] = str(result_object["to_id"])
    result_object["_id"] = str(result_object["_id"])

    for index,i in enumerate(result_object["messages"]):
        result_object["message"][index] = str(i)

    return result_object

#DELETE ANON CONVO BY ID => TAKES ANON CONVO ID => RETURNS 1 IF DELETED
#DELETES ALL MESSAGES THAT ARE A PART OF IT

def delete_anon(id:str):

    anon_entry = anon_convos.find_one({
        "_id": ObjectId(id)
    })

    if(not anon_entry):
        exception = "Convo ID not found"
        raise NotFoundError(exception)
    
    for i in list(anon_entry["messages"]):
        messages.delete_one({
            "_id": i
        })

    anon_convos.delete_one({
        "_id": ObjectId(id)
    })

    return 1

#ADDITIONAL FUNCTIONS

#UPDATE REVEAL STATUS => TAKES IN A ANON_CONVO ID AND A NUMBER CORRESPONDING TO THE USER# THAT PRESSED THE REVEAL BUTTON
#RETURNS NOTHING

def reveal_anon(anon_id:str, num:int):
    
    anon_entry = anon_convos.find_one({
        "_id": ObjectId(anon_id)
    })

    if(not anon_entry):
        exception = "Convo ID not found"
        raise NotFoundError(exception)
    
    if(num != 1 and num != 2):
        exception = "Invalid of 2nd Arg"
        raise Exception(exception)
    
    reveal = anon_entry["reveal"]

    if(reveal == 0):
        reveal = num
    elif(reveal == 1 and num == 2):
        reveal = 3
    elif(reveal == 2 and num == 1):
        reveal = 3
    
    anon_convos.update_one({
        "_id": ObjectId(anon_id)
    },
    {
        "$set": {
            "reveal": reveal
        }
    })

    for i in anon_entry["messages"]:
        messages.update_one({
            "_id": ObjectId(i)
        },
        {
            "$set": {
                "anon": None
            }
        })
    
    users.update_one({
            "_id": ObjectId(anon_entry["from_id"])
        },
        {
            "$addToSet": {
                "contacts": ObjectId(anon_entry["to_id"])
            }
        })

    users.update_one({
        "_id": ObjectId(anon_entry["to_id"])
    },
    {
        "$addToSet": {
            "contacts": ObjectId(anon_entry["from_id"])
        }
    })

#GET ANON_CONVO OBJECT FOR THE 2 USER IDS AND REVEAL STATUS => TAKE ANON_CONVO ID
#RETURNS THE DICTIONARY OBJECT OF A ANON CONVO

def get_anon_dict(id:str):

    anon_entry = anon_convos.find_one({
        "_id": ObjectId(id)
    })

    if(not anon_entry):
        exception = "Convo ID not found"
        raise NotFoundError(exception)
    
    anon_entry["from_id"] = str(anon_entry["from_id"])
    anon_entry["to_id"] = str(anon_entry["to_id"])
    anon_entry["_id"] = str(anon_entry["_id"])

    for index,i in enumerate(anon_entry["messages"]):
        anon_entry["message"][index] = str(i)
    
    return anon_entry