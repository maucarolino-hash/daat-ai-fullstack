import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000', // Backend Django
    timeout: 300000, // 5 minutes timeout (AI is slow)
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('daat_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 (Logout)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Disparar evento de logout para a UI ouvir
            window.dispatchEvent(new Event('auth:logout'));
        }
        return Promise.reject(error);
    }
);

export default api;
