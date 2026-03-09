import axios from 'axios';

const API_URL = 'https://ecobackend-zeds.vercel.app/api';
// const API_URL = 'http://localhost:3000/api';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecocollect_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ecocollect_token');
      localStorage.removeItem('ecocollect_user');
      localStorage.removeItem('ecocollect_role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;