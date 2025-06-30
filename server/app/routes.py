from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db  # Import db from app
from app.models import User, Book, BorrowRecord, Review
import bcrypt
from datetime import datetime
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
        serialized_books = [
            {
                'id': book.id,
                'title': book.title,
                'author': book.author,
                'isbn': book.isbn,
                'available_copies': book.available_copies,
                'image_url': book.image_url if book.image_url else None,
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
                    'comment': r.comment
                } for r in book.reviews] if book.reviews else []
            } for book in books
        ]
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
        return jsonify({
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'isbn': book.isbn,
            'available_copies': book.available_copies,
            'image_url': book.image_url if book.image_url else None,
            'reviews': [{
                'id': r.id,
                'user': r.user.username if r.user else 'Unknown',
                'rating': r.rating,
                'comment': r.comment
            } for r in book.reviews] if book.reviews else []
        })
    except Exception as e:
        logging.error(f"Error in get_book: {str(e)}")
        return jsonify({'message': 'Failed to load book', 'error': str(e)}), 500

@bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    if user and bcrypt.checkpw(data.get('password').encode('utf-8'), user.password_hash.encode('utf-8')):
        access_token = create_access_token(identity={'id': user.id, 'role': user.role})
        return jsonify({
            'token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'borrow_records': [{
                    'id': br.id,
                    'user_id': br.user_id,
                    'book_id': br.book_id,
                    'borrow_date': br.borrow_date.isoformat() if br.borrow_date else None,
                    'return_date': br.return_date.isoformat() if br.return_date else None
                } for br in user.borrow_records] if user.borrow_records else [],
                'reviews': [{
                    'id': r.id,
                    'user_id': r.user_id,
                    'book_id': r.book_id,
                    'rating': r.rating,
                    'comment': r.comment
                } for r in user.reviews] if user.reviews else []
            }
        })
    return jsonify({'message': 'Invalid credentials'}), 401

@bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'message': 'Email already exists'}), 400
    hashed_password = bcrypt.hashpw(data.get('password').encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    user = User(username=data.get('username'), email=data.get('email'), password_hash=hashed_password)
    db.session.add(user)
    db.session.commit()
    access_token = create_access_token(identity={'id': user.id, 'role': user.role})
    return jsonify({
        'token': access_token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        }
    }), 201

@bp.route('/api/borrow', methods=['POST'])
@jwt_required()
def borrow_book(): 
    data = request.get_json()
    user_id = get_jwt_identity()['id']
    book = Book.query.get(data.get('book_id'))
    if not book or book.available_copies < 1:
        return jsonify({'message': 'Book not available'}), 400
    borrow_record = BorrowRecord(user_id=user_id, book_id=data.get('book_id'))
    book.available_copies -= 1
    db.session.add(borrow_record)
    db.session.commit()
    return jsonify({'message': 'Book borrowed successfully', 'borrow_record': {
        'id': borrow_record.id,
        'user_id': borrow_record.user_id,
        'book_id': borrow_record.book_id,
        'borrow_date': borrow_record.borrow_date.isoformat() if borrow_record.borrow_date else None,
        'return_date': borrow_record.return_date.isoformat() if borrow_record.return_date else None
    }}), 201

@bp.route('/api/borrow/<int:id>', methods=['PUT'])
@jwt_required()
def return_book(id):
    borrow_record = BorrowRecord.query.get_or_404(id)
    if borrow_record.return_date:
        return jsonify({'message': 'Book already returned'}), 400
    borrow_record.return_date = datetime.utcnow()
    borrow_record.book.available_copies += 1
    db.session.commit()
    return jsonify({'message': 'Book returned successfully', 'borrow_record': {
        'id': borrow_record.id,
        'user_id': borrow_record.user_id,
        'book_id': borrow_record.book_id,
        'borrow_date': borrow_record.borrow_date.isoformat() if borrow_record.borrow_date else None,
        'return_date': borrow_record.return_date.isoformat() if borrow_record.return_date else None
    }}), 200

@bp.route('/api/reviews', methods=['POST'])
@jwt_required()
def add_review(): 
    data = request.get_json()
    user_id = get_jwt_identity()['id']
    review = Review(user_id=user_id, book_id=data.get('book_id'), rating=data.get('rating'), comment=data.get('comment'))
    db.session.add(review)
    db.session.commit()
    return jsonify({'message': 'Review added', 'review': {
        'id': review.id,
        'user_id': review.user_id,
        'book_id': review.book_id,
        'rating': review.rating,
        'comment': review.comment
    }}), 201

@bp.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        identity = get_jwt_identity()
        logging.debug(f"JWT Identity: {identity}")
        user_id = identity.get('id')
        if not user_id:
            return jsonify({'message': 'Invalid token: missing user ID'}), 422
        user = User.query.get_or_404(user_id)
        return jsonify({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'borrow_records': [{
                'id': br.id,
                'user_id': br.user_id,
                'book_id': br.book_id,
                'borrow_date': br.borrow_date.isoformat() if br.borrow_date else None,
                'return_date': br.return_date.isoformat() if br.return_date else None
            } for br in user.borrow_records] if user.borrow_records else [],
            'reviews': [{
                'id': r.id,
                'user_id': r.user_id,
                'book_id': r.book_id,
                'rating': r.rating,
                'comment': r.comment
            } for r in user.reviews] if user.reviews else []
        })
    except Exception as e:
        logging.error(f"Error in get_profile: {str(e)}")
        return jsonify({'message': 'Error fetching profile', 'error': str(e)}), 422