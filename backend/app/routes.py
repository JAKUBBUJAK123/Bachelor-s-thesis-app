import flask
from . import db
from flask import jsonify, request
from .models import User
import datetime
import jwt


AUTH_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

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
