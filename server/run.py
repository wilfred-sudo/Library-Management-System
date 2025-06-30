from app import create_app
from app.models import db
import seed
import os

app = create_app()

with app.app_context():
    db.create_all()  # Create tables if they don't exist
    seed.seed_data()  # Seed the database

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))