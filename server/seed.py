import os
from app import create_app
from app.models import db, User, Book, BorrowRecord, Review
from datetime import datetime
import bcrypt

# Create the app instance
app = create_app()

def seed_data():
    with app.app_context():  # Ensure all database operations are within the app context
        print("Dropping all tables...")
        db.drop_all()  # Drop existing tables
        print("Creating all tables...")
        db.create_all()  # Create new tables

        # Seed users
        print("Seeding users...")
        user1 = User(
            username='john_doe',
            email='john@example.com',
            password_hash=bcrypt.hashpw('password123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            role='user'
        )
        user2 = User(
            username='admin',
            email='admin@example.com',
            password_hash=bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            role='admin'
        )
        db.session.add_all([user1, user2])

        # Seed books
        print("Seeding books...")
        book1 = Book(title='Book One', author='Author A', isbn='1234567890123', available_copies=2)
        book2 = Book(title='Book Two', author='Author B', isbn='9876543210987', available_copies=1)
        db.session.add_all([book1, book2])

        # Seed borrow records
        print("Seeding borrow records...")
        borrow1 = BorrowRecord(user_id=1, book_id=1, borrow_date=datetime.utcnow())
        db.session.add(borrow1)

        # Seed reviews
        print("Seeding reviews...")
        review1 = Review(user_id=1, book_id=1, rating=4, comment='Great book!')
        db.session.add(review1)

        print("Committing changes...")
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_data()