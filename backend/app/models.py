from . import db
from werkzeug.security import generate_password_hash, check_password_hash
import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    nickname =db.Column(db.String(255) , nullable=True)
    age =db.Column(db.Integer() , nullable=True)
    weight =db.Column(db.Integer() , nullable=True)
    height =db.Column(db.Integer() , nullable=True)
    gender =db.Column(db.String(255) , nullable=True)
    profile_picture =db.Column(db.String(255) , nullable=True)

    meals = db.relationship('Meal', back_populates='user')
    walking = db.relationship('Walking' , back_populates='user')
    daily_summary = db.relationship('Daily_summary', back_populates='user')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password=password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password=password)
    

class Meal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100) , nullable=True)
    Calories = db.Column(db.Float() , nullable=False , default=0)
    Carbs = db.Column(db.Float() , nullable=False , default=0)
    Fat = db.Column(db.Float() , nullable=False, default=0)
    Protein = db.Column(db.Float() , nullable=False, default=0)

    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable=False) 
    user = db.relationship('User', back_populates="meals")

class Walking(db.Model):
    id = db.Column(db.Integer , primary_key=True)
    steps = db.Column(db.Integer, nullable=False, default=0)
    distance = db.Column(db.Integer, nullable=False, default=0)
    burned_kcal = db.Column(db.Integer, nullable=False , default=0)

    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable=False) 
    user = db.relationship('User', back_populates='walking')

class Daily_summary(db.Model):
    id = db.Column(db.Integer , primary_key=True)
    date = db.Column(db.Date, nullable=False, index=True, default=datetime.date.today())
    
    total_steps = db.Column(db.Integer, nullable=False, default=0)
    total_distance = db.Column(db.Float, nullable=False, default=0)
    total_burned_kcal = db.Column(db.Integer, nullable=False, default=0)
    total_calories_intake = db.Column(db.Float, nullable=False, default=0)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='daily_summary')

    