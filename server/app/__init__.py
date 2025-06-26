from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .database import db
from .routes import init_routes

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
    app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Replace with env variable in production
    CORS(app)
    JWTManager(app)
    db.init_app(app)
    init_routes(app)
    return app