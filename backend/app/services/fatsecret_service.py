import requests
from flask import jsonify
from pyfatsecret import Fatsecret

API_KEY = '3c84ba2d72774ebe96d2bce5adda4314'
KEY_SECRET = 'f429bc02cb724d419db4a0957455475a'

fs = Fatsecret(API_KEY,KEY_SECRET)

def search_food(query):

    try:
        food_results = fs.foods.foods_search(query)
        return food_results
    except requests.exceptions.RequestException as e:
        return {"error": "Failed to fetch food data from Spoonacular"}
    

def extract_nutrition(string):
    
    try:
        parts = string.split('|')
        print(parts)
        calories = parts[0].split(":")[1].strip().replace("kcal", "").strip()
        fat = parts[1].split(":")[1].strip().replace("g", "").strip()
        carbs = parts[2].split(":")[1].strip().replace("g", "").strip()
        protein = parts[3].split(":")[1].strip().replace("g", "").strip()

        return {
            'calories': calories,
            'fat': fat,
            'carbs': carbs,
            'protein': protein
        }
    except (IndexError, ValueError) as e :
        print(f'error parsing data {e}')
        return None





