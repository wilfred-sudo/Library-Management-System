import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container flex justify-between items-center">
        <Link to="/home" className="text-2xl font-bold">Library</Link>
        <div className="space-x-4">
          <Link to="/home" className="hover:underline">Home</Link>
          <Link to="/books" className="hover:underline">Books</Link>
          {user ? (
            <>
              <Link to="/profile" className="hover:underline">Profile</Link>
              <Link to="/borrow" className="hover:underline">Borrow</Link>
              {user.role === 'admin' && (
                <Link to="/admin/books" className="hover:underline">Manage Books</Link>
              )}
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="btn btn-secondary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;