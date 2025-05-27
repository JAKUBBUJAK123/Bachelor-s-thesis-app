import requests
from flask import jsonify
from pyfatsecret import Fatsecret
from dotenv import load_dotenv
import os
load_dotenv()

API_KEY = os.getenv('FatSEcret_API_KEY')
KEY_SECRET = os.getenv('FatSEcret_KEY_SECRET')

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





