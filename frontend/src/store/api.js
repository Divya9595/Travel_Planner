import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Leverages our Vite proxy automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT tokens to requests if they exist in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;