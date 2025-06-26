import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';

const ProtectedRoute = ({ component: Component, adminOnly = false }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/home" />;
  }

  return <Component />;
};

export default ProtectedRoute;