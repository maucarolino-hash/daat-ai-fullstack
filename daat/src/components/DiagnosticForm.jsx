import { useState, useEffect, useRef } from 'react'
import SkeletonLoader from './SkeletonLoader'
import ComponentFeedback from './ComponentFeedback'
import { PDFDownloadLink } from '@react-pdf/renderer';
import DaatReportPDF from './DaatReportPDF';



// Componente Reutilizável para Inputs de Texto Longo
const TextAreaField = ({ label, value, onChange, placeholder, height = '100px' }) => (
    <div style={{
        marginBottom: '20px',
        width: '100%' // Garante que o container do campo respeite o pai
    }}>
        <label style={{
            display: 'block',
            marginBottom: '8px',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            fontWeight: '500'
        }}>
            {label}
        </label>

        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={{
                // --- A CORREÇÃO DE OURO ---
                width: '100%',
                maxWidth: '100%',        // Garante que nunca passa do limite
                boxSizing: 'border-box', // O padding agora fica DENTRO da caixa
                // --------------------------

                height: height,
                padding: '12px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                lineHeight: '1.5',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'Inter, sans-serif',
                overflowY: 'auto',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--brand-primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-light)'}
        />
    </div>
);

const DiagnosticForm = ({ initialData }) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null); // Limpa resultado anterior

        // 1. Preparar os dados do Daat
        const payload = { customerSegment, problem, valueProposition };

        try {
            // 2. A Chamada (Fetch API)
            const response = await fetch('https://daat-ai-fullstack.onrender.com/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            // 3. A Resposta
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error("Erro ao conectar ao Daat Brain:", error);
            alert("Erro de conexão. O servidor Django está rodando?");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '500px', margin: '0 auto' }}>
            <h2>Diagnóstico Lean Canvas</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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
                    style={{
                        marginTop: '10px',
                        width: '100%',
                        padding: '14px',
                        backgroundColor: 'var(--brand-primary)',
                        color: '#ffffff',
                        fontSize: '1rem',
                        fontWeight: '600',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1,
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = 'var(--brand-hover)')}
                    onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = 'var(--brand-primary)')}
                >
                    {loading ? 'Analisando...' : 'Gerar Diagnóstico'}
                </button>
            </form>

            {/* ÁREA DE RESULTADOS (Espaço Reservado) */}
            {/* O TERMINAL FIXO GRID */}
            <div className="daat-terminal" ref={terminalRef} style={{
                marginTop: '40px', // Espaçamento extra
                borderColor: loading ? '#4a5568' : (result ? (result.score > 60 ? '#48bb78' : '#fc8181') : '#4a5568'),
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)'
            }}>

                {/* ÁREA 1: HEADER (Fixo no topo da Grade) */}
                {/* Se tiver resultado, mostra o cabeçalho fixo. Se não, mostra nada ou loader */}
                {!loading && result && (
                    <div style={{
                        padding: '20px 24px 10px 24px',
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-card)',
                        zIndex: 10 // Garante que fica acima do scroll
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{
                                    width: '50px', height: '50px',
                                    borderRadius: '50%',
                                    backgroundColor: result.score > 60 ? '#38a169' : '#e53e3e',
                                    color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.4rem', fontWeight: 'bold'
                                }}>
                                    {result.score}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#e2e8f0' }}>Análise Daat</h3>
                                    <span style={{ fontSize: '0.8rem', color: '#718096' }}>IA Venture Capitalist</span>
                                </div>
                            </div>

                            {/* O NOVO BOTÃO DE DOWNLOAD */}
                            {/* Botão PDF via React-PDF */}
                            {result && (
                                <PDFDownloadLink
                                    document={
                                        <DaatReportPDF
                                            data={{
                                                ...result,
                                                customerSegment: customerSegment,
                                                problem: problem,
                                                valueProposition: valueProposition
                                            }}
                                        />
                                    }
                                    fileName={`Daat_Relatorio_${result.score}.pdf`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    {({ blob, url, loading, error }) => (
                                        <button
                                            disabled={loading}
                                            style={{
                                                padding: '8px 16px',
                                                backgroundColor: 'transparent',
                                                border: '1px solid var(--border-light)',
                                                borderRadius: '6px',
                                                color: loading ? 'var(--text-muted)' : 'var(--text-secondary)',
                                                cursor: loading ? 'wait' : 'pointer',
                                                fontSize: '0.85rem',
                                                display: 'flex', alignItems: 'center', gap: '8px',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <span>{loading ? '⏳' : '⬇️'}</span> {loading ? 'Gerando...' : 'PDF'}
                                        </button>
                                    )}
                                </PDFDownloadLink>
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
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e0' }}>
                            A aguardar dados...
                        </div>
                    )}

                    {/* RESULTADO (Texto) */}
                    {!loading && result && (
                        <div style={{ paddingBottom: '20px' }}> {/* Espaço extra no fim */}
                            <ComponentFeedback feedback={result.feedback} />
                        </div>
                    )}
                </div>

            </div>
        </div >
    )
}

export default DiagnosticForm
