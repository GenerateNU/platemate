import requests
#from googlemaps import GooglePlaces, types, lang
import json

def load_env_variable(file_path, key):
    with open(file_path, "r") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#"):  # Ignore comments and empty lines
                k, v = line.split("=", 1)
                if k == key:
                    return v.strip()
    return None

# Specify the .env file and the key to retrieve
api_key = load_env_variable("backend/.env", "GOOGLE_PLACES_API_KEY")
# we only want places that's primary focus is food/drink
place_types = [
    'acai_shop', 'afghani_restaurant', 'african_restaurant', 'american_restaurant', 
    'asian_restaurant', 'bagel_shop', 'bakery', 'bar', 'bar_and_grill', 'barbecue_restaurant', 
    'brazilian_restaurant', 'breakfast_restaurant', 'brunch_restaurant', 'buffet_restaurant', 
    'cafe', 'cafeteria', 'candy_store', 'cat_cafe', 'chinese_restaurant', 'chocolate_factory', 
    'chocolate_shop', 'coffee_shop', 'confectionery', 'deli', 'dessert_restaurant', 
    'dessert_shop', 'diner', 'dog_cafe', 'donut_shop', 'fast_food_restaurant', 
    'fine_dining_restaurant', 'food_court', 'french_restaurant', 'greek_restaurant', 
    'hamburger_restaurant', 'ice_cream_shop', 'indian_restaurant', 'indonesian_restaurant', 
    'italian_restaurant', 'japanese_restaurant', 'juice_shop', 'korean_restaurant', 
    'lebanese_restaurant', 'meal_delivery', 'meal_takeaway', 'mediterranean_restaurant', 
    'mexican_restaurant', 'middle_eastern_restaurant', 'pizza_restaurant', 'pub', 
    'ramen_restaurant', 'restaurant', 'sandwich_shop', 'seafood_restaurant', 
    'spanish_restaurant', 'steak_house', 'sushi_restaurant', 'tea_house', 'thai_restaurant', 
    'turkish_restaurant', 'vegan_restaurant', 'vegetarian_restaurant', 'vietnamese_restaurant', 
    'wine_bar'
]

def google_places_search():
    url = 'https://places.googleapis.com/v1/places:searchNearby'
    place_types = ['restaurant', 'cafe', 'bar']
    location_restriction = {
        "circle": {
            "center": { # coordinates of Boston, MA
                "latitude": 42.361145,
                "longitude": -71.057083
                },
            "radius": 32000 # about 20 miles
        }
    }
    fields = ['places.name','places.displayName', 'places.location', 'places.types', 'places.formattedAddress',
                   'places.servesBeer', 'places.servesBreakfast',
                     'places.servesBrunch', 'places.servesCocktails', 'places.servesCoffee',
                       'places.servesDessert', 'places.servesDinner', 'places.servesLunch', 'places.servesVegetarianFood',
                         'places.servesWine', 'places.editorialSummary', 'places.primaryTypeDisplayName', 'places.googleMapsUri', 'places.rating']
    params = {
        'fields': ",".join(fields),
        'key': api_key
    }

    body = {
        'includedPrimaryTypes': place_types,
        'includedTypes': place_types,
        'maxResultCount': 20,
        'locationRestriction': location_restriction,
    }

    response = requests.post(url, json=body, params=params)
    if response.status_code == 200:
        # Parse the JSON response
        data = response.json()
        print(data)
        # Write the JSON data to a file
        with open("backend/cmd/db/script/api_response.json", "w") as outfile:
            json.dump(data, outfile, indent=4)  # Pretty-print the JSON to the file
        print("JSON data has been written to 'response.json'")
    else:
        print(f"Error: {response.status_code} - {response.text}")
        
def convert_to_mongo_db_format():
    restaurants_for_mongo = []
    tags = {}
    tags['servesBreakfast'] = 'Serves Breakfast'
    tags['servesLunch'] = 'Serves Lunch'
    tags['servesDinner'] = 'Serves Dinner'
    tags['servesBeer'] = 'Serves Beer'
    tags['servesWine'] = 'Serves Wine'
    tags['servesBrunch'] = 'Serves Brunch'
    tags['servesVegetarianFood'] = 'Serves Vegetarian Food'
    tags['servesCocktails'] = 'Serves Cocktails'
    tags['servesDessert'] = 'Serves Dessert'
    tags['servesCoffee'] = 'Serves Coffee'
    available_tags = ['servesBreakfast', 'servesLunch', 'servesDinner', 'servesBeer', 'servesWine', 'servesBrunch', 'servesVegetarianFood', 'servesCocktails', 'servesDessert', 'servesCoffee']
    
    with open("backend/cmd/db/script/api_response.json", "r") as file:
        restaurants = json.load(file) 
    for restaurant in restaurants['places']:
        restaurant_for_mongo = {}
        restaurant_for_mongo['name'] = restaurant['displayName']['text']
        inputted_address = restaurant['formattedAddress'].split(',')
        state_and_zip = inputted_address[2].split(" ")
        restaurant_for_mongo['address'] = {}
        restaurant_for_mongo['address']['street'] = inputted_address[0]
        restaurant_for_mongo['address']['zipcode'] = state_and_zip[2]
        restaurant_for_mongo['address']['state'] = state_and_zip[1] 
        restaurant_for_mongo['address']['location'] = restaurant["location"]
        restaurant_for_mongo['menuItems'] = []
        restaurant_for_mongo['ratingAvg'] = {}
        restaurant_for_mongo['ratingAvg']['overall'] = 5.0
        restaurant_for_mongo['ratingAvg']['return'] = 100
        restaurant_for_mongo['style'] = restaurant['primaryTypeDisplayName']['text']
        restaurant_for_mongo['picture'] = restaurant['googleMapsUri']
        if 'editorialSummary' in restaurant.keys():  
            restaurant_for_mongo['description'] = restaurant['editorialSummary']['text']
        else:
            restaurant_for_mongo['description'] = ""
        restaurant_for_mongo['tags'] = []
        for tag in available_tags:
            if tag in restaurant.keys() and restaurant[tag]:
                restaurant_for_mongo['tags'].append(tags[tag])
        restaurants_for_mongo.append(restaurant_for_mongo)
    return restaurants_for_mongo
        
    
#google_places_search()
#convert_to_mongo_db_format()

