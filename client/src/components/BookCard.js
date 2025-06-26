import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  return (
    <div className="card">
      <h3>{book.title}</h3>
      <p style={{ color: '#6b7280' }}>Author: {book.author}</p>
      <p style={{ color: '#6b7280' }}>ISBN: {book.isbn}</p>
      <p style={{ color: '#6b7280' }}>Available Copies: {book.available_copies}</p>
      <Link to={`/books/${book.id}`} className="btn btn-primary" style={{ marginTop: '1rem' }}>
        View Details
      </Link>
    </div>
  );
};

export default BookCard;