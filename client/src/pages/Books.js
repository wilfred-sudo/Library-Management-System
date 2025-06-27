import { useEffect, useState } from 'react';
import { getBooks } from '../utils/api';
import BookCard from '../components/BookCard';



const Books = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books.');
      }
    };
    fetchBooks();
  }, []);

  if (error) return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;

  return (
    <div>
      <h1>All Books</h1>
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search books..."
          style={{ maxWidth: '300px' }}
        />
      </div>
      <div className="grid">
        {books.length > 0 ? (
          books.map(book => <BookCard key={book.id} book={book} />)
        ) : (
          <p>No books available.</p>
        )}
      </div>
      <p style={{ textAlign: 'center', color: '#4b5563' }}>Showing 1-{books.length} of {books.length} books. (Pagination coming soon!)</p>
    </div>
  );
};

export default Books;