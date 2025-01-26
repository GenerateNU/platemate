from pymongo import MongoClient
from restaurant_setup import convert_to_mongo_db_format, load_env_variable

mongo_db_uri = load_env_variable("backend/.env", "MONGO_DB_URI")
client = MongoClient(mongo_db_uri)
db = client['dev-restaurants-api']
collection = db['restaurants']

def insert_db(restaurants):
    for place in restaurants:
            collection.insert_one(place)

restaurants_for_mongo = convert_to_mongo_db_format()
insert_db(restaurants_for_mongo)