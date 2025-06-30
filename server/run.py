from app import create_app
import os

def init_db(app):
    with app.app_context():
        from app.models import db, User, Book, BorrowRecord, Review  
        db.create_all() 
        if User.query.count() == 0 and Book.query.count() == 0:
            import seed
            seed.seed_data()

if __name__ == '__main__':
    app = create_app()
    init_db(app)  
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))