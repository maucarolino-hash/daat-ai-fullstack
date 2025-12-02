import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000, // 60 seconds timeout (Render Cold Start)
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;
