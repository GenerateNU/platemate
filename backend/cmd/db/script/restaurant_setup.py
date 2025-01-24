import requests
#from googlemaps import GooglePlaces, types, lang

def google_places_search():
    url = 'https://places.googleapis.com/v1/places:searchNearby'
    api_key = 'AIzaSyA82EmyqRfBPxB1mSNQRjr-gq5oLHqj5vM'
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
    params = {
        'includedTypes': place_types,
        'maxResultCount': 10,
        'locationRestriction': location_restriction,
        'fields': ['places.name','places.displayName', 'places.location', 'places.types', 'places.formattedAddress',
                   'places.servesBeer', 'places.servesBreakfast',
                     'places.servesBrunch', 'places.servesCocktails', 'places.servesCoffee',
                       'places.servesDessert', 'places.servesDinner', 'places.servesLunch', 'places.servesVegetarianFood',
                         'places.servesWine', 'places.editorialSummary', 'places.primaryTypeDisplayName',], 
        'key': api_key
    }

    response = requests.post(url, params=params)
    data = response.json()
    print(data)

google_places_search()
