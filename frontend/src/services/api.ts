import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    console.log('🔐 API Request:', config.method?.toUpperCase(), config.url);
    console.log('📦 API Request Data:', config.data);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('✅ Token attached to request');
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    console.log('📦 API Response Data:', response.data);
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      console.error('🔒 Unauthorized! Redirecting to login...');
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

