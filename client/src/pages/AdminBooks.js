import { useEffect, useState } from 'react';
import { getBooks, addBook, updateBook, deleteBook } from '../utils/api';
import { useContext } from 'react';
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
    setBooks(books.filter(book => book.id !== id));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Books</h1>
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Book</h2>
        <Formik
          initialValues={{ title: '', author: '', isbn: '', available_copies: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            const newBook = await addBook(values, user.token);
            setBooks([...books, newBook]);
            resetForm();
          }}
        >
          <Form>
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <Field name="title" type="text" className="w-full p-2 border rounded" />
              <ErrorMessage name="title" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Author</label>
              <Field name="author" type="text" className="w-full p-2 border rounded" />
              <ErrorMessage name="author" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">ISBN</label>
              <Field name="isbn" type="text" className="w-full p-2 border rounded" />
              <ErrorMessage name="isbn" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Available Copies</label>
              <Field name="available_copies" type="number" className="w-full p-2 border rounded" />
              <ErrorMessage name="available_copies" component="div" className="text-red-500" />
            </div>
            <button type="submit" className="btn btn-primary">Add Book</button>
          </Form>
        </Formik>
      </div>
      <h2 className="text-xl font-semibold mb-4">Book List</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {books.map(book => (
          <div key={book.id} className="card">
            <p><strong>{book.title}</strong> by {book.author}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Available Copies: {book.available_copies}</p>
            <button
              onClick={() => handleDelete(book.id)}
              className="btn btn-secondary mt-4"
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