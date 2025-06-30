from app import create_app
from app.models import db, User, Book, BorrowRecord, Review
import seed
import os

app = create_app()

with app.app_context():
    db.create_all()  # Create tables
    if User.query.count() == 0 and Book.query.count() == 0:
        seed.seed_data()  # Seed if empty
    print("Database initialized and seeded successfully!")