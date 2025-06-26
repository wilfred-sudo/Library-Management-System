import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getBook } from '../utils/api';
import ReviewForm from '../components/ReviewForm';
import { AuthContext } from '../utils/AuthContext';

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState(null);

  const fetchBook = async () => {
    const data = await getBook(id);
    setBook(data);
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  if (!book) return <div>Loading...</div>;

  return (
    <div>
      <h1>{book.title}</h1>
      <div className="card">
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>ISBN:</strong> {book.isbn}</p>
        <p><strong>Available Copies:</strong> {book.available_copies}</p>
      </div>
      <h2>Reviews</h2>
      {book.reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {book.reviews.map(review => (
            <div key={review.id} className="card">
              <p><strong>{review.user}</strong>: {review.rating}/5</p>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      )}
      {user && <ReviewForm bookId={id} onReviewAdded={fetchBook} />}
    </div>
  );
};

export default BookDetails;