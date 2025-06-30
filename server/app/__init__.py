from flask import Flask, send_from_directory
from .routes import bp
from flask_cors import CORS 

def create_app():
    app = Flask(__name__, static_folder='../build', static_url_path='')
    CORS(app)  # Enable CORS for frontend-backend communication

    app.register_blueprint(bp)

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')

    return app

import os