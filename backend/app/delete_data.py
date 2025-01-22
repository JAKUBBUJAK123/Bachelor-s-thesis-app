from .models import Walking, Meal

def delete_daily_data(app, db):
    with app.app_context():
        walking_data = Walking.query.all()
        for record in walking_data:
            record.steps = 0
            record.distance = 0
            record.burned_kcal = 0
        
        meal_data = Meal.query.all()
        for meal in meal_data:
            meal.Calories = 0
            meal.Carbs = 0
            meal.Fat = 0
            meal.Protein = 0
        
        db.session.commit()
        print("Daily data reset completed.")