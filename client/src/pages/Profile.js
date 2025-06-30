// src/pages/Profile.js
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../utils/AuthContext';
import { getProfile } from '../utils/api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(user.token);
        setProfile(data);
      } catch (err) {
        console.error('Profile fetch error:', err.message);
        setError(err.message);
      }
    };
    fetchProfile();
  }, [user]);

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
  });

  if (error) return <div style={{ color: 'red', padding: '20px' }}>{error}</div>;
  if (!profile) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <h1>Profile</h1>
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <img src="https://via.placeholder.com/100" alt="Profile" style={{ borderRadius: '50%' }} />
        <div>
          <h2>Update Profile</h2>
          <Formik
            initialValues={{ username: profile.username, email: profile.email }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              console.log('Update profile:', values);
            }}
          >
            <Form>
              <div className="form-group">
                <label>Username</label>
                <Field name="username" type="text" />
                <ErrorMessage name="username" component="div" className="error" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <Field name="email" type="email" />
                <ErrorMessage name="email" component="div" className="error" />
              </div>
              <button type="submit" className="btn btn-primary">Update</button>
            </Form>
          </Formik>
        </div>
      </div>
      <h2>Borrowing History</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {profile.borrow_records?.map(record => (
          <div key={record.id} className="card">
            <p><strong>Book:</strong> {record.book.title}</p>
            <p><strong>Borrow Date:</strong> {new Date(record.borrow_date).toLocaleDateString()}</p>
            <p><strong>Return Date:</strong> {record.return_date ? new Date(record.return_date).toLocaleDateString() : 'Not returned'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;