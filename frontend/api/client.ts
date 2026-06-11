import axios from 'axios';
import { store } from '../store/store';

// const API_URL = 'http://localhost:5000/api'; // Use your machine IP if running on a physical device
const API_URL = 'https://mental-health-app-pe73.onrender.com/api'; // Use your machine IP if running on a physical device

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
