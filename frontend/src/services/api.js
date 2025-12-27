import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar token a las peticiones
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth-store');
        if (token) {
            const authData = JSON.parse(token);
            if(authData.state?.token) {
                config.headers.Authorization = `Bearer ${authData.state.token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejar errores globales
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token inválido o expirado
            localStorage.removeItem('auth-store');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;