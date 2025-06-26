import { useEffect, useState } from 'react';
import { getBooks } from '../utils/api';
import BookCard from '../components/BookCard';

const Books = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const data = await getBooks();
      setBooks(data);
    };
    fetchBooks();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Books;