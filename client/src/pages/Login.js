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
    <div style={{ maxWidth: '400px', margin: '40px auto', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' , border:'2px solid  #111827' }}>
      <h1>Login</h1>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          await login(values.email, values.password);
          navigate('/profile');
        }}
      >
        <Form>
          <div className="form-group">
            <label>Email</label>
            <Field name="email" type="email" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <Field name="password" type="password" />
            <ErrorMessage name="password" component="div" className="error" />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </Form>
      </Formik>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        <Link to="/forgot-password" style={{ color: '#2563eb', textDecoration: 'underline' }}>
          Forgot Password?
        </Link>
      </p>
    </div>
  );
};

export default Login;