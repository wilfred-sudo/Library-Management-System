import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Borrow from './pages/Borrow';
import AdminBooks from './pages/AdminBooks';
import { AuthProvider } from './utils/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/admin/books" element={<AdminBooks />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;