import datasets

from bson import ObjectId
from reccomendation import g_db, get_embedding, vectorQuery
import requests
from transformers import pipeline

pipe = pipeline("text-classification", model="lvwerra/distilbert-imdb")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn", max_length=100)

def generate_review_sentiments():
   reviews = g_db.reviews.find()
   for review in reviews:
      print(review)
      review_text = review["content"]
      sentiment = pipe(review_text)
      print(sentiment)
      score = sentiment[0]["score"]
      label = sentiment[0]["label"]
      g_db.reviews.update_one({"_id": review["_id"]}, {"$set": {"sentiment": score, "sentiment_label": label}})
    
   print("Generated Sentiment")
    
def generate_menu_item_summaries():
   # get all menu items
   menu_items = g_db.menuItems.find()
   for menu_item in menu_items:
      reviews = g_db.reviews.find({"menuItem": menu_item["_id"]})
      reviews = list(reviews)
      if len(reviews) == 0:
         continue
      else:
        # summarize the reviews
        summary = summarizer("\n".join([review["content"] for review in reviews]))
        print(summary)
        g_db.menuItems.update_one({"_id": menu_item["_id"]}, {"$set": {"summary": summary[0]["summary_text"]}})

# generate_review_sentiments()
# generate_menu_item_summaries()

def create_menu_taste_profiles():
  # get all menu items with summaries
  menu_items = g_db.menuItems.find({"summary": {"$exists": True}})
  for menu_item in menu_items:
    print(menu_item)
    menu_taste_profile = menu_item["summary"] + menu_item["description"]
    print(menu_taste_profile)
    embeddings = get_embedding(menu_taste_profile)
    g_db.menuItems.update_one({"_id": menu_item["_id"]}, {"$set": {"taste_profile": embeddings}})
  
# create_menu_taste_profiles()

def create_user_taste_profiles():
  # get all users
  users = g_db.users.find()

  for user in users: 
    print(user["_id"])
    top = requests.get(f"http://localhost:8080/api/v1/review/user/{user['_id']}/top")
    top = top.json()
    print(top)
    
    user_taste_profile = ""
    for review in top:
        print(review)
        synthesized = [
            f"CONTENT: " + review["content"],
            f"OVERALL: {review["rating"]["overall"]}",
            f"PORTION: {review["rating"]["portion"]}",
            f"TASTE: {review["rating"]["taste"]}",
            f"VALUE: {review["rating"]["value"]}",
            f"MENU ITEM NAME: {review['items'][0]['Name']}",
            f"MENU ITEM DESCRIPTION: {review['items'][0]['Description']}",
        ]
        final = " ".join(synthesized)
        user_taste_profile += final + "\n"

    embeddings = get_embedding(user_taste_profile)
    g_db.users.update_one({"_id": user["_id"]}, {"$set": {"taste_profile": embeddings}})