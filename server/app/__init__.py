from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False 
    app.config['JWT_SECRET_KEY'] = 'yusufmim123'  
    app.config['JWT_TOKEN_LOCATION'] = ['headers']  

    CORS(app, resources={r"/api/*": {"origins": "https://library-management-system-frontend-n7sn.onrender.com"}})

    db.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        db.create_all()

    from .routes import bp
    app.register_blueprint(bp)

    return app