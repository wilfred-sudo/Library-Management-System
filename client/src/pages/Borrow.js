import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../utils/AuthContext';
import { getBooks, borrowBook } from '../utils/api';
import BookCard from '../components/BookCard';

const Borrow = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const data = await getBooks();
      setBooks(data.filter(book => book.available_copies > 0));
    };
    fetchBooks();
  }, []);

  const handleBorrow = async (bookId) => {
    await borrowBook(bookId, user.token);
    setBooks(books.filter(book => book.id !== bookId));
  };

  return (
    <div>
      <h1>Borrow Books</h1>
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