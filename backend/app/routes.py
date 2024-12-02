import flask

def register_routes(app):
    @app.route('/')
    def home():
        return {'message' : "Hello from flask"}

