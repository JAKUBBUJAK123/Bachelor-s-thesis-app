import flask
from . import db
from flask import jsonify, request
from .models import Daily_summary, User , Meal , Walking
from datetime import datetime, timedelta
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

        default_meals = [
        Meal(name="Breakfast", user_id=new_user.id),
        Meal(name="Lunch", user_id=new_user.id),
        Meal(name="Dinner", user_id=new_user.id),
        Meal(name="Supper", user_id=new_user.id),
        ]
        db.session.add_all(default_meals)
        db.session.commit()

        new_walking_table = Walking(steps=0, distance=0 , burned_kcal=0, user_id=new_user.id)
        db.session.add(new_walking_table)
        db.session.commit()

        new_daily_summary = Daily_summary(user_id=new_user.id , date=datetime.today() , total_steps=0 , total_distance=0 , total_burned_kcal=0)
        db.session.add(new_daily_summary)
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
                'exp' : datetime.utcnow() + timedelta(hours=1)
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
              
        return jsonify([{
        'id' : i.id,
        'name' : i.name,
        'macros' :{
            'Calories' : i.Calories,
            'Carbs' : i.Carbs,
            'Protein' : i.Protein,
            'Fat' : i.Fat
            }
        }for i in meals] ) ,201
        
    
    @app.route('/api/meals' , methods=['POST'])
    @token_required
    def add_meals(current_user):
        data = request.get_json()
        for i in data:
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

    

    @app.route('/api/meals' , methods=['PUT'])
    @token_required
    def update_meal(current_user):
        data = request.get_json()
        meal_id = data.get('id')
        if not meal_id:
            return jsonify({"error": "Meal ID is required"}), 400

        meal = Meal.query.filter_by(id=meal_id, user_id=current_user.id).first()

        if not meal:
            return jsonify({"error": "Meal not found or unauthorized"}), 404

        meal.Calories = data.get('Calories' , meal.Calories)
        meal.Carbs = data.get('Carbs' , meal.Carbs)
        meal.Protein = data.get('Protein' , meal.Protein)
        meal.Fat = data.get('Fat' , meal.Fat)
        db.session.commit()
        return jsonify({"message" : 'succesffully updated meals'}), 200
    

    @app.route('/api/walking' , methods=['GET'])
    @token_required
    def get_walking_data(current_user):
        walking = Walking.query.filter_by(user_id = current_user.id).first()
        return jsonify({'steps' : walking.steps , 'distance' : walking.distance , 'burned_kcal' : walking.burned_kcal})
    
    
    @app.route('/api/walking' , methods=['PUT'])
    @token_required
    def update_walking_data(current_user):
        data = request.get_json()
        walking = Walking.query.filter_by(user_id = current_user.id).first()
        walking.steps = data.get('steps' , walking.steps)
        walking.distance = data.get('distance' , walking.distance)
        walking.burned_kcal = data.get('burned_kcal' , walking.burned_kcal)
        db.session.commit()
        return jsonify({'message' : "succesfully saved data" , 'data' : data}) ,200
    

    @app.route('/api/weakly_summary' , methods=['GET'])
    @token_required 
    def get_weekly_progress(current_user):
        today = datetime.today()
        week_age = today - timedelta(days=7)
        weekly_data = Daily_summary.query.filter(Daily_summary.user_id == current_user.id, Daily_summary.date >= week_age).order_by(Daily_summary.date).all()

        data = [{
        'date': i.date.isoformat(),  
        'steps': i.total_steps,
        'distance': i.total_distance,
        'burned_kcal': i.total_burned_kcal,
        'calories_intake': i.total_calories_intake
        } for i in weekly_data]
        
        return jsonify(data), 200
    