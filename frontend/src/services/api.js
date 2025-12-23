import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for cookies
});

// Request interceptor to add access token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for automatic token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check for token expiration (401 with TOKEN_EXPIRED code)
        const isTokenExpired =
            error.response?.status === 401 &&
            (error.response?.data?.code === 'TOKEN_EXPIRED' ||
                error.response?.data?.message?.includes('expired'));

        // Only attempt refresh once per request
        if (isTokenExpired && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the access token
                const { data } = await axios.post(
                    `${API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                // Update local storage with new access token
                const newToken = data.accessToken || data.token;
                localStorage.setItem('token', newToken);

                // Update header for the original request
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                // Retry original request with new token
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, clear tokens and redirect to login
                console.error('Token refresh failed:', refreshError);
                localStorage.removeItem('token');

                // Only redirect if not already on login page
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            }
        }

        // For other errors or if retry already attempted, reject
        return Promise.reject(error);
    }
);

export default api;
