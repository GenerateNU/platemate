__package__ = "reccomendation"

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
def vectorQuery(text, collection):
    # define pipeline
    pipeline = [
    {
        '$vectorSearch': {
        'index': 'taste_profile', 
        'path': 'taste_profile', 
        'queryVector': get_embedding(text),
        'numCandidates': 5, 
        'limit': 5
        } 
    }, {
        '$project': {
        '_id': 0, 
        'name': 1,
        'score': {
                '$meta': 'vectorSearchScore'
            }
        }
    }
    ]
    print("Querying the database for term: " + text)
    return collection.aggregate(pipeline)

g_client = MongoClient(config["MONGO_DB_URI"])
g_db = g_client["Featurethon"]
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

@app.get("/similar", response_description="Given a query, return the artists that match the query", status_code=status.HTTP_200_OK)
async def query_artists(term, secret, request: Request):
    print("hi")
    # return list(vectorQuery(term, secret, request.app.artists_collection))