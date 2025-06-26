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
      <h1 className="text-3xl font-bold mb-6">Borrow Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {books.map(book => (
          <div key={book.id} className="card">
            <BookCard book={book} />
            <button
              onClick={() => handleBorrow(book.id)}
              className="btn btn-primary mt-4"
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