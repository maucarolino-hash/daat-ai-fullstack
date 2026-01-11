/**
 * Serviço de Geração de Excel
 * Exporta dados do relatório Daat em formato Excel (.xlsx)
 */
import * as XLSX from 'xlsx';

/**
 * Gera e faz download de arquivo Excel com os dados do relatório
 * @param {Object} result - Resultado da análise (score, feedback, structured data)
 * @param {string} customerSegment - Segmento de cliente
 * @param {string} problem - Problema identificado
 * @param {string} valueProposition - Proposta de valor
 */
export async function generateExcel(result, customerSegment, problem, valueProposition) {
    try {
        console.log('📊 Gerando arquivo Excel...');

        // Use structured data if available, otherwise fallback
        const sections = {
            mercado: result.marketData?.trends?.join('\n') || result.sections?.mercado || "Dados de mercado estruturados disponíveis no relatório PDF.",
            forcas: result.riskAssessment?.strengths?.map(s => s.title) || result.sections?.forcas || [],
            riscos: result.riskAssessment?.risks?.map(r => r.title) || result.sections?.riscos || [],
            conselho: result.strategicAdvice?.quickWins?.join('\n') || result.sections?.conselho || "Ver plano de ação detalhado no PDF online."
        };

        // Criar novo workbook
        const workbook = XLSX.utils.book_new();

        // ABA 1: Resumo Executivo
        const summaryData = [
            ['DAAT AI - RELATÓRIO DE VIABILIDADE'],
            [],
            ['Score de Viabilidade', result.score || result.scoreBreakdown?.totalScore],
            ['Status', (result.score || result.scoreBreakdown?.totalScore) >= 60 ? 'ALTA VIABILIDADE' : (result.score || result.scoreBreakdown?.totalScore) >= 40 ? 'MÉDIA VIABILIDADE' : 'BAIXA VIABILIDADE'],
            [],
            ['INFORMAÇÕES DO NEGÓCIO'],
            ['Segmento de Cliente', customerSegment],
            ['Problema', problem],
            ['Proposta de Valor', valueProposition],
        ];

        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

        // Estilizar (largura das colunas)
        summarySheet['!cols'] = [
            { wch: 25 },  // Coluna A
            { wch: 80 }   // Coluna B
        ];

        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');

        // ABA 2: Análise de Mercado
        const marketData = [
            ['ANÁLISE DE MERCADO'],
            [],
            ['TAM', result.marketData?.tam || 'N/A'],
            ['Crescimento', result.marketData?.growthRate + '%' || 'N/A'],
            [],
            ['Concorrentes Identificados', (result.competitors?.length || 0) + ' Players'],
            [],
            [sections.mercado]
        ];

        const marketSheet = XLSX.utils.aoa_to_sheet(marketData);
        marketSheet['!cols'] = [{ wch: 100 }];
        XLSX.utils.book_append_sheet(workbook, marketSheet, 'Mercado');

        // ABA 3: SWOT (Forças e Riscos)
        const swotData = [
            ['FORÇAS E POTENCIAL'],
            []
        ];

        if (sections.forcas.length > 0) {
            sections.forcas.forEach((item, index) => {
                swotData.push([`${index + 1}.`, item]);
            });
        } else {
            swotData.push(['', 'Nenhum ponto forte destacado']);
        }

        swotData.push([]);
        swotData.push(['RISCOS CRÍTICOS']);
        swotData.push([]);

        if (sections.riscos.length > 0) {
            sections.riscos.forEach((item, index) => {
                swotData.push([`${index + 1}.`, item]);
            });
        } else {
            swotData.push(['', 'Nenhum risco crítico destacado']);
        }

        const swotSheet = XLSX.utils.aoa_to_sheet(swotData);
        swotSheet['!cols'] = [
            { wch: 5 },   // Coluna de numeração
            { wch: 90 }   // Coluna de conteúdo
        ];
        XLSX.utils.book_append_sheet(workbook, swotSheet, 'SWOT');

        // ABA 4: Conselho Estratégico
        const adviceData = [
            ['CONSELHO ESTRATÉGICO (ROADMAP)'],
            [],
            [sections.conselho]
        ];

        const adviceSheet = XLSX.utils.aoa_to_sheet(adviceData);
        adviceSheet['!cols'] = [{ wch: 100 }];
        XLSX.utils.book_append_sheet(workbook, adviceSheet, 'Estratégia');

        // ABA 5: Feedback Completo (Raw)
        // If feedback is an object (JSON), stringify it.
        const feedbackText = typeof result.feedback === 'object' ? JSON.stringify(result.feedback, null, 2) : result.feedback;

        const rawData = [
            ['FEEDBACK COMPLETO DA IA'],
            [],
            [feedbackText || 'Não disponível']
        ];

        const rawSheet = XLSX.utils.aoa_to_sheet(rawData);
        rawSheet['!cols'] = [{ wch: 120 }];
        XLSX.utils.book_append_sheet(workbook, rawSheet, 'Feedback Completo');

        // Gerar e baixar arquivo
        const filename = `Daat_Relatorio_${result.score || result.scoreBreakdown?.totalScore}.xlsx`;
        XLSX.writeFile(workbook, filename);

        console.log(`✅ Excel gerado: ${filename}`);
    } catch (error) {
        console.error('❌ Erro ao gerar Excel:', error);
        alert('Erro ao gerar o arquivo Excel. Por favor, tente novamente.');
        throw error;
    }
}
