// src/config.js

// URL DO BACKEND
// Tenta pegar da variável de ambiente (Vercel), se não existir, usa localhost.
// Em produção (Vercel), usamos URL relativa para aproveitar o Proxy do vercel.json
// Em desenvolvimento (Localhost), usamos o backend local.
export const API_BASE_URL = import.meta.env.DEV ? "http://127.0.0.1:8000" : "https://daat-ai-fullstack.onrender.com";
