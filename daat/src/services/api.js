import axios from 'axios';

const api = axios.create({
    // Tem que ser a URL do RENDER (Backend), não da Vercel (Frontend).
    // Tem que ter https://
    // NÃO pode ter barra / no final (ex: .com/ ❌ -> .com ✅)
    baseURL: "https://daat-ai-fullstack.onrender.com",
});

export default api;
