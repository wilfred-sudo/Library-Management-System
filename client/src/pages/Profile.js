import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../utils/AuthContext';
import { getProfile } from '../utils/api';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getProfile(user.token);
      setProfile(data);
    };
    fetchProfile();
  }, [user]);

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
  });

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
        <Formik
          initialValues={{ username: profile.username, email: profile.email }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            // Implement update profile API call
            console.log('Update profile:', values);
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
            <button type="submit" className="btn btn-primary">Update</button>
          </Form>
        </Formik>
      </div>
      <h2 className="text-xl font-semibold mt-6 mb-4">Borrowing History</h2>
      <div className="space-y-4">
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