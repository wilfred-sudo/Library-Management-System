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
        console.log('Fetched books data:', data); // Debug log
        setBooks(data.slice(0, 3)); // Show 3 featured books
      } catch (err) {
        console.error('Fetch books error:', err.message); // Debug error
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
      <div className="about-us" style={{ padding: '40px', backgroundColor: '#f9f9f9', marginTop: '40px', textAlign: 'center' }}>
        <h2>About Us</h2>
        <p>
          Welcome to our digital library, a haven for book lovers and knowledge seekers. Established to promote reading and learning, we offer a wide range of books from classic literature to modern bestsellers. Our mission is to make reading accessible to everyone, fostering a community of avid readers and providing tools to manage your reading experience effortlessly.
        </p>
        <p style={{ marginTop: '15px' }}>
          <strong>Contact us:</strong> <a href="mailto:support@library.com">support@library.com</a> | Follow us on <a href="https://x.com/library" target="_blank" rel="noopener noreferrer">X</a>
        </p>
      </div>
    </div>
  );
};

export default Home;