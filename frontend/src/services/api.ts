import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
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
    
    // For FormData, ensure Content-Type is not set so axios can set it with boundary
    if (config.data instanceof FormData) {
      // Remove Content-Type header completely - axios will automatically set it with boundary
      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
      // Also remove from common headers if exists
      if (config.headers.common) {
        delete config.headers.common['Content-Type'];
        delete config.headers.common['content-type'];
      }
      console.log('✅ FormData detected, removed Content-Type - axios will set with boundary');
      console.log('📦 FormData entries:', Array.from(config.data.entries()).map(([key, value]) => 
        [key, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value]
      ));
    } else if (config.data && typeof config.data === 'object' && !(config.data instanceof Blob)) {
      // For non-FormData object requests, set Content-Type to application/json
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
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
      // Only redirect if not already on login page to avoid infinite loop
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

