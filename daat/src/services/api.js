import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 300000, // 5 minutes timeout to handle long AI analysis locally
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;
