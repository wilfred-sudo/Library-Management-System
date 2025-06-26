from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from .models import db, User, Book, BorrowRecord, Review
import bcrypt
from datetime import datetime

bp = Blueprint('api', __name__)

# ------------------------ AUTH ------------------------

@bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if user and bcrypt.checkpw(data['password'].encode('utf-8'), user.password_hash.encode('utf-8')):
        token = create_access_token(identity=user.id)
        return jsonify({'token': token, 'role': user.role, 'id': user.id}), 200

    return jsonify({'message': 'Invalid credentials'}), 401


@bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already exists'}), 400

    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password,
        role='user'
    )

    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=user.id)
    return jsonify({'token': token, 'role': user.role, 'id': user.id}), 201

# ------------------------ BOOKS ------------------------

@bp.route('/api/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify([
        {
            'id': b.id,
            'title': b.title,
            'author': b.author,
            'isbn': b.isbn,
            'available_copies': b.available_copies
        } for b in books
    ]), 200


@bp.route('/api/books', methods=['POST'])
@jwt_required()
def add_book():
    user = User.query.get(get_jwt_identity())

    if user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403

    data = request.get_json()

    book = Book(
        title=data['title'],
        author=data['author'],
        isbn=data['isbn'],
        available_copies=data['available_copies']
    )

    db.session.add(book)
    db.session.commit()

    return jsonify({
        'id': book.id,
        'title': book.title,
        'author': book.author,
        'isbn': book.isbn,
        'available_copies': book.available_copies
    }), 201


@bp.route('/api/books/<int:id>', methods=['GET'])
def get_book(id):
    book = Book.query.get_or_404(id)

    reviews = [
        {
            'id': r.id,
            'rating': r.rating,
            'comment': r.comment,
            'user': r.user.username
        } for r in book.reviews
    ]

    return jsonify({
        'id': book.id,
        'title': book.title,
        'author': book.author,
        'isbn': book.isbn,
        'available_copies': book.available_copies,
        'reviews': reviews
    }), 200


@bp.route('/api/books/<int:id>', methods=['PUT'])
@jwt_required()
def update_book(id):
    user = User.query.get(get_jwt_identity())

    if user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403

    book = Book.query.get_or_404(id)
    data = request.get_json()

    book.title = data.get('title', book.title)
    book.author = data.get('author', book.author)
    book.isbn = data.get('isbn', book.isbn)
    book.available_copies = data.get('available_copies', book.available_copies)

    db.session.commit()
    return jsonify({'message': 'Book updated'}), 200


@bp.route('/api/books/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_book(id):
    user = User.query.get(get_jwt_identity())

    if user.role != 'admin':
        return jsonify({'message': 'Admin access required'}), 403

    book = Book.query.get_or_404(id)

    db.session.delete(book)
    db.session.commit()

    return jsonify({'message': 'Book deleted'}), 200

# ------------------------ BORROW ------------------------

@bp.route('/api/borrow', methods=['POST'])
@jwt_required()
def borrow_book():
    user_id = get_jwt_identity()
    data = request.get_json()

    book = Book.query.get_or_404(data['book_id'])

    if book.available_copies < 1:
        return jsonify({'message': 'No copies available'}), 400

    borrow = BorrowRecord(
        user_id=user_id,
        book_id=data['book_id'],
        borrow_date=datetime.utcnow()
    )

    book.available_copies -= 1

    db.session.add(borrow)
    db.session.commit()

    return jsonify({'message': 'Book borrowed'}), 201


@bp.route('/api/borrow/<int:id>', methods=['PATCH'])
@jwt_required()
def update_borrow(id):
    borrow = BorrowRecord.query.get_or_404(id)
    data = request.get_json()

    if data.get('return_date'):
        borrow.return_date = datetime.utcnow()
        book = Book.query.get(borrow.book_id)
        book.available_copies += 1

    db.session.commit()
    return jsonify({'message': 'Borrow record updated'}), 200

# ------------------------ REVIEWS ------------------------

@bp.route('/api/reviews', methods=['POST'])
@jwt_required()
def add_review():
    user_id = get_jwt_identity()
    data = request.get_json()

    review = Review(
        user_id=user_id,
        book_id=data['book_id'],
        rating=data['rating'],
        comment=data['comment']
    )

    db.session.add(review)
    db.session.commit()

    return jsonify({'message': 'Review added'}), 201

# ------------------------ PROFILE ------------------------

@bp.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user = User.query.get_or_404(get_jwt_identity())

    borrow_records = [
        {
            'id': r.id,
            'book': {'title': r.book.title},
            'borrow_date': r.borrow_date.isoformat(),
            'return_date': r.return_date.isoformat() if r.return_date else None
        } for r in user.borrow_records
    ]

    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'borrow_records': borrow_records
    }), 200
