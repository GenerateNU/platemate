from pymongo import MongoClient
from restaurant_setup import convert_to_mongo_db_format, load_env_variable, generate_mock_restaurant_data
from users_setup import generate_user_data

mongo_db_uri = load_env_variable("backend/.env", "MONGO_DB_URI")
client = MongoClient(mongo_db_uri)
db = client['Featurethon']
collection = db['restaurants']

def insert_db(restaurants):
    for place in restaurants:
            collection.insert_one(place)
            
def delete_documents():
    collection.delete_many({})

restaurants_for_mongo = convert_to_mongo_db_format()
# users_for_mongo = generate_user_data()
# mock_restaurant_data = generate_mock_restaurant_data()
insert_db(restaurants_for_mongo)
# delete_documents()