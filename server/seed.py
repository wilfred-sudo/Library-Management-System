from app import create_app
from app.models import db, User, Book, BorrowRecord, Review
from datetime import datetime
import bcrypt

app = create_app()

def seed_data():
    db.drop_all()
    db.create_all()

    # Seed users
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
    db.session.commit()  # Commit so IDs are available

    # Seed books
    book1 = Book(title='Book One', author='Author A', isbn='1234567890123', available_copies=2)
    book2 = Book(title='Book Two', author='Author B', isbn='9876543210987', available_copies=1)
    db.session.add_all([book1, book2])
    db.session.commit()

    # Seed borrow records
    borrow1 = BorrowRecord(user_id=user1.id, book_id=book1.id, borrow_date=datetime.utcnow())
    db.session.add(borrow1)

    # Seed reviews
    review1 = Review(user_id=user1.id, book_id=book1.id, rating=4, comment='Great book!')
    db.session.add(review1)

    db.session.commit()
    print("Database seeded successfully.")

if __name__ == '__main__':
    with app.app_context():
        seed_data()
