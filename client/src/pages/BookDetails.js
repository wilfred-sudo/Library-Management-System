import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getBook } from '../utils/api';
import ReviewForm from '../components/ReviewForm';
import { AuthContext } from '../utils/AuthContext';

const fetchBook = async (id) => {
  const data = await getBook(id);
  return data;
};

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [book, setBook] = useState(null); 

  useEffect(() => {
    const loadBook = async () => {
      const data = await fetchBook(id);
      setBook(data);
    };
    loadBook();
  }, [id]); // Only re-run when id changes

  if (!book) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading book details...</p>
      </div>
    );
  }

  return (
    <div className="book-details-page">
      <div className="book-header">
        <div className="book-cover-container">
          <img 
            src="public/images/snake.jpg" 
            className="book-cover"
          />
        </div>
        
        <div className="book-main-info">
          <h1 className="book-title">{book.title}</h1>
          <div className="book-metadata">
            <div className="metadata-item">
              <span className="metadata-label">Author:</span>
              <span className="metadata-value">{book.author}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">ISBN:</span>
              <span className="metadata-value">{book.isbn}</span>
            </div>
            <div className="metadata-item">
              <span className="metadata-label">Available Copies:</span>
              <span className={`metadata-value ${book.available_copies > 0 ? 'available' : 'unavailable'}`}>
                {book.available_copies}
              </span>
            </div>
          </div>
          
          {user && (
            <button 
              className={`borrow-btn ${book.available_copies > 0 ? 'available' : 'disabled'}`}
              disabled={book.available_copies === 0}
            >
              {book.available_copies > 0 ? 'Borrow Book' : 'Currently Unavailable'}
            </button>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <h2 className="reviews-title">
          Reviews 
          <span className="reviews-count">({book.reviews.length})</span>
        </h2>
        
        {book.reviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this book!</p>
          </div>
        ) : (
          <div className="reviews-list">
            {book.reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <span className="reviewer-name">{review.user}</span>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`star ${i < review.rating ? 'filled' : 'empty'}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="rating-text">({review.rating}/5)</span>
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {user && (
        <div className="review-form-section">
          <ReviewForm 
            bookId={id} 
            onReviewAdded={() => fetchBook(id).then(setBook)} 
          />
        </div>
      )}

      <style jsx>{`
        .book-details-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-text {
          color: #666;
          font-size: 1.1rem;
        }

        .book-header {
          display: flex;
          gap: 2rem;
          margin-bottom: 3rem;
          padding: 2rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .book-cover-container {
          flex-shrink: 0;
        }

        .book-cover-container img {
        
        
        }

        .book-cover {
          width: 200px;
          height: 300px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease;
        }

        .book-cover:hover {
          transform: translateY(-4px);
        }

        .book-main-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .book-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2c3e50;
          margin: 0 0 1.5rem 0;
          line-height: 1.2;
        }

        .book-metadata {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .metadata-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .metadata-label {
          font-weight: 600;
          color: #495057;
          min-width: 120px;
        }

        .metadata-value {
          color: #212529;
          font-weight: 500;
        }

        .metadata-value.available {
          color: #28a745;
        }

        .metadata-value.unavailable {
          color: #dc3545;
        }

        .borrow-btn {
          align-self: flex-start;
          padding: 0.75rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .borrow-btn.available {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
        }

        .borrow-btn.available:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
        }

        .borrow-btn.disabled {
          background: #6c757d;
          color: #fff;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .reviews-section {
          margin-bottom: 3rem;
          
        }

        .reviews-title {
          font-size: 2rem;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .reviews-count {
          font-size: 1.2rem;
          color: #6c757d;
          font-weight: 400;
        }

        .no-reviews {
          text-align: center;
          padding: 3rem;
          background: #f8f9fa;
          border-radius: 8px;
          border: 2px dashed #dee2e6;
        }

        .no-reviews p {
          color: #6c757d;
          font-size: 1.1rem;
          margin: 0;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .review-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          background: #cecece;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-left: 4px solid #007bff;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .review-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .reviewer-name {
          font-weight: 600;
          color: #2c3e50;
          font-size: 1.1rem;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .star {
          font-size: 1.2rem;
        }

        .star.filled {
          color: #ffc107;
        }

        .star.empty {
          color: #e9ecef;
        }

        .rating-text {
          margin-left: 0.5rem;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .review-comment {
          color: #495057;
          margin: 0;
          line-height: 1.6;
        }

        .review-form-section {
          padding: 2rem;
          background: #f8f9fa;
          border-radius: 12px;
          border: 1px solid #dee2e6;
        }

        @media (max-width: 768px) {
          .book-details-page {
            padding: 1rem;
          }

          .book-header {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
          }

          .book-title {
            font-size: 2rem;
          }

          .metadata-item {
            justify-content: center;
          }

          .borrow-btn {
            align-self: center;
          }

          .review-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default BookDetails;