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
    <div>
      <h2>Sign Up</h2>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          await signup(values.username, values.email, values.password);
          navigate('/profile');
        }}
      >
        <Form>
          <div>
            <label>Username</label>
            <Field name="username" type="text" />
            <ErrorMessage name="username" component="div" />
          </div>
          <div>
            <label>Email</label>
            <Field name="email" type="email" />
            <ErrorMessage name="email" component="div" />
          </div>
          <div>
            <label>Password</label>
            <Field name="password" type="password" />
            <ErrorMessage name="password" component="div" />
          </div>
          <button type="submit">Sign Up</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Signup;