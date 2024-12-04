import flask
from . import db
from flask import jsonify, request
from .models import User


def register_routes(app):
    @app.route('/')
    def home():
        return {'message' : "Hello from flask"}


    @app.route('/register', methods=['POST'])
    def register_user():
        data = request.get_json()
        
        # Check for existing email
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            print('error')
            return jsonify({"error": "Email already registered"}), 400
            


        new_user = User(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            password_hash=data['password']  # Use a hashing library like bcrypt here!
        )
        db.session.add(new_user)
        db.session.commit()
        print('success')
        return jsonify({"message": "User registered successfully!"}), 201