import flask
from . import db
from flask import jsonify, request
from .models import User , Meal
import datetime
import jwt
from functools import wraps


AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, AUTH_KEY, algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['user_id']).first()
            if not current_user:
                return jsonify({'message': 'User not found'}), 404
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated



def register_routes(app):
    @app.route('/')
    def home():
        return {'message' : "Hello from flask"}


    @app.route('/api/register', methods=['POST'])
    def register_user():
        data = request.get_json()
        
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"error": "Email already registered"}), 400
            

        new_user = User(
            first_name=data['firstName'],
            last_name=data['lastName'],
            email=data['email'],
        )
        new_user.set_password(data['password'])

        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    

    @app.route('/api/login' , methods=['POST'])
    def login_user():
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        if not user:
            return jsonify({'message' : "user not found"}), 404
        
        if not user.check_password(data['password']):
            return jsonify({'message': 'invalid password, please try again'}), 401
        
        token = jwt.encode(
            {
                'user_id' : user.id,
                'exp' : datetime.datetime.utcnow() + datetime.timedelta(hours=1)
            },
            AUTH_KEY,
            algorithm='HS256'
        )
        
        return jsonify({'message' : 'succesfully logged in' , 'token' : token}) , 200
    
    @app.route('/api/user', methods=["GET"])
    @token_required
    def get_user_data(current_user):
            return jsonify({
        'firstName': current_user.first_name,
        'lastName': current_user.last_name,
        'nickname': current_user.nickname,
        'age': current_user.age,
        'Gender': current_user.gender,
        'Weight': current_user.weight,
        'Height': current_user.height,
        'ProfilePicture': current_user.profile_picture
    })

    @app.route('/api/user', methods=['PUT'])
    @token_required
    def update_user_data(current_user):
        data = request.get_json()
        current_user.first_name = data.get('firstName', current_user.first_name)
        current_user.last_name = data.get('lastName', current_user.last_name)
        current_user.nickname = data.get('nickname', current_user.nickname)
        current_user.age = data.get('age', current_user.age)
        current_user.gender = data.get('Gender', current_user.gender)
        current_user.weight = data.get('Weight', current_user.weight)
        current_user.height = data.get('Height', current_user.height)
        current_user.profile_picture = data.get('ProfilePicture', current_user.profile_picture)
    
        db.session.commit()
        return jsonify({'message': 'Profile updated successfully'})


    @app.route('/api/meals', methods=['GET'])
    @token_required
    def get_meals(current_user):
        meals = Meal.query.filter_by(user_id=current_user.id).all()
        print(meals)
        return jsonify([{
            'id' : meal.id,
            'name' : meal.name,
            'calories' : meal.calories,
            'carbs' : meal.carbs,
            'protein' : meal.protein,
            'fat' : meal.fat
        }for meal in meals]
        )
    
    @app.route('/api/meals' , methods=['POST'])
    @token_required
    def add_meals(current_user):
        data = request.get_json()
        for i in data:
            print(i)
            meal = Meal(
            name =i['name'],
            calories=i['macros']['Calories'],
            carbs =i['macros']['Carbs'],
            protein = i['macros']['Protein'],
            fat = i['macros']['Fat'],
            user_id = current_user.id
        )
            db.session.add(meal)
            db.session.commit()
        return jsonify({'message': "Meal added successfully"}), 201

    

    @app.route('/api/meals/<int:meal_id>' , methods=['PUT'])
    @token_required
    def update_meal(meal_id, current_user):
        data = request.get_json()
        meal = Meal.query.filter_by(id=meal_id, user_id=current_user.id).first()

        meal.calories = data.get('Calories' , meal.calories)
        meal.carbs = data.get('Carbs' , meal.carbs)
        meal.protein = data.get('Protein' , meal.protein)
        meal.fat = data.get('Fat' , meal.fat)
        db.session.commit()
        return jsonify({"message" : 'succesffully updated meals'})
