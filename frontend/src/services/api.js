import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

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


export const authAPI = {
  login: (email, password) => axiosInstance.post('/auth/login', { email, password }),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  getMe: () => axiosInstance.get('/auth/me')
};

export default axiosInstance;