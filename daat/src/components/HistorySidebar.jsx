import React, { useEffect, useState } from 'react';

// Recebemos as funções do Pai via PROPS
const HistorySidebar = ({ onSelectReport, onNewAnalysis, token, onLogout }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (!token) return;

        fetch('https://daat-ai-fullstack.onrender.com/api/history', {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setHistory(data.history || []))
            .catch(err => console.error(err));
    }, [token]);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* Botão NOVA ANÁLISE (Fixo no topo) */}
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
                <button
                    onClick={onNewAnalysis}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: 'var(--brand-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--brand-hover)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--brand-primary)'}
                >
                    <span>+</span> Nova Análise
                </button>
            </div>

            <div style={{ padding: '15px 24px 5px 24px' }}>
                <h2 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                    Recentes
                </h2>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                {history.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>Vazio.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {history.map((item) => (
                            <li
                                key={item.id}
                                // AQUI ESTÁ A MÁGICA: Ao clicar, envia o item inteiro para o Pai
                                onClick={() => onSelectReport(item)}
                                style={{
                                    padding: '16px', marginBottom: '8px', borderRadius: '8px',
                                    backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--brand-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                    <span style={{
                                        fontSize: '0.75rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '4px',
                                        backgroundColor: item.score > 60 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: item.score > 60 ? 'var(--status-success)' : 'var(--status-danger)'
                                    }}>
                                        {item.score}
                                    </span>
                                </div>
                                <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item.customer_segment || "Untitled"}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default HistorySidebar;
