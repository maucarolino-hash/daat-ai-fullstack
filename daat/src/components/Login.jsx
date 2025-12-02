import React, { useState } from 'react';
import api from '../services/api';
import { Eye, EyeOff, Check } from 'lucide-react';
import './Login.css'; // Import dedicated styles

const Login = ({ onLogin }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (isRegistering && !agreedToTerms) {
            setError("Você precisa aceitar os Termos & Condições.");
            setLoading(false);
            return;
        }

        if (isRegistering && password.trim() !== confirmPassword.trim()) {
            setError("As senhas não coincidem.");
            setLoading(false);
            return;
        }

        const endpoint = isRegistering ? '/api/auth/registration/' : '/api/auth/login/';

        try {
            const payload = isRegistering
                ? { username, email, password1: password.trim(), password2: confirmPassword.trim() }
                : { username, password: password.trim() };

            const response = await api.post(endpoint, payload);
            const data = response.data;

            const token = data.key || data.access || data.token;
            if (token) {
                onLogin(token);
            } else {
                setError("Login bem sucedido, mas nenhum token foi recebido.");
            }

        } catch (err) {
            console.error("Erro Auth:", err);
            if (err.response) {
                const data = err.response.data;
                let errorMsg = "Ocorreu um erro desconhecido.";

                if (typeof data === 'string' && data.length > 0) {
                    errorMsg = data;
                } else if (typeof data === 'object') {
                    if (data.detail) {
                        errorMsg = data.detail;
                    } else if (data.non_field_errors && data.non_field_errors.length > 0) {
                        errorMsg = data.non_field_errors[0];
                    } else if (Object.keys(data).length > 0) {
                        // Tenta pegar a primeira mensagem de erro de qualquer campo
                        const firstKey = Object.keys(data)[0];
                        const firstError = data[firstKey];
                        if (Array.isArray(firstError)) {
                            errorMsg = `${firstKey}: ${firstError[0]}`;
                        } else {
                            errorMsg = `${firstKey}: ${firstError}`;
                        }
                    }
                }

                // Evita mostrar aspas vazias ou JSON cru feio
                if (errorMsg === '""' || errorMsg === '{}') {
                    errorMsg = "Erro de comunicação com o servidor (Resposta vazia).";
                }

                // DEBUG: Se ainda for desconhecido, mostra o que veio
                if (errorMsg === "Ocorreu um erro desconhecido.") {
                    errorMsg = "DEBUG SERVER: " + (typeof data === 'string' ? data.substring(0, 100) : JSON.stringify(data));
                }

                setError(errorMsg);
            } else if (err.request) {
                setError("Erro de conexão. O servidor está acordado?");
            } else {
                setError("Erro desconhecido ao tentar logar.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Clear error when switching modes
    React.useEffect(() => {
        setError("");
    }, [isRegistering]);

    return (
        <div className="login-container">
            <div className="login-content">
                <h1 className="brand-title-login">
                    Daat <span>AI</span>
                </h1>
                <h2 className="login-title">
                    {isRegistering ? "Crie sua conta" : "Bem-vindo de volta"}
                </h2>
                <p className="login-subtitle">
                    {isRegistering ? "Já tem uma conta? " : "Não tem uma conta? "}
                    <button
                        type="button"
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="btn-link"
                    >
                        {isRegistering ? "Entrar" : "Cadastre-se"}
                    </button>
                </p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    {isRegistering && (
                        <div className="input-row">
                            <div className="input-group">
                                <input
                                    type="text"
                                    placeholder="Usuário"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {!isRegistering && (
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Usuário"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>
                    )}

                    <div className="input-group password-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            required
                        />
                        <button
                            type="button"
                            className="btn-show-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {isRegistering && (
                        <div className="input-group">
                            <input
                                type="password"
                                placeholder="Confirmar Senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>
                    )}

                    {isRegistering && (
                        <div className="checkbox-group">
                            <label className="custom-checkbox">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                />
                                <span className="checkmark">
                                    {agreedToTerms && <Check size={12} strokeWidth={4} />}
                                </span>
                                <span className="label-text">Eu concordo com os <a href="#">Termos & Condições</a></span>
                            </label>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn-submit ${loading ? 'btn-loading' : ''}`}
                    >
                        {loading ? "Processando..." : (isRegistering ? "Criar conta" : "Entrar")}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
