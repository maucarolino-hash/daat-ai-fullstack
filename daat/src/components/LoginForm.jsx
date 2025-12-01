import React, { useState } from 'react';
import api from '../services/api';

const LoginForm = ({ onLogin, onSwitchToRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/api/auth/login/', { username, password });
            const data = response.data;

            // Login com sucesso!
            // O token é salvo automaticamente nos cookies (HttpOnly) pelo backend se configurado,
            // ou vem no corpo da resposta (data.key ou data.access).
            // Vamos passar os dados para o App gerenciar o estado.
            onLogin(data);

        } catch (err) {
            console.error(err);
            if (err.response) {
                const data = err.response.data;
                setError(data.non_field_errors?.[0] || 'Falha no login. Verifique suas credenciais.');
            } else {
                setError('Erro de conexão com o servidor.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            maxWidth: '400px',
            margin: '80px auto',
            padding: '40px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            textAlign: 'center'
        }}>
            <h2 style={{ marginBottom: '10px', color: 'var(--text-primary)', fontSize: '1.8rem' }}>Daat AI</h2>
            <p style={{ marginBottom: '30px', color: 'var(--text-secondary)' }}>Entre para acessar seus diagnósticos</p>

            {error && (
                <div style={{
                    padding: '10px',
                    backgroundColor: 'rgba(252, 129, 129, 0.1)',
                    color: '#fc8181',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    fontSize: '0.9rem'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Usuário</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-light)',
                            backgroundColor: 'var(--bg-input)',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            fontSize: '1rem'
                        }}
                        required
                    />
                </div>

                <div style={{ textAlign: 'left' }}>
                    <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-light)',
                            backgroundColor: 'var(--bg-input)',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            fontSize: '1rem'
                        }}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        marginTop: '10px',
                        padding: '14px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: 'var(--brand-primary)',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                        transition: 'background-color 0.2s'
                    }}
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>

            <div style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Não tem conta?{' '}
                <button
                    onClick={onSwitchToRegister}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--brand-primary)',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        textDecoration: 'underline'
                    }}
                >
                    Criar conta
                </button>
            </div>
        </div>
    );
};

export default LoginForm;
