import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

const Login = ({ onLogin }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState(""); // Opcional para o MVP, mas bom ter
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Endpoint muda se for Login ou Registro
        const endpoint = isRegistering ? `${API_BASE_URL}/api/auth/registration/` : `${API_BASE_URL}/api/auth/login/`;

        try {
            const payload = isRegistering
                ? { username, email, password1: password } // dj-rest-auth pede password1 no registro
                : { username, password }; // dj-rest-auth pede username/password no login (ou email dependendo da config)

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                // SUCESSO!
                // Se for JWT, o token pode vir como 'access' ou 'key'
                const token = data.key || data.access || data.token;
                if (token) {
                    onLogin(token); // Avisa o App que logou
                } else {
                    setError("Login bem sucedido, mas nenhum token foi recebido.");
                }
            } else {
            } else {
                // ERRO
                console.error("Erro Auth:", data);
                setError(JSON.stringify(data)); // Mostra o erro cru por enquanto para debug
            }
        } catch (err) {
            setError("Erro de conexão. O servidor está acordado?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            height: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)'
        }}>
            <div style={{
                width: '100%', maxWidth: '400px', padding: '40px',
                backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-light)'
            }}>
                <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Daat AI</h1>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px' }}>
                    {isRegistering ? "Criar Conta de Fundador" : "Acessar Dashboard"}
                </p>

                {error && (
                    <div style={{ padding: '10px', backgroundColor: '#EF444420', color: '#EF4444', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Usuário</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'white', outline: 'none' }}
                            required
                        />
                    </div>

                    {isRegistering && (
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Email (Opcional)</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'white', outline: 'none' }}
                            />
                        </div>
                    )}

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'white', outline: 'none' }}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '14px', borderRadius: '8px', border: 'none',
                            backgroundColor: 'var(--brand-primary)', color: 'white', fontWeight: 'bold', cursor: 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? "Processando..." : (isRegistering ? "Cadastrar" : "Entrar")}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                        {isRegistering ? "Já tem conta? " : "Novo por aqui? "}
                    </span>
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        {isRegistering ? "Fazer Login" : "Criar Conta"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
