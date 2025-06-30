import os
from app import create_app
from app.models import db, User, Book, BorrowRecord, Review
from datetime import datetime
import bcrypt

app = create_app() 

def seed_data():
    with app.app_context():
        print("Dropping all tables...")
        db.drop_all()
        print("Creating all tables...")
        db.create_all()

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
        books = [
            Book(title="48 Laws of Power", author="Robert Greene", isbn="9780670881468", available_copies=2, image_url="https://www.google.com/imgres?q=48%20laws%20of%20power&imgurl=https%3A%2F%2Ftextbookcentre.com%2Fstorage%2F2024%2F10%2F61J3Uu4jOLL._AC_UF10001000_QL80_.jpg&imgrefurl=https%3A%2F%2Ftextbookcentre.com%2Fshop%2F48-laws-of-power-r-greene%2F&docid=xCBuO_4bPH1pfM&tbnid=qpkwH2kkoLNSEM&vet=12ahUKEwjAx4ahupeOAxUQ9rsIHQOYAFIQM3oECBoQAA..i&w=717&h=1000&hcb=2&ved=2ahUKEwjAx4ahupeOAxUQ9rsIHQOYAFIQM3oECBoQAA"),
            Book(title="Zen: The Art of Simple Living", author="Shunmyo Masuno", isbn="9780143134426", available_copies=1, image_url="https://via.placeholder.com/250x350/00FF00/FFFFFF?text=Zen+Art"),
        ]

        # Additional 50 books
        additional_books = [
            Book(title="To Kill a Mockingbird", author="Harper Lee", isbn="9780446310789", available_copies=3, image_url="https://via.placeholder.com/250x350/FF0000/FFFFFF?text=Mockingbird"),
            Book(title="1984", author="George Orwell", isbn="9780451524935", available_copies=2, image_url="https://via.placeholder.com/250x350/800080/FFFFFF?text=1984"),
            Book(title="Pride and Prejudice", author="Jane Austen", isbn="9780141439518", available_copies=1, image_url="https://via.placeholder.com/250x350/FFA500/FFFFFF?text=Pride"),
            Book(title="The Great Gatsby", author="F. Scott Fitzgerald", isbn="9780743273565", available_copies=2, image_url="https://via.placeholder.com/250x350/008000/FFFFFF?text=Gatsby"),
            Book(title="The Catcher in the Rye", author="J.D. Salinger", isbn="9780316769488", available_copies=1, image_url="https://via.placeholder.com/250x350/FF4500/FFFFFF?text=Catcher"),
            Book(title="Animal Farm", author="George Orwell", isbn="9780451526342", available_copies=3, image_url="https://via.placeholder.com/250x350/4B0082/FFFFFF?text=Animal+Farm"),
            Book(title="Lord of the Rings", author="J.R.R. Tolkien", isbn="9780544003415", available_copies=2, image_url="https://via.placeholder.com/250x350/FFD700/FFFFFF?text=LotR"),
            Book(title="Harry Potter and the Sorcerer’s Stone", author="J.K. Rowling", isbn="9780590353427", available_copies=3, image_url="https://via.placeholder.com/250x350/9400D3/FFFFFF?text=HP1"),
            Book(title="The Hobbit", author="J.R.R. Tolkien", isbn="9780547928227", available_copies=2, image_url="https://via.placeholder.com/250x350/20B2AA/FFFFFF?text=Hobbit"),
            Book(title="Brave New World", author="Aldous Huxley", isbn="9780060850524", available_copies=1, image_url="https://via.placeholder.com/250x350/FF69B4/FFFFFF?text=Brave+New"),
            
            Book(title="The Da Vinci Code", author="Dan Brown", isbn="9780307474278", available_copies=2, image_url="https://via.placeholder.com/250x350/DC143C/FFFFFF?text=Da+Vinci"),
            Book(title="The Alchemist", author="Paulo Coelho", isbn="9780062315007", available_copies=3, image_url="https://via.placeholder.com/250x350/ADFF2F/FFFFFF?text=Alchemist"),
            Book(title="Dune", author="Frank Herbert", isbn="9780441172719", available_copies=1, image_url="https://via.placeholder.com/250x350/4682B4/FFFFFF?text=Dune"),
            Book(title="Charlotte’s Web", author="E.B. White", isbn="9780061120268", available_copies=2, image_url="https://via.placeholder.com/250x350/9ACD32/FFFFFF?text=Charlotte"),
            Book(title="The Odyssey", author="Homer", isbn="9780140268867", available_copies=1, image_url="https://via.placeholder.com/250x350/CD5C5C/FFFFFF?text=Odyssey"),
          
            Book(title="Moby Dick", author="Herman Melville", isbn="9781503280786", available_copies=2, image_url="https://via.placeholder.com/250x350/BA55D3/FFFFFF?text=Moby+Dick"),
            Book(title="The Road", author="Cormac McCarthy", isbn="9780307387899", available_copies=1, image_url="https://via.placeholder.com/250x350/48D1CC/FFFFFF?text=The+Road"),
            Book(title="Fahrenheit 451", author="Ray Bradbury", isbn="9781451673319", available_copies=3, image_url="https://via.placeholder.com/250x350/C71585/FFFFFF?text=Fahrenheit"),
            
            Book(title="The Shining", author="Stephen King", isbn="9780307743657", available_copies=2, image_url="https://via.placeholder.com/250x350/FF8C00/FFFFFF?text=Shining"),
            Book(title="Gone with the Wind", author="Margaret Mitchell", isbn="9780446675536", available_copies=1, image_url="https://via.placeholder.com/250x350/6A5ACD/FFFFFF?text=Gone"),
            # I'll add more
        ]
        books.extend(additional_books)
        db.session.add_all(books)

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