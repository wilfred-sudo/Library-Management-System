import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getBooks = async () => {
  const response = await fetch(`${API_URL}/books`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Failed to fetch books');
  const data = await response.json();
  return data;
};

export const getBook = async (id) => {
  const response = await fetch(`${API_URL}/books/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Failed to fetch book');
  const data = await response.json();
  return data;
};

export const addBook = async (bookData, token) => {
  const res = await axios.post(`${API_URL}/books`, bookData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateBook = async (id, bookData, token) => {
  const res = await axios.put(`${API_URL}/books/${id}`, bookData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deleteBook = async (id, token) => {
  await axios.delete(`${API_URL}/books/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const borrowBook = async (bookId, token) => {
  const res = await axios.post(`${API_URL}/borrow`, { book_id: bookId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const addReview = async (reviewData, token) => {
  await axios.post(`${API_URL}/reviews`, reviewData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getProfile = async (token) => {
  const response = await fetch(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token || localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Request failed with status ${response.status}: ${error.message || 'Unknown error'}`);
  }
  return response.json();
};