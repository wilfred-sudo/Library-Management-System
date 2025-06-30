from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from .models import db
from .routes import bp

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'your-secret-key'  
    CORS(app)
    JWTManager(app)
    db.init_app(app)
    Migrate(app, db)  # Initialize Flask-Migrate
    app.register_blueprint(bp)  # Register the Blueprint from routes.py
    return app