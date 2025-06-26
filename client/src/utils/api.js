import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getBooks = async () => {
  const res = await axios.get(`${API_URL}/books`);
  return res.data;
};

export const getBook = async (id) => {
  const res = await axios.get(`${API_URL}/books/${id}`);
  return res.data;
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
  await axios.post(`${API_URL}/borrow`, { book_id: bookId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const addReview = async (reviewData, token) => {
  await axios.post(`${API_URL}/reviews`, reviewData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getProfile = async (token) => {
  const res = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};