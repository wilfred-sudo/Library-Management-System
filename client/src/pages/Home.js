import { useEffect, useState } from 'react';
import { getBooks } from '../utils/api';
import BookCard from '../components/BookCard';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(data.slice(0, 3)); // Show 3 featured books
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books. Check the backend.');
      }
    };
    fetchBooks();
  }, []);

  if (error) return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;

  return (
    <div>
      <div className="hero">
        <h1>Welcome to the Library</h1>
        <p>Explore a world of knowledge with our vast collection of books. Borrow, review, and manage your reading journey!</p>
        <a href="/books" className="btn btn-primary">Browse All Books</a>
      </div>
      <h2>Featured Books</h2>
      <div className="grid">
        {books.length > 0 ? (
          books.map(book => <BookCard key={book.id} book={book} />)
        ) : (
          <p>No featured books available.</p>
        )}
      </div>
    </div>
  );
};

export default Home;