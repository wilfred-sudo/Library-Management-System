import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../utils/AuthContext';
import { getBooks, borrowBook } from '../utils/api';
import BookCard from '../components/BookCard';

const Borrow = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        const availableBooks = data.filter(book => book.available_copies > 0);
        setBooks(availableBooks);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books.');
      }
    };

    fetchBooks();
  }, []);

  const handleBorrow = async (bookId) => {
    await borrowBook(bookId, user.token);
    setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
  };

  if (error) {
    return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
  }

  return (
    <div>
      <h1>Borrow Books</h1>

      <div className="form-group" style={{ marginBottom: '20px' }}>
        <select
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #d1d5db'
          }}
        >
          <option value="">Filter by Availability</option>
          <option value="high">High Availability (&gt;1)</option>
          <option value="low">Low Availability (1)</option>
        </select>
      </div>

      <div className="grid">
        {books.map(book => (
          <div key={book.id} className="card">
            <BookCard book={book} />
            <button
              onClick={() => handleBorrow(book.id)}
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Borrow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Borrow;
