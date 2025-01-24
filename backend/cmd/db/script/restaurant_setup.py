import requests
#from googlemaps import GooglePlaces, types, lang


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
print(api_key)

def google_places_search():
    url = 'https://places.googleapis.com/v1/places:searchNearby'
    place_types = ['restaurant', 'cafe', 'bar']
    location_restriction = {
        "circle": {
            "center": {
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
                         'places.servesWine', 'places.editorialSummary', 'places.primaryTypeDisplayName',]
    params = {
        'fields': ",".join(fields),
        'key': api_key
    }

    body = {
        'includedTypes': place_types,
        'maxResultCount': 10,
        'locationRestriction': location_restriction,
    }

    response = requests.post(url, json=body, params=params)
    data = response.json()
    print(data)

google_places_search()
