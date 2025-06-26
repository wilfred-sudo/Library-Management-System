import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useContext } from 'react';
import { AuthContext } from '../utils/AuthContext';
import { addReview } from '../utils/api';

const ReviewForm = ({ bookId, onReviewAdded }) => {
  const { user } = useContext(AuthContext);

  const validationSchema = Yup.object({
    rating: Yup.number()
      .min(1, 'Rating must be between 1 and 5')
      .max(5, 'Rating must be between 1 and 5')
      .required('Rating is required'),
    comment: Yup.string()
      .min(10, 'Comment must be at least 10 characters')
      .required('Comment is required'),
  });

  return (
    <div className="card" style={{ marginTop: '1rem' }}>
      <h3>Add Review</h3>
      <Formik
        initialValues={{ rating: '', comment: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          await addReview({ ...values, book_id: bookId }, user.token);
          onReviewAdded();
          resetForm();
        }}
      >
        <Form>
          <div style={{ marginBottom: '1rem' }}>
            <label>Rating (1-5)</label>
            <Field name="rating" type="number" />
            <ErrorMessage name="rating" component="div" className="error" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Comment</label>
            <Field as="textarea" name="comment" />
            <ErrorMessage name="comment" component="div" className="error" />
          </div>
          <button type="submit" className="btn btn-primary">Submit Review</button>
        </Form>
      </Formik>
    </div>
  );
};

export default ReviewForm;