from app.models import db, User, Book, BorrowRecord, Review
import bcrypt
from datetime import datetime

def seed_data():
    # Clear existing data
    db.session.query(Review).delete()
    db.session.query(BorrowRecord).delete()
    db.session.query(Book).delete()
    db.session.query(User).delete()
    db.session.commit()

    # Seed users
    user1 = User(username='john_doe', email='john@example.com', password_hash=bcrypt.hashpw('password123'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), role='user')
    admin = User(username='admin', email='admin@example.com', password_hash=bcrypt.hashpw('adminpass'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), role='admin')
    db.session.add_all([user1, admin])
    db.session.commit()

    # Seed books
    books = [
        Book(title='48 Laws of Power', author='Robert Greene', isbn='9780670881468', available_copies=5, image_url='https://via.placeholder.com/150'),
        Book(title='Zen: The Art of Simple Living', author='Shunmyo Masuno', isbn='9780241371831', available_copies=3, image_url='https://via.placeholder.com/150'),
    ]
    for i in range(3, 53):
        books.append(Book(title=f'Book {i}', author=f'Author {i}', isbn=f'ISBN{i:013d}', available_copies=5, image_url='https://via.placeholder.com/150'))
    db.session.add_all(books)
    db.session.commit()

    # Seed borrow records and reviews
    borrow1 = BorrowRecord(user_id=user1.id, book_id=books[0].id, borrow_date=datetime.utcnow())
    review1 = Review(user_id=user1.id, book_id=books[0].id, rating=4, comment='Great book!')
    db.session.add_all([borrow1, review1])
    db.session.commit()

    print("Database seeded successfully!")

if __name__ == '__main__':
    seed_data()