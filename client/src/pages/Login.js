import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../utils/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <div className="card">
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            await login(values.email, values.password);
            navigate('/profile');
          }}
        >
          <Form>
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
            <button type="submit" className="btn btn-primary">Login</button>
          </Form>
        </Formik>
        <p className="mt-4">
          <Link to="/forgot-password" className="text-blue-600 hover:underline">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;