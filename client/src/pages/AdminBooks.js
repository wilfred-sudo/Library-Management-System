import { useEffect, useState, useContext } from 'react';
import { getBooks, addBook, deleteBook } from '../utils/api';
import { AuthContext } from '../utils/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AdminBooks = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const data = await getBooks();
      setBooks(data);
    };

    fetchBooks();
  }, []);

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    author: Yup.string().required('Author is required'),
    isbn: Yup.string()
      .matches(/^\d{13}$/, 'ISBN must be 13 digits')
      .required('ISBN is required'),
    available_copies: Yup.number()
      .min(0, 'Must be at least 0')
      .required('Available copies is required'),
  });

  const handleDelete = async (id) => {
    await deleteBook(id, user.token);
    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
  };

  return (
    <div>
      <h1>Manage Books</h1>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2>Add Book</h2>
        <Formik
          initialValues={{
            title: '',
            author: '',
            isbn: '',
            available_copies: '',
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const newBook = await addBook(values, user.token);
            setBooks(prevBooks => [...prevBooks, newBook]);
            resetForm();
          }}
        >
          <Form>
            <div className="form-group">
              <label>Title</label>
              <Field name="title" type="text" />
              <ErrorMessage name="title" component="div" className="error" />
            </div>

            <div className="form-group">
              <label>Author</label>
              <Field name="author" type="text" />
              <ErrorMessage name="author" component="div" className="error" />
            </div>

            <div className="form-group">
              <label>ISBN</label>
              <Field name="isbn" type="text" />
              <ErrorMessage name="isbn" component="div" className="error" />
            </div>

            <div className="form-group">
              <label>Available Copies</label>
              <Field name="available_copies" type="number" />
              <ErrorMessage
                name="available_copies"
                component="div"
                className="error"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Add Book
            </button>
          </Form>
        </Formik>
      </div>

      <h2>Book List</h2>
      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#e5e7eb' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Title</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Author</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>ISBN</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Copies</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id} style={{ borderBottom: '1px solid #d1d5db' }}>
                <td style={{ padding: '10px' }}>{book.title}</td>
                <td style={{ padding: '10px' }}>{book.author}</td>
                <td style={{ padding: '10px' }}>{book.isbn}</td>
                <td style={{ padding: '10px' }}>{book.available_copies}</td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="btn btn-secondary"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBooks;
