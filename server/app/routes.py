from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db  
from app.models import User, Book, BorrowRecord, Review
import bcrypt
from datetime import datetime, timedelta
import logging

bp = Blueprint('api', __name__)
logging.basicConfig(level=logging.DEBUG) 

@bp.route('/api/books', methods=['GET'])
def get_books():
    try:
        logging.debug("Entering get_books endpoint")
        books = Book.query.all()
        logging.debug(f"Queried {len(books)} books from database")
        if not books:
            logging.debug("No books found in database")
            return jsonify({'message': 'No books found'}), 200
        
        serialized_books = []
        for book in books:
            book_data = {
                'id': book.id,
                'title': book.title,
                'author': book.author,
                'isbn': book.isbn,
                'available_copies': book.available_copies,
                'image_url': book.image_url if book.image_url else None,
                'genre': getattr(book, 'genre', None),
                'publication_year': getattr(book, 'publication_year', None),
                'description': getattr(book, 'description', None),
                'borrow_records': [{
                    'id': br.id,
                    'user_id': br.user_id,
                    'book_id': br.book_id,
                    'borrow_date': br.borrow_date.isoformat() if br.borrow_date else None,
                    'return_date': br.return_date.isoformat() if br.return_date else None
                } for br in book.borrow_records] if book.borrow_records else [],
                'reviews': [{
                    'id': r.id,
                    'user_id': r.user_id,
                    'book_id': r.book_id,
                    'rating': r.rating,
                    'comment': r.comment,
                    'user': r.user.username if r.user else 'Unknown',
                    'created_at': getattr(r, 'created_at', datetime.utcnow()).isoformat()
                } for r in book.reviews] if book.reviews else []
            }
            serialized_books.append(book_data)
        
        logging.debug(f"Serialized books: {serialized_books[:1]}")
        return jsonify(serialized_books)
    except Exception as e:
        logging.error(f"Error in get_books: {str(e)}")
        return jsonify({'message': 'Failed to load books', 'error': str(e)}), 500


@bp.route('/api/books/<int:id>', methods=['GET'])
@jwt_required(optional=True)
def get_book(id):
    try:
        book = Book.query.get_or_404(id)
        book_data = {
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'isbn': book.isbn,
            'available_copies': book.available_copies,
            'image_url': book.image_url if book.image_url else None,
            'genre': getattr(book, 'genre', None),
            'publication_year': getattr(book, 'publication_year', None),
            'description': getattr(book, 'description', None),
            'reviews': [{
                'id': r.id,
                'user': r.user.username if r.user else 'Unknown',
                'rating': r.rating,
                'comment': r.comment,
                'created_at': getattr(r, 'created_at', datetime.utcnow()).isoformat()
            } for r in book.reviews] if book.reviews else []
        }
        return jsonify(book_data)
    except Exception as e:
        logging.error(f"Error in get_book: {str(e)}")
        return jsonify({'message': 'Failed to load book', 'error': str(e)}), 500

@bp.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=data.get('email').lower().strip()).first()
        if not user:
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Check password - handle both string and bytes password hash
        password_to_check = data.get('password', '').encode('utf-8')
        stored_password = user.password_hash
        if isinstance(stored_password, str):
            stored_password = stored_password.encode('utf-8')
        
        if bcrypt.checkpw(password_to_check, stored_password):
            # Create token that expires in 24 hours
            access_token = create_access_token(
                identity={'id': user.id, 'email': user.email},
                expires_delta=timedelta(hours=24)
            )
            return jsonify({
                'token': access_token, 
                'user': {
                    'id': user.id, 
                    'email': user.email,
                    'username': user.username,
                    'role': user.role
                }
            }), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401
    except Exception as e:
        logging.error(f"Error in login: {str(e)}")
        return jsonify({'message': 'Login failed', 'error': str(e)}), 500

@bp.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        if not data or 'email' not in data or 'password' not in data:
            return jsonify({'message': 'Email and password are required'}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        username = data.get('username', email.split('@')[0])  # Use email prefix if no username provided
        
        # Validate input
        if len(password) < 6:
            return jsonify({'message': 'Password must be at least 6 characters long'}), 400
        
        if User.query.filter_by(email=email).first():
            return jsonify({'message': 'User with this email already exists'}), 400
        
        if User.query.filter_by(username=username).first():
            return jsonify({'message': 'Username already taken'}), 400

        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user
        user = User(
            email=email, 
            username=username,
            password_hash=hashed_password,
            role='user'
        )
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        logging.error(f"Error in signup: {str(e)}")
        db.session.rollback()
        return jsonify({'message': 'Signup failed', 'error': str(e)}), 500

@bp.route('/api/borrow', methods=['POST'])
@jwt_required()
def borrow_book():
    try:
        data = request.get_json()
        if not data or 'book_id' not in data:
            return jsonify({'message': 'Book ID is required'}), 400
        
        book_id = data.get('book_id')
        user_identity = get_jwt_identity()
        user_id = user_identity['id']

        # Check if book exists
        book = Book.query.get(book_id)
        if not book:
            return jsonify({'message': 'Book not found'}), 404
        
        # Check if copies are available
        if book.available_copies <= 0:
            return jsonify({'message': 'No copies available'}), 400
        
        # Check if user already has an active borrow record for this book
        existing_borrow = BorrowRecord.query.filter_by(
            user_id=user_id, 
            book_id=book_id, 
            return_date=None
        ).first()
        
        if existing_borrow:
            return jsonify({'message': 'You have already borrowed this book'}), 400

        # Create borrow record
        borrow_record = BorrowRecord(
            user_id=user_id, 
            book_id=book_id, 
            borrow_date=datetime.utcnow()
        )
        
        # Update available copies
        book.available_copies -= 1
        
        db.session.add(borrow_record)
        db.session.commit()
        
        return jsonify({
            'message': 'Book borrowed successfully', 
            'borrow_record': {
                'id': borrow_record.id,
                'user_id': borrow_record.user_id,
                'book_id': borrow_record.book_id,
                'borrow_date': borrow_record.borrow_date.isoformat(),
                'return_date': None
            }
        }), 201
    except Exception as e:
        logging.error(f"Error in borrow_book: {str(e)}")
        db.session.rollback()
        return jsonify({'message': 'Failed to borrow book', 'error': str(e)}), 500

@bp.route('/api/borrow/<int:id>', methods=['PUT'])
@jwt_required()
def return_book(id):
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity['id']
        
        borrow_record = BorrowRecord.query.get(id)
        if not borrow_record:
            return jsonify({'message': 'Borrow record not found'}), 404
        
        # Check if the user owns this borrow record
        if borrow_record.user_id != user_id:
            return jsonify({'message': 'Unauthorized'}), 403
        
        if borrow_record.return_date:
            return jsonify({'message': 'Book already returned'}), 400
        
        # Return the book
        borrow_record.return_date = datetime.utcnow()
        borrow_record.book.available_copies += 1
        
        db.session.commit()
        
        return jsonify({
            'message': 'Book returned successfully', 
            'borrow_record': {
                'id': borrow_record.id,
                'user_id': borrow_record.user_id,
                'book_id': borrow_record.book_id,
                'borrow_date': borrow_record.borrow_date.isoformat() if borrow_record.borrow_date else None,
                'return_date': borrow_record.return_date.isoformat() if borrow_record.return_date else None
            }
        }), 200
    except Exception as e:
        logging.error(f"Error in return_book: {str(e)}")
        db.session.rollback()
        return jsonify({'message': 'Failed to return book', 'error': str(e)}), 500

@bp.route('/api/reviews', methods=['POST'])
@jwt_required()
def add_review(): 
    try:
        data = request.get_json()
        if not data or 'book_id' not in data or 'rating' not in data:
            return jsonify({'message': 'Book ID and rating are required'}), 400
        
        user_identity = get_jwt_identity()
        user_id = user_identity['id']
        book_id = data.get('book_id')
        rating = data.get('rating')
        comment = data.get('comment', '')
        
        # Validate rating
        if not isinstance(rating, int) or rating < 1 or rating > 5:
            return jsonify({'message': 'Rating must be an integer between 1 and 5'}), 400
        
        # Check if book exists
        book = Book.query.get(book_id)
        if not book:
            return jsonify({'message': 'Book not found'}), 404
        
        # Check if user already reviewed this book
        existing_review = Review.query.filter_by(user_id=user_id, book_id=book_id).first()
        if existing_review:
            return jsonify({'message': 'You have already reviewed this book'}), 400
        
        # Create review
        review = Review(
            user_id=user_id, 
            book_id=book_id, 
            rating=rating, 
            comment=comment
        )
        
        db.session.add(review)
        db.session.commit()
        
        return jsonify({
            'message': 'Review added successfully', 
            'review': {
                'id': review.id,
                'user_id': review.user_id,
                'book_id': review.book_id,
                'rating': review.rating,
                'comment': review.comment,
                'user': review.user.username if review.user else 'Unknown',
                'created_at': getattr(review, 'created_at', datetime.utcnow()).isoformat()
            }
        }), 201
    except Exception as e:
        logging.error(f"Error in add_review: {str(e)}")
        db.session.rollback()
        return jsonify({'message': 'Failed to add review', 'error': str(e)}), 500

@bp.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        identity = get_jwt_identity()
        logging.debug(f"JWT Identity: {identity}")
        user_id = identity.get('id')
        if not user_id:
            return jsonify({'message': 'Invalid token: missing user ID'}), 422
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Get user's borrow records with book details
        borrow_records = []
        for br in user.borrow_records:
            borrow_data = {
                'id': br.id,
                'user_id': br.user_id,
                'book_id': br.book_id,
                'book_title': br.book.title if br.book else 'Unknown',
                'book_author': br.book.author if br.book else 'Unknown',
                'borrow_date': br.borrow_date.isoformat() if br.borrow_date else None,
                'return_date': br.return_date.isoformat() if br.return_date else None,
                'is_active': br.return_date is None
            }
            borrow_records.append(borrow_data)
        
        # Get user's reviews with book details
        reviews = []
        for r in user.reviews:
            review_data = {
                'id': r.id,
                'user_id': r.user_id,
                'book_id': r.book_id,
                'book_title': r.book.title if r.book else 'Unknown',
                'rating': r.rating,
                'comment': r.comment,
                'created_at': getattr(r, 'created_at', datetime.utcnow()).isoformat()
            }
            reviews.append(review_data)
        
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'borrow_records': borrow_records,
            'reviews': reviews
        })
    except Exception as e:
        logging.error(f"Error in get_profile: {str(e)}")
        return jsonify({'message': 'Error fetching profile', 'error': str(e)}), 500

@bp.route('/api/user/borrowed-books', methods=['GET'])
@jwt_required()
def get_user_borrowed_books():
    try:
        user_identity = get_jwt_identity()
        user_id = user_identity['id']
        
        # Get active borrow records (not returned yet)
        active_borrows = BorrowRecord.query.filter_by(user_id=user_id, return_date=None).all()
        
        borrowed_books = []
        for borrow in active_borrows:
            if borrow.book:
                book_data = {
                    'borrow_id': borrow.id,
                    'book_id': borrow.book.id,
                    'title': borrow.book.title,
                    'author': borrow.book.author,
                    'borrow_date': borrow.borrow_date.isoformat() if borrow.borrow_date else None,
                    'image_url': borrow.book.image_url
                }
                borrowed_books.append(book_data)
        
        return jsonify({'borrowed_books': borrowed_books}), 200
    except Exception as e:
        logging.error(f"Error in get_user_borrowed_books: {str(e)}")
        return jsonify({'message': 'Error fetching borrowed books', 'error': str(e)}), 500