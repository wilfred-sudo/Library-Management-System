import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../utils/AuthContext';

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[0-9]/, 'Password must contain a number')
      .required('Password is required'),
  });

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      <div className="card">
        <Formik
          initialValues={{ username: '', email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await signup(values.username, values.email, values.password);
            navigate('/profile');
          }}
        >
          <Form>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <Field name="username" type="text" className="w-full p-2 border rounded" />
              <ErrorMessage name="username" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <Field name="email" type="email" className="w-full p-2 border rounded" />
              <ErrorMessage name="email" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <Field name="password" type="password" className="w-full p-2 border rounded" />
              <ErrorMessage name="password" component="div" className="text-red-500" />
            </div>
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Signup;