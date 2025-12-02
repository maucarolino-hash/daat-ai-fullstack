import { useState, useEffect, useRef } from 'react'
import SkeletonLoader from './SkeletonLoader'
import ComponentFeedback from './ComponentFeedback'
import { pdf } from '@react-pdf/renderer';
import DaatReportPDF from './DaatReportPDF';
import api from '../services/api';
import './DiagnosticForm.css'; // Import styles safely

// Componente Reutilizável para Inputs de Texto Longo
const TextAreaField = ({ label, value, onChange, placeholder, height = '100px' }) => (
    <div className="input-group">
        <label className="input-label">
            {label}
        </label>

        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="input-textarea"
            style={{ height: height }} // Altura ainda pode ser dinâmica
        />
    </div>
);

const DiagnosticForm = ({ initialData, token, onAnalysisComplete }) => {
    const terminalRef = useRef(null); // Referência para o terminal
    // Estados dos inputs
    const [customerSegment, setCustomerSegment] = useState("");
    const [problem, setProblem] = useState("");
    const [valueProposition, setValueProposition] = useState("");

    // Estado do Resultado
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // MÁGICA DE SINCRONIZAÇÃO:
    // Sempre que "initialData" mudar (clique na sidebar), atualiza o formulário
    useEffect(() => {
        if (initialData) {
            // Modo Visualização: Preenche tudo com o histórico
            setCustomerSegment(initialData.customer_segment || "");
            setProblem(initialData.problem || "(Dados arquivados)"); // O modelo history light pode não ter tudo, ajuste conforme tua API
            setValueProposition(initialData.value_proposition || ""); // Se tua API /history não retorna os textos longos, terás de fazer outro fetch. 

            // Reconstrói o objeto de resultado para o Terminal mostrar
            setResult({
                score: initialData.score,
                feedback: initialData.feedback || "Feedback arquivado."
            });
        } else {
            // Modo Nova Análise: Limpa tudo
            setCustomerSegment("");
            setProblem("");
            setValueProposition("");
            setResult(null);
        }
    }, [initialData]);

    const [statusMessage, setStatusMessage] = useState(""); // Feedback para o usuário

    const pollTaskStatus = async (taskId) => {
        setStatusMessage("A IA está pesquisando concorrentes no mercado...");

        const intervalId = setInterval(async () => {
            try {
                const response = await api.get(`/api/status/${taskId}/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = response.data;

                if (data.status === 'completed') {
                    clearInterval(intervalId);
                    setLoading(false);
                    setResult(data.data);
                    setStatusMessage("");

                    if (onAnalysisComplete) {
                        onAnalysisComplete();
                    }
                } else if (data.status === 'failed') {
                    clearInterval(intervalId);
                    setLoading(false);
                    alert(`Erro na análise: ${data.error}`);
                    setStatusMessage("");
                } else {
                    // Ainda processando...
                    console.log("Processando...");
                }
            } catch (error) {
                clearInterval(intervalId);
                setLoading(false);
                console.error("Erro no polling:", error);
                alert("Erro ao verificar status da análise.");
            }
        }, 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- NOVA VALIDAÇÃO DE SEGURANÇA ---
        const minLength = 10; // Mínimo de caracteres aceitável
        if (
            customerSegment.length < minLength ||
            problem.length < minLength ||
            valueProposition.length < minLength
        ) {
            alert("⚠️ Dados Insuficientes.\n\nPor favor, escreva frases completas (mínimo 10 letras) para que a IA possa entender o seu negócio.");
            return; // Pára tudo aqui. Não envia para o servidor.
        }
        // -----------------------------------

        setLoading(true);
        setResult(null); // Limpa resultado anterior
        setStatusMessage("Enviando dados para o QG...");

        // 1. Preparar os dados do Daat
        const payload = { customerSegment, problem, valueProposition };

        try {
            // 2. A Chamada Inicial (POST)
            // Chama o endpoint público (mas envia token se tiver, para salvar histórico)
            const response = await api.post('/api/analyze-public', payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = response.data;

            // 3. Verifica se já acabou (Modo Eager ou muito rápido)
            if (data.status === 'completed') {
                setLoading(false);
                setResult(data.data);
                setStatusMessage("");
                if (onAnalysisComplete) onAnalysisComplete();
            }
            // 4. Se não, inicia o Polling com o ID da tarefa
            else if (data.task_id) {
                pollTaskStatus(data.task_id);
            } else {
                // Fallback para erro
                setLoading(false);
                alert("Erro: Não foi possível iniciar a análise.");
            }

        } catch (error) {
            console.error("Erro ao conectar ao Daat Brain:", error);
            if (error.response && error.response.status === 401) {
                alert("Sessão expirada. Por favor, faça login novamente.");
                window.location.reload();
            } else {
                alert("Erro de conexão. O servidor Django está rodando?");
            }
            setLoading(false);
        }
    };

    return (
        <div className="diagnostic-container">
            <h2>Diagnóstico Lean Canvas</h2>
            <form onSubmit={handleSubmit} className="diagnostic-form">
                <TextAreaField
                    label="Segmento de Cliente"
                    value={customerSegment}
                    onChange={(e) => setCustomerSegment(e.target.value)}
                    placeholder="Quem são seus clientes?"
                    height="80px"
                />

                <TextAreaField
                    label="O Problema"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="Qual problema você resolve?"
                    height="120px"
                />

                <TextAreaField
                    label="Proposta de Valor"
                    value={valueProposition}
                    onChange={(e) => setValueProposition(e.target.value)}
                    placeholder="Ex: Uber para passeadores de cães"
                    height="100px"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`btn-primary ${loading ? 'btn-loading' : ''}`}
                >
                    {loading ? (statusMessage || 'Analisando...') : 'Gerar Diagnóstico'}
                </button>
            </form>

            {/* ÁREA DE RESULTADOS (Espaço Reservado) */}
            {/* O TERMINAL FIXO GRID */}
            <div className={`daat-terminal ${loading ? 'loading' : ''} ${result ? (result.score > 60 ? 'score-good' : 'score-bad') : ''}`} ref={terminalRef}>

                {/* ÁREA 1: HEADER (Fixo no topo da Grade) */}
                {/* Se tiver resultado, mostra o cabeçalho fixo. Se não, mostra nada ou loader */}
                {!loading && result && (
                    <div className="terminal-header">
                        <div className="terminal-header-content">
                            <div className="score-display">
                                <div className={`score-circle ${result.score > 60 ? 'good' : 'bad'}`}>
                                    {result.score}
                                </div>
                                <div>
                                    <h3 className="score-title">Análise Daat</h3>
                                    <span className="score-subtitle">IA Venture Capitalist</span>
                                </div>
                            </div>

                            {/* O NOVO BOTÃO DE DOWNLOAD (Programático) */}
                            {result && (
                                <button
                                    className="btn-download"
                                    onClick={async () => {
                                        try {
                                            const blob = await pdf(
                                                <DaatReportPDF
                                                    data={{
                                                        ...result,
                                                        customerSegment: customerSegment,
                                                        problem: problem,
                                                        valueProposition: valueProposition
                                                    }}
                                                />
                                            ).toBlob();

                                            // Forçar o tipo MIME para garantir a extensão
                                            const pdfBlob = new Blob([blob], { type: 'application/pdf' });
                                            const url = URL.createObjectURL(pdfBlob);

                                            const link = document.createElement('a');
                                            link.href = url;
                                            const filename = `Daat_Relatorio_${result.score}.pdf`;
                                            link.download = filename;

                                            console.log("Baixando:", filename); // Debug

                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                            URL.revokeObjectURL(url);
                                        } catch (error) {
                                            console.error("Erro ao gerar PDF:", error);
                                            alert("Erro ao gerar o PDF.");
                                        }
                                    }}
                                >
                                    <span>⬇️</span> PDF
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* ÁREA 2: CONTEÚDO (Scrollável) */}
                {/* O Grid vai jogar isso para a segunda linha (minmax 1fr) */}
                <div className="daat-content-scroll">

                    {/* LOADING STATE */}
                    {loading && <SkeletonLoader />}

                    {/* EMPTY STATE */}
                    {!loading && !result && (
                        <div className="empty-state">
                            A aguardar dados...
                        </div>
                    )}

                    {/* RESULTADO (Texto) */}
                    {!loading && result && (
                        <div className="result-content">
                            <ComponentFeedback feedback={result.feedback} />
                        </div>
                    )}
                </div>

            </div>
        </div >
    )
}

export default DiagnosticForm
