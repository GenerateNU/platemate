# from sentence_transformers import SentenceTransformer
from openai import OpenAI

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import csv
from dotenv import load_dotenv, dotenv_values
from contextlib import asynccontextmanager
from pymongo import MongoClient
from fastapi import APIRouter, Body, Request, Response, HTTPException, status
from fastapi.encoders import jsonable_encoder
from typing import List
from pymongo.database import Database
from pymongo.collection import Collection
from pymongo.results import InsertOneResult
from pymongo.errors import DuplicateKeyError
from pymongo.operations import SearchIndexModel 
from bson import ObjectId
import requests
import json


config = dotenv_values(".env")

client = OpenAI(api_key=config["API_KEY"])
response = client.embeddings.create(
    input="",
    model="text-embedding-3-small"
)


# This function is used to get the embeddings of the text
def get_embedding(text, model="text-embedding-3-small"):
    text = text.replace("\n", " ")
    return client.embeddings.create(input = [text], model=model).data[0].embedding

# Given a text and a secret, this function will tell us how similar the text is to the secret
def vectorQuery(text, index, collection, filter={}):
    # define pipeline
    pipeline = [
    {
        '$vectorSearch': {
        'index': index, 
        'path': 'taste_profile', 
        'queryVector': text,
        'filter': filter,
        'numCandidates': 5, 
        'limit': 5
        } 
    }, {
        '$project': {
        '_id': 1, 
        'name': 1,
        'score': {
                '$meta': 'vectorSearchScore'
            }
        }
    }
    ]
    print("Querying the database with a vector query")
    return collection.aggregate(pipeline)

g_client = MongoClient(config["MONGO_DB_URI"])
g_db = g_client["Featurethon"]
class MyJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o) # this will return the ID as a string
        return json.JSONEncoder.default(self, o)

def reccomend_menu_item(user_id):
   input_user = ObjectId(user_id)
   user = g_db.users.find_one({"_id": input_user})
   taste_profile = user["taste_profile"]
   print(taste_profile)
   top = vectorQuery(taste_profile,"taste_profile_item", g_db.menuItems)

   thing = list(top)
   encoder = MyJSONEncoder()
   return [json.loads(encoder.encode(ret)) for ret in thing]

def reccomend_item_at_restaurant(user_id, restaurant_id):
   input_user = ObjectId(user_id)
   input_rest = ObjectId(restaurant_id)

   user = g_db.users.find_one({"_id": input_user})
   taste_profile = user["taste_profile"]
   print(taste_profile)
   top = vectorQuery(taste_profile,"taste_profile_item", g_db.menuItems, {
       'restaurantid': {"$eq": input_rest}
   })

   thing = list(top)
   encoder = MyJSONEncoder()
   return [json.loads(encoder.encode(ret)) for ret in thing]

def reccomend(user_id):
   print(user_id)
   input_user = ObjectId(user_id)
   user = g_db.users.find_one({"_id": input_user})
   taste_profile = user["taste_profile"]
   print(taste_profile)
   top = vectorQuery(taste_profile,"taste_profile", g_db.users)

   top = list(top)
   reccomendations = []
   for item in top:
      print(item["_id"])
      top_similar = requests.get(f"http://137.184.211.229/api/v1/review/user/{user['_id']}/top?limit=20")
      top_similar = top_similar.json()
      # get the ids of the menu items that are returned in the top 20 similar reviews
      menu_items = [review["items"][0]["ID"] for review in top_similar]
      print(menu_items)
      # for each menu item, if the user has reviewed it then ignore it 
      for menu_item in menu_items:
         res = g_db.reviews.find_one({"menuItem": menu_item, "reviewer._id": user["_id"]})
         if res is None:
            reccomendations.append(ObjectId(menu_item))

   print(reccomendations)
   cursor = g_db.menuItems.find({"_id": {"$in": reccomendations}})
   thing = list(cursor)
   encoder = MyJSONEncoder()
   return [json.loads(encoder.encode(ret)) for ret in thing]

import json
from bson import ObjectId # bson = binary JSON, the data format used by MongoDB




@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize MongoDB connection before application starts
    app.mongodb_client = MongoClient(config["MONGO_DB_URI"])
    app.database = app.mongodb_client["Featurethon"]
    print("Connected to MongoDB")
    yield
    # Close MongoDB connection after application shuts down
    app.mongodb_client.close()
    print("Disconnected from MongoDB")

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods, replace with specific methods if needed
    allow_headers=["*"],  # Allows all headers, replace with specific headers if needed
)
router = APIRouter()

@app.get("/")
async def root():
    return {"message": "platemate rec"}

@app.get("/random", response_description="Create a new Artist in Database", status_code=status.HTTP_200_OK)
async def get_random_artist(request: Request):
    print("hi")

@app.get("/reccomendation/menu_item", response_description="Given a query, return the artists that match the query", status_code=status.HTTP_200_OK)
async def rec_menu_item(user_id, request: Request):
    print(user_id)
    return reccomend_menu_item(user_id)
@app.get("/reccomendation/restaurant", response_description="Given a query, return the artists that match the query", status_code=status.HTTP_200_OK)
async def rec_restaurant(user_id, restaurant_id, request: Request):
    print(user_id)
    print(restaurant_id)
    return reccomend_item_at_restaurant(user_id, restaurant_id)
@app.get("/reccomendation", response_description="Given a query, return the artists that match the query", status_code=status.HTTP_200_OK)
async def rec_feed(user_id, request: Request):
    print(user_id)
    return reccomend(user_id)
    # return listi(vectorQuery(term, secret, request.app.artists_collection))