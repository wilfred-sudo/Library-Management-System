from flask import Flask, send_from_directory 
from flask_cors import CORS
import os 

def create_app():
    app = Flask(__name__, static_folder='../build', static_url_path='')
    CORS(app, resources={r"/api/*": {"origins": "https://library-management-system-frontend-n7sn.onrender.com"}})

    # Configure and initialize SQLAlchemy within the app context
    from flask_sqlalchemy import SQLAlchemy
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///library.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db = SQLAlchemy(app)  # Initialize SQLAlchemy with the app directly

    # Register blueprints
    from .routes import bp
    app.register_blueprint(bp)

    # Serve React build files
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')

    return app