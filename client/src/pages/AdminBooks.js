import { useEffect, useState, useContext } from 'react';
import { getBooks, addBook, updateBook, deleteBook } from '../utils/api'; 
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
    setBooks(books.filter((book) => book.id !== id));
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
            setBooks([...books, newBook]);
            resetForm();
          }}
        >
          <Form>
            <div style={{ marginBottom: '1rem' }}>
              <label>Title</label>
              <Field name="title" type="text" />
              <ErrorMessage name="title" component="div" className="error" />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Author</label>
              <Field name="author" type="text" />
              <ErrorMessage name="author" component="div" className="error" />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>ISBN</label>
              <Field name="isbn" type="text" />
              <ErrorMessage name="isbn" component="div" className="error" />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Available Copies</label>
              <Field name="available_copies" type="number" />
              <ErrorMessage name="available_copies" component="div" className="error" />
            </div>

            <button type="submit" className="btn btn-primary">
              Add Book
            </button>
          </Form>
        </Formik>
      </div>

      <h2>Book List</h2>
      <div className="grid">
        {books.map((book) => (
          <div key={book.id} className="card">
            <p>
              <strong>{book.title}</strong> by {book.author}
            </p>
            <p>ISBN: {book.isbn}</p>
            <p>Available Copies: {book.available_copies}</p>
            <button
              onClick={() => handleDelete(book.id)}
              className="btn btn-secondary"
              style={{ marginTop: '1rem' }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBooks;
