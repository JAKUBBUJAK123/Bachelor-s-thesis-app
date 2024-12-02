from flask import Blueprint, jsonify, request
from ..services.fatsecret_service import search_food , extract_nutrition
from pyfatsecret import Fatsecret

bp = Blueprint('fatsecret' , __name__)

@bp.route('/api/search_food' , methods=['GET'])
def search_food_route():
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    try:
        response = search_food(query)

        if "foods" in response and "food" in response["foods"]:
            food_items = response["foods"]["food"]
            descriptions = [item["food_description"] for item in food_items]

            return jsonify({"descriptions": descriptions}), 200
        else:
            return jsonify({"error": "No foods found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
