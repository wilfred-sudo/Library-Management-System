from app import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    borrow_records = db.relationship('BorrowRecord', backref='user', lazy=True, cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active
        }

class Book(db.Model):
    __tablename__ = 'books'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    isbn = db.Column(db.String(13), unique=True, nullable=False)
    available_copies = db.Column(db.Integer, default=1)
    total_copies = db.Column(db.Integer, default=1)
    image_url = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)
    publication_year = db.Column(db.Integer, nullable=True)
    genre = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    borrow_records = db.relationship('BorrowRecord', backref='book', lazy=True, cascade='all, delete-orphan')
    reviews = db.relationship('Review', backref='book', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<Book {self.title}>'
    
    @property
    def average_rating(self):
        if not self.reviews:
            return 0
        return sum(review.rating for review in self.reviews) / len(self.reviews)
    
    @property
    def is_available(self):
        return self.available_copies > 0
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'isbn': self.isbn,
            'available_copies': self.available_copies,
            'total_copies': self.total_copies,
            'image_url': self.image_url,
            'description': self.description,
            'publication_year': self.publication_year,
            'genre': self.genre,
            'average_rating': self.average_rating,
            'is_available': self.is_available,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class BorrowRecord(db.Model):
    __tablename__ = 'borrow_records'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    borrow_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    due_date = db.Column(db.DateTime, nullable=True)
    return_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default='borrowed')  # borrowed, returned, overdue
    fine_amount = db.Column(db.Float, default=0.0)
    
    def __repr__(self):
        return f'<BorrowRecord User:{self.user_id} Book:{self.book_id}>'
    
    @property
    def is_overdue(self):
        if self.return_date or not self.due_date:
            return False
        return datetime.utcnow() > self.due_date
    
    @property
    def days_borrowed(self):
        end_date = self.return_date or datetime.utcnow()
        return (end_date - self.borrow_date).days
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'borrow_date': self.borrow_date.isoformat() if self.borrow_date else None,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'return_date': self.return_date.isoformat() if self.return_date else None,
            'status': self.status,
            'fine_amount': self.fine_amount,
            'is_overdue': self.is_overdue,
            'days_borrowed': self.days_borrowed
        }

class Review(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Constraints
    __table_args__ = (
        db.CheckConstraint('rating >= 1 AND rating <= 5', name='rating_range'),
        db.UniqueConstraint('user_id', 'book_id', name='unique_user_book_review'),
    )
    
    def __repr__(self):
        return f'<Review User:{self.user_id} Book:{self.book_id} Rating:{self.rating}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }