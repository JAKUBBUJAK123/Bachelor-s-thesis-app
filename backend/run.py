from app import create_app , db

APP= create_app()

if __name__ == "__main__" :

    with APP.app_context():
        #db.drop_all()
        db.create_all()
    APP.run(debug=True, host='0.0.0.0' , port=5000)
    

