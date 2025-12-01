import React, { useEffect, useState } from 'react';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

// Recebemos as funções do Pai via PROPS
const HistorySidebar = ({ onSelectReport, onNewAnalysis, token, onLogout, refreshTrigger }) => {
    const [history, setHistory] = useState([]);

    const fetchHistory = () => {
        if (!token) return;

        api.get('/api/history', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                const data = response.data;
                if (data && Array.isArray(data)) {
                    setHistory(data);
                } else if (data && data.history) {
                    setHistory(data.history);
                } else {
                    setHistory([]);
                }
            })
            .catch(err => {
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    onLogout();
                }
                console.error("Erro no histórico:", err);
            });
    };

    useEffect(() => {
        fetchHistory();
    }, [token, onLogout, refreshTrigger]);

    const handleDelete = async (e, id) => {
        e.stopPropagation(); // Impede que o clique selecione o relatório
        if (!window.confirm("Tem certeza que deseja excluir esta análise?")) return;

        try {
            await api.delete(`/api/history/${id}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            toast.success("Análise excluída com sucesso!");
            fetchHistory(); // Atualiza a lista
        } catch (error) {
            console.error("Erro ao excluir:", error);
            toast.error("Erro ao excluir análise.");
        }
    };

    return (
        <div className="sidebar-container">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Botão NOVA ANÁLISE (Fixo no topo) */}
            <div className="sidebar-header">
                <button
                    onClick={onNewAnalysis}
                    className="btn-new-analysis"
                >
                    <span>+</span> Nova Análise
                </button>
            </div>

            <div className="sidebar-section-title">
                <h2>Recentes</h2>
            </div>

            <div className="history-list-container">
                {history.length === 0 ? (
                    <p className="history-empty">Vazio.</p>
                ) : (
                    <ul className="history-list">
                        {history.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => onSelectReport(item)}
                                className="history-item"
                            >
                                <div className="history-item-header">
                                    <span className="history-date">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                    <span className={`history-score ${item.score > 60 ? 'good' : 'bad'}`}>
                                        {item.score}
                                    </span>
                                </div>
                                <div className="history-title">
                                    {item.customer_segment || "Untitled"}
                                </div>
                                <button
                                    className="btn-delete-history"
                                    onClick={(e) => handleDelete(e, item.id)}
                                    title="Excluir análise"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Botão de Logout (Rodapé da Sidebar) */}
            <div className="sidebar-footer">
                <button
                    onClick={onLogout}
                    className="btn-sidebar-logout"
                >
                    Sair da Conta
                </button>
            </div>
        </div>
    );
};

export default HistorySidebar;
