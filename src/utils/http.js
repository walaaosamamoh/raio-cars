import axios from 'axios';

/**
 * Dynamically sets the baseURL according to the environment
 */
let BASE_URL = import.meta.env.VITE_API_URL
/**
 * Creates a single Axios instance with dynamic configuration
 */
const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Accept": 'application/json',
  },
});

/**
 * Interceptor to attach the authorization token to each request if available
 */
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, error => Promise.reject(error));




export default http;
