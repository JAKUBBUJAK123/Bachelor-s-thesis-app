def exxtract_nutrition(string):
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


description = "Per 100g - Calories: 717kcal | Fat: 81.11g | Carbs: 0.06g | Protein: 0.85g"
nutrition = exxtract_nutrition(description)

if nutrition:
    print(nutrition)
else:
    print("No nutritional information found.") 