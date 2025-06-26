import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold">{book.title}</h3>
      <p className="text-gray-600">Author: {book.author}</p>
      <p className="text-gray-600">ISBN: {book.isbn}</p>
      <p className="text-gray-600">Available Copies: {book.available_copies}</p>
      <Link to={`/books/${book.id}`} className="btn btn-primary mt-4">
        View Details
      </Link>
    </div>
  );
};

export default BookCard;