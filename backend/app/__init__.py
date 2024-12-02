from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app=app)
    from .routes import register_routes
    from .controllers.fatsecret import bp 

    register_routes(app)
    app.register_blueprint(bp)
    print("It works!!!")

    return app