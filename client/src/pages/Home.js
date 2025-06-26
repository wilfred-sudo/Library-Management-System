import { useEffect, useState } from 'react';
import { getBooks } from '../utils/api';
import BookCard from '../components/BookCard';

const Home = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const data = await getBooks();
      setBooks(data.slice(0, 3)); // Show 3 featured books
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Welcome to the Library</h1>
      <div className="grid">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Home;