from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import atexit


db = SQLAlchemy()
def create_app():
    app = Flask(__name__)
    CORS(app=app)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    #app.config['SQLALCHEMY_ECHO'] = True

    db.init_app(app=app)

    from .routes import register_routes
    from .controllers.fatsecret import bp
    register_routes(app)
    app.register_blueprint(bp)
    
    def delete_daily_data():
        with app.app_context():
            from .models import Walking, Meal


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

    scheduler = BackgroundScheduler()
    trigger = CronTrigger(hour=0, minute=0)
    scheduler.add_job(func=delete_daily_data,trigger=trigger)
    scheduler.start()
    atexit.register(lambda: scheduler.shutdown(wait=False))

    return app