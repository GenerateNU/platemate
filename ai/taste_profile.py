__package__ = "reccomendation"

from reccomendation import g_db, get_embedding
import requests

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