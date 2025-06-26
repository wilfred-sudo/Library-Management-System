import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setUser(res.data)).catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser({ id: res.data.id, role: res.data.role });
  };

  const signup = async (username, email, password) => {
    const res = await axios.post('http://localhost:5000/api/signup', { username, email, password });
    localStorage.setItem('token', res.data.token);
    setUser({ id: res.data.id, role: res.data.role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};