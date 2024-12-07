import flask
from . import db
from flask import jsonify, request
from .models import User


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
            password_hash=data['password']  # Use a hashing library like bcrypt here!
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    

    @app.route('/api/login' , methods=['POST'])
    def login_user():
        data = request.get_json()
        print(data)
        user = User.query.filter_by(email=data['email']).first()
        print(user)
        if not user:
            return jsonify({'message' : "user not found"})
        
        if not user.password_hash == data['password'] :
            return jsonify({'message': 'invalid password, please try again'})
        
        return jsonify({'message' : 'succesfully logged in'})
    
