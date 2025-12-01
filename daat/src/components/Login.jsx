import React, { useState } from 'react';
import api from '../services/api';

const Login = ({ onLogin }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Novo estado
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Validação básica de senhas no frontend
        if (isRegistering && password !== confirmPassword) {
            setError("As senhas não coincidem.");
            setLoading(false);
            return;
        }

        // Endpoint muda se for Login ou Registro
        const endpoint = isRegistering ? '/api/auth/registration/' : '/api/auth/login/';

        try {
            const payload = isRegistering
                ? { username, email, password1: password, password2: confirmPassword } // Envia password2
                : { username, password };

            const response = await api.post(endpoint, payload);
            const data = response.data;

            // SUCESSO!
            // Se for JWT, o token pode vir como 'access' ou 'key'
            const token = data.key || data.access || data.token;
            if (token) {
                onLogin(token); // Avisa o App que logou
            } else {
                setError("Login bem sucedido, mas nenhum token foi recebido.");
            }

        } catch (err) {
            console.error("Erro Auth:", err);
            if (err.response) {
                // O servidor respondeu com um status de erro (4xx, 5xx)
                const data = err.response.data;
                // Tenta extrair mensagem de erro mais amigável
                const errorMsg = data.detail || data.non_field_errors?.[0] || JSON.stringify(data);
                setError(errorMsg);
            } else if (err.request) {
                // A requisição foi feita mas sem resposta
                setError("Erro de conexão. O servidor está acordado?");
            } else {
                // Erro na configuração da requisição
                setError("Erro desconhecido ao tentar logar.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Daat AI</h1>
                <p className="login-subtitle">
                    {isRegistering ? "Criar Conta de Fundador" : "Acessar Dashboard"}
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Usuário</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input-text"
                            required
                        />
                    </div>

                    {isRegistering && (
                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-text"
                                required
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label className="input-label">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-text"
                            required
                        />
                    </div>

                    {isRegistering && (
                        <div className="input-group">
                            <label className="input-label">Confirmar Senha</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-text"
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn-primary ${loading ? 'btn-loading' : ''}`}
                    >
                        {loading ? "Processando..." : (isRegistering ? "Cadastrar" : "Entrar")}
                    </button>
                </form>

                <div className="login-footer">
                    <span>
                        {isRegistering ? "Já tem conta? " : "Novo por aqui? "}
                    </span>
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="btn-link"
                    >
                        {isRegistering ? "Fazer Login" : "Criar Conta"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
