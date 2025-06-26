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
    <div className="card mt-4">
      <h3 className="text-lg font-semibold">Add Review</h3>
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
          <div className="mb-4">
            <label className="block text-gray-700">Rating (1-5)</label>
            <Field name="rating" type="number" className="w-full p-2 border rounded" />
            <ErrorMessage name="rating" component="div" className="text-red-500" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Comment</label>
            <Field as="textarea" name="comment" className="w-full p-2 border rounded" />
            <ErrorMessage name="comment" component="div" className="text-red-500" />
          </div>
          <button type="submit" className="btn btn-primary">Submit Review</button>
        </Form>
      </Formik>
    </div>
  );
};

export default ReviewForm;