import api from './api';

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    // Handle both 'accessToken' and 'token' for backward compatibility
    const token = response.data.accessToken || response.data.token;
    if (token) {
        localStorage.setItem('token', token);
    }
    return response.data;
};

export const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    // Handle both 'accessToken' and 'token' for backward compatibility
    const token = response.data.accessToken || response.data.token;
    if (token) {
        localStorage.setItem('token', token);
    }
    return response.data;
};

export const logout = async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
};

export const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data.data.user;
};
