import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav>
      <Link to="/home">Home</Link>
      <Link to="/books">Books</Link>
      {user ? (
        <>
          <Link to="/profile">Profile</Link>
          <Link to="/borrow">Borrow</Link>
          {user.role === 'admin' && <Link to="/admin/books">Manage Books</Link>}
          <button onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;