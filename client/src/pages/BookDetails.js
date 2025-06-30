import { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBook } from '../utils/api';
import ReviewForm from '../components/ReviewForm';
import { AuthContext } from '../utils/AuthContext';
import './BookDetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowing, setBorrowing] = useState(false);

  const fetchBook = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBook(id);
      setBook(data);
    } catch (err) {
      console.error('Error fetching book:', err.message);
      setError(`Failed to load book: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  const handleBorrowBook = async () => {
    setBorrowing(true);
    try {
      // Add your borrow book API call here
      // await borrowBook(id);
      await fetchBook(); // Refresh book data after borrowing
    } catch (err) {
      setError(`Failed to borrow book: ${err.message}`);
    } finally {
      setBorrowing(false);
    }
  };

  const handleReviewAdded = useCallback(() => {
    fetchBook();
  }, [fetchBook]);

  if (loading) {
    return (
      <div className="book-details-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-details-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <Link to="/books" className="btn btn-secondary">
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="book-details-container">
        <div className="error-state">
          <div className="error-icon">📚</div>
          <p>Book not found.</p>
          <Link to="/books" className="btn btn-secondary">
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = book.reviews?.length > 0 
    ? (book.reviews.reduce((sum, review) => sum + review.rating, 0) / book.reviews.length).toFixed(1)
    : null;

  return (
    <div className="book-details-container">
      <div className="book-header">
        <Link to="/books" className="back-link">
          ← Back to Books
        </Link>
        <h1 className="book-title">{book.title}</h1>
        {averageRating && (
          <div className="rating-display">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`star ${i < Math.floor(averageRating) ? 'filled' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="rating-text">
              {averageRating} ({book.reviews.length} review{book.reviews.length !== 1 ? 's' : ''})
            </span>
          </div>
        )}
      </div>

      <div className="book-details">
        <div className="book-image-container">
          <img
            src={book.image_url || 'https://via.placeholder.com/300x450?text=No+Image+Available'}
            alt={`${book.title} cover`}
            className="book-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Image+Available';
            }}
          />
        </div>

        <div className="book-info">
          <div className="info-section">
            <h3>Book Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Author:</span>
                <span className="value">{book.author || 'Unknown'}</span>
              </div>
              <div className="info-item">
                <span className="label">ISBN:</span>
                <span className="value">{book.isbn || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Available Copies:</span>
                <span className={`value ${book.available_copies === 0 ? 'unavailable' : 'available'}`}>
                  {book.available_copies || 0}
                </span>
              </div>
              {book.genre && (
                <div className="info-item">
                  <span className="label">Genre:</span>
                  <span className="value">{book.genre}</span>
                </div>
              )}
              {book.publication_year && (
                <div className="info-item">
                  <span className="label">Published:</span>
                  <span className="value">{book.publication_year}</span>
                </div>
              )}
            </div>
          </div>

          {book.description && (
            <div className="info-section">
              <h3>Description</h3>
              <p className="book-description">{book.description}</p>
            </div>
          )}

          {user && (
            <div className="action-section">
              {book.available_copies > 0 ? (
                <button
                  className="btn btn-primary"
                  onClick={handleBorrowBook}
                  disabled={borrowing}
                >
                  {borrowing ? 'Borrowing...' : 'Borrow Book'}
                </button>
              ) : (
                <div className="unavailable-notice">
                  <span className="unavailable-icon">📚</span>
                  <span>No copies available</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <h2 className="reviews-title">Reviews</h2>
        
        {book.reviews && book.reviews.length > 0 ? (
          <div className="reviews-list">
            {book.reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <span className="reviewer-name">{review.user || 'Anonymous'}</span>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`star ${i < review.rating ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {review.created_at && (
                    <span className="review-date">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {review.comment && (
                  <p className="review-comment">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reviews">
            <span className="no-reviews-icon">💭</span>
            <p>No reviews yet. Be the first to review this book!</p>
          </div>
        )} 

        {user && (
          <div className="review-form-section">
            <ReviewForm
              bookId={id}
              onReviewAdded={handleReviewAdded}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;