/**
 * Serviço de Geração de PDF
 * Encapsula toda a lógica de geração e download de PDF com lazy loading e cache
 */

// Cache em memória para PDFs gerados
const pdfCache = new Map();

/**
 * Gera chave única para cache baseada nos dados do PDF
 */
const generateCacheKey = (result, customerSegment, problem, valueProposition, theme) => {
    return JSON.stringify({
        score: result.score,
        feedback: result.feedback?.substring(0, 100), // Apenas primeiros 100 chars
        customerSegment,
        problem,
        valueProposition,
        theme
    });
};

/**
 * Faz download de um blob PDF
 */
const downloadBlob = (blob, score) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = `Daat_Relatorio_${score}.pdf`;
    link.download = filename;

    console.log("📄 Baixando PDF:", filename);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Gera e faz download do PDF do relatório Daat
 * @param {Object} result - Resultado da análise (score, feedback)
 * @param {string} customerSegment - Segmento de cliente
 * @param {string} problem - Problema identificado
 * @param {string} valueProposition - Proposta de valor
 * @param {string} theme - Tema do PDF ('professional', 'dark', 'colorful', 'minimal')
 * @param {boolean} forceRegenerate - Se true, ignora cache e regenera PDF
 */
export async function generatePDF(result, customerSegment, problem, valueProposition, theme = 'professional', forceRegenerate = false) {
    try {
        console.log(`🎨 Gerando PDF com tema: ${theme}`);

        // Verificar cache (se não for regeneração forçada)
        // DESABILITADO TEMPORARIAMENTE PARA GARANTIR VERSÃO MAIS RECENTE
        /*
        if (!forceRegenerate) {
            const cacheKey = generateCacheKey(result, customerSegment, problem, valueProposition, theme);

            if (pdfCache.has(cacheKey)) {
                console.log('📦 Usando PDF do cache (economia de processamento)');
                const cachedBlob = pdfCache.get(cacheKey);
                downloadBlob(cachedBlob, result.score);
                return;
            }
        }
        */

        // Lazy load do @react-pdf/renderer (code splitting automático)
        const { pdf } = await import('@react-pdf/renderer');

        // Lazy load do componente DaatReportPDF
        const { default: DaatReportPDF } = await import('../components/DaatReportPDF');

        // Importa React dinamicamente para JSX
        const React = await import('react');

        // Gera o PDF
        const blob = await pdf(
            React.createElement(DaatReportPDF, {
                data: {
                    ...result,
                    customerSegment,
                    problem,
                    valueProposition
                },
                theme: theme
            })
        ).toBlob();

        // Força o tipo MIME para garantir a extensão .pdf
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });

        // Salvar no cache
        const cacheKey = generateCacheKey(result, customerSegment, problem, valueProposition, theme);
        pdfCache.set(cacheKey, pdfBlob);
        console.log('💾 PDF salvo no cache');

        // Download
        downloadBlob(pdfBlob, result.score);

        console.log("✅ PDF baixado com sucesso!");
    } catch (error) {
        console.error("❌ Erro ao gerar PDF:", error);
        alert("Erro ao gerar o PDF. Por favor, tente novamente.");
        throw error;
    }
}

/**
 * Limpa o cache de PDFs
 */
export function clearPdfCache() {
    pdfCache.clear();
    console.log('🗑️ Cache de PDFs limpo');
}
