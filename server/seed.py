from app.models import db, User, Book, BorrowRecord, Review
import bcrypt
from datetime import datetime, timedelta
import random

def seed_data():
    """Seed the database with initial data for testing and development."""
    
    print("Starting database seeding...")
    
    # Clear existing data in correct order (respecting foreign key constraints)
    db.session.query(Review).delete()
    db.session.query(BorrowRecord).delete()
    db.session.query(Book).delete()
    db.session.query(User).delete()
    db.session.commit()
    print("Cleared existing data.")

    # Seed users
    users_data = [
        {
            'username': 'john_doe',
            'email': 'john@example.com',
            'password': 'password123',
            'role': 'user'
        },
        {
            'username': 'jane_smith',
            'email': 'jane@example.com',
            'password': 'password123',
            'role': 'user'
        },
        {
            'username': 'admin',
            'email': 'admin@example.com',
            'password': 'adminpass',
            'role': 'admin'
        },
        {
            'username': 'librarian',
            'email': 'librarian@example.com',
            'password': 'librarianpass',
            'role': 'admin'
        }
    ]
    
    users = []
    for user_data in users_data:
        password_hash = bcrypt.hashpw(
            user_data['password'].encode('utf-8'), 
            bcrypt.gensalt()
        ).decode('utf-8')
        
        user = User(
            username=user_data['username'],
            email=user_data['email'],
            password_hash=password_hash,
            role=user_data['role']
        )
        users.append(user)
    
    db.session.add_all(users)
    db.session.commit()
    print(f"Added {len(users)} users.")

    # Seed books with more realistic data
    books_data = [
        {
            'title': '48 Laws of Power',
            'author': 'Robert Greene',
            'isbn': '9780670881468',
            'available_copies': 5,
            'total_copies': 5,
            'description': 'A bestselling book about power dynamics and strategic thinking.',
            'publication_year': 1998,
            'genre': 'Self-Help',
            'image_url': 'https://via.placeholder.com/150x200?text=48+Laws+of+Power'
        },
        {
            'title': 'Zen: The Art of Simple Living',
            'author': 'Shunmyo Masuno',
            'isbn': '9780241371831',
            'available_copies': 3,
            'total_copies': 4,
            'description': 'A guide to finding peace and clarity through simplicity.',
            'publication_year': 2019,
            'genre': 'Philosophy',
            'image_url': 'https://via.placeholder.com/150x200?text=Zen+Simple+Living'
        },
        {
            'title': 'The Great Gatsby',
            'author': 'F. Scott Fitzgerald',
            'isbn': '9780743273565',
            'available_copies': 4,
            'total_copies': 6,
            'description': 'A classic American novel set in the Jazz Age.',
            'publication_year': 1925,
            'genre': 'Fiction',
            'image_url': 'https://via.placeholder.com/150x200?text=Great+Gatsby'
        },
        {
            'title': 'To Kill a Mockingbird',
            'author': 'Harper Lee',
            'isbn': '9780061120084',
            'available_copies': 3,
            'total_copies': 5,
            'description': 'A gripping tale of racial injustice and childhood innocence.',
            'publication_year': 1960,
            'genre': 'Fiction',
            'image_url': 'https://via.placeholder.com/150x200?text=To+Kill+Mockingbird'
        },
        {
            'title': '1984',
            'author': 'George Orwell',
            'isbn': '9780451524935',
            'available_copies': 2,
            'total_copies': 4,
            'description': 'A dystopian social science fiction novel.',
            'publication_year': 1949,
            'genre': 'Science Fiction',
            'image_url': 'https://via.placeholder.com/150x200?text=1984'
        }
    ]
    
    # Add the predefined books
    books = []
    for book_data in books_data:
        book = Book(**book_data)
        books.append(book)
    
    # Generate additional books for testing pagination and search
    genres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Romance', 'Mystery', 'Biography', 'History', 'Self-Help']
    sample_authors = [
        'Stephen King', 'J.K. Rowling', 'Agatha Christie', 'Isaac Asimov',
        'Maya Angelou', 'Ernest Hemingway', 'Virginia Woolf', 'Mark Twain',
        'Charles Dickens', 'Jane Austen', 'Toni Morrison', 'Gabriel García Márquez'
    ]
    
    for i in range(6, 53):  # Generate books 6-52 (47 additional books)
        author = random.choice(sample_authors)
        genre = random.choice(genres)
        year = random.randint(1950, 2023)
        copies = random.randint(1, 8)
        available = random.randint(0, copies)
        
        book = Book(
            title=f'Sample Book {i}: The Art of {genre}',
            author=author,
            isbn=f'ISBN{i:013d}',
            available_copies=available,
            total_copies=copies,
            description=f'An engaging {genre.lower()} book by {author}. This is sample content for testing purposes.',
            publication_year=year,
            genre=genre,
            image_url=f'https://via.placeholder.com/150x200?text=Book+{i}'
        )
        books.append(book)
    
    db.session.add_all(books)
    db.session.commit()
    print(f"Added {len(books)} books.")

    # Seed borrow records
    borrow_records = []
    
    # Create some realistic borrow scenarios
    user1, user2 = users[0], users[1]  # john_doe and jane_smith
    
    # User1 borrows first book (currently borrowed)
    borrow1 = BorrowRecord(
        user_id=user1.id,
        book_id=books[0].id,  # 48 Laws of Power
        borrow_date=datetime.utcnow() - timedelta(days=10),
        due_date=datetime.utcnow() + timedelta(days=4),
        status='borrowed'
    )
    
    # User2 borrowed and returned a book
    borrow2 = BorrowRecord(
        user_id=user2.id,
        book_id=books[1].id,  # Zen book
        borrow_date=datetime.utcnow() - timedelta(days=20),
        due_date=datetime.utcnow() - timedelta(days=6),
        return_date=datetime.utcnow() - timedelta(days=8),
        status='returned'
    )
    
    # User1 has an overdue book
    borrow3 = BorrowRecord(
        user_id=user1.id,
        book_id=books[2].id,  # Great Gatsby
        borrow_date=datetime.utcnow() - timedelta(days=25),
        due_date=datetime.utcnow() - timedelta(days=11),
        status='overdue',
        fine_amount=5.50
    )
    
    # Add some random borrow records
    for i in range(5):
        user = random.choice(users[:2])  # Only regular users
        book = random.choice(books[3:10])  # Random selection of books
        borrow_date = datetime.utcnow() - timedelta(days=random.randint(1, 30))
        
        # Some returned, some still borrowed
        if random.choice([True, False]):
            return_date = borrow_date + timedelta(days=random.randint(1, 14))
            status = 'returned'
        else:
            return_date = None
            status = 'borrowed'
        
        borrow_record = BorrowRecord(
            user_id=user.id,
            book_id=book.id,
            borrow_date=borrow_date,
            due_date=borrow_date + timedelta(days=14),
            return_date=return_date,
            status=status
        )
        borrow_records.append(borrow_record)
    
    borrow_records.extend([borrow1, borrow2, borrow3])
    db.session.add_all(borrow_records)
    db.session.commit()
    print(f"Added {len(borrow_records)} borrow records.")

    # Seed reviews
    reviews_data = [
        {
            'user_id': user1.id,
            'book_id': books[0].id,  # 48 Laws of Power
            'rating': 4,
            'comment': 'Great book! Very insightful and well-written. Highly recommend for anyone interested in understanding power dynamics.'
        },
        {
            'user_id': user2.id,
            'book_id': books[1].id,  # Zen book
            'rating': 5,
            'comment': 'Absolutely love this book. It has helped me find more peace in my daily life. The writing is beautiful and accessible.'
        },
        {
            'user_id': user1.id,
            'book_id': books[2].id,  # Great Gatsby
            'rating': 3,
            'comment': 'Classic literature, but not entirely my cup of tea. Well written but the story felt a bit slow for my taste.'
        },
        {
            'user_id': user2.id,
            'book_id': books[3].id,  # To Kill a Mockingbird
            'rating': 5,
            'comment': "One of the most important books I've ever read. Harper Lee's storytelling is masterful."
        }
    ]
    
    # Add some random reviews
    for i in range(10):
        user = random.choice(users[:2])
        book = random.choice(books[:10])
        
        # Check if this user already reviewed this book
        existing_review = Review.query.filter_by(user_id=user.id, book_id=book.id).first()
        if existing_review:
            continue
            
        rating = random.randint(3, 5)
        comments = [
            "Really enjoyed this book!",
            "Not bad, but could be better.",
            "Excellent read, highly recommend!",
            "Good book, learned a lot.",
            "Amazing story and characters.",
            "Well written and engaging.",
            "Could not put it down!",
            "Thought-provoking and insightful."
        ]
        
        reviews_data.append({
            'user_id': user.id,
            'book_id': book.id,
            'rating': rating,
            'comment': random.choice(comments)
        })
    
    reviews = []
    for review_data in reviews_data:
        review = Review(**review_data)
        reviews.append(review)
    
    db.session.add_all(reviews)
    db.session.commit()
    print(f"Added {len(reviews)} reviews.")

    print("Database seeding completed successfully!")
    print("\nTest accounts created:")
    print("1. Username: john_doe, Password: password123 (User)")
    print("2. Username: jane_smith, Password: password123 (User)")
    print("3. Username: admin, Password: adminpass (Admin)")
    print("4. Username: librarian, Password: librarianpass (Admin)")

if __name__ == '__main__':
    seed_data()