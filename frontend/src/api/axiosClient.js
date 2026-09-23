import axios from 'axios';
import { store } from '../store/store';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Attach token from Redux state
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosClient.interceptors.response.use(
  (response) => {
    return response.data; // Return only the data payload by default
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return axiosClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Import dynamically or use raw axios to avoid circular dependency
        const refreshResponse = await axios.post(
          `${axiosClient.defaults.baseURL}/auth/refresh`, 
          {}, 
          { withCredentials: true }
        );
        
        const newAccessToken = refreshResponse.data.accessToken;
        const refreshedUser = refreshResponse.data.data;
        
        // Dispatch to store
        store.dispatch({
          type: 'auth/setCredentials',
          payload: { user: refreshedUser, accessToken: newAccessToken }
        });
        
        axiosClient.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
        originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
        
        processQueue(null, newAccessToken);
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Dispatch logout if refresh fails
        store.dispatch({ type: 'auth/logoutUser' });
        // Optionally redirect to login here or let components handle unauthenticated state
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
