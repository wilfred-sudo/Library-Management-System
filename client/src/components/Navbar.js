import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav>
      <div className="container">
      <Link to="/home" style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FontAwesomeIcon icon="book" size="lg" style={{ color: '#fff' }} /> { <i class="fa-solid fa-books"></i> }
          Library Management System
        </Link>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link to="/home">Home</Link>
          <Link to="/books">Books</Link>
          {user ? (
            <>
              <Link to="/profile">Profile</Link>
              <Link to="/borrow">Borrow</Link>
              {user.role === 'admin' && <Link to="/admin/books">Manage Books</Link>}
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="btn btn-secondary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
