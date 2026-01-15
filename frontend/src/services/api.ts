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
    
    // Don't log FormData content (too large)
    if (config.data instanceof FormData) {
      console.log('📦 API Request Data: FormData (multipart/form-data)');
      console.log('📦 FormData keys:', Array.from(config.data.keys()));
    } else {
      console.log('📦 API Request Data:', config.data);
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('✅ Token attached to request');
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    
    // For FormData, ensure Content-Type is not set (let browser/axios set it with boundary)
    if (config.data instanceof FormData) {
      // Remove all Content-Type related headers
      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
      delete config.headers['Accept'];
      
      // Also remove from common headers
      if (config.headers.common) {
        delete config.headers.common['Content-Type'];
        delete config.headers.common['content-type'];
      }
      
      // And from post headers
      if (config.headers.post) {
        delete config.headers.post['Content-Type'];
        delete config.headers.post['content-type'];
      }
      
      console.log('✅ Content-Type removed for FormData (browser will set it)');
    }
    
    console.log('📤 Final headers:', {
      ...config.headers,
      Authorization: config.headers.Authorization ? '***' : undefined
    });
    
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

