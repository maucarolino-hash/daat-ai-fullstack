import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 90000, // 90 seconds timeout (Render Limit is ~100s)
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;
