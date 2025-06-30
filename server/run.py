from app import create_app
import os 

app = create_app()

if __name__ == '__main__': 
    with app.app_context():
        from app.models import db, User, Book, BorrowRecord, Review  # Import models inside context
        db.create_all()  # Create tables if they don't exist
        # Check if tables are empty and seed if necessary
        if User.query.count() == 0 and Book.query.count() == 0:
            import seed
            seed.seed_data()
    app.run(debug=True, host='0.0.0.0', port=int(os.getenv('PORT', 5000)))