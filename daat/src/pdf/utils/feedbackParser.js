/**
 * Parser de Feedback da IA
 * Extrai seções estruturadas do formato [SEÇÃO X: TITULO]
 */

/**
 * Extrai métricas quantitativas do texto
 */
export const extractMetrics = (text) => {
    const metrics = {};

    if (!text) return metrics;

    // Extrai valores monetários (R$, US$, bilhões, milhões)
    const moneyRegex = /(?:R\$|US\$)\s*(\d+(?:[.,]\d+)?)\s*(bilh[õo]es?|milh[õo]es?|mil)?/gi;
    const moneyMatches = [...text.matchAll(moneyRegex)];
    if (moneyMatches.length > 0) {
        metrics.marketSize = moneyMatches[0][0];
    }

    // Extrai percentuais (%, CAGR, crescimento)
    const percentRegex = /(\d+(?:[.,]\d+)?)\s*%\s*(?:ao ano|CAGR|crescimento)?/gi;
    const percentMatches = [...text.matchAll(percentRegex)];
    if (percentMatches.length > 0) {
        metrics.growthRate = percentMatches[0][0];
    }

    // Extrai número de concorrentes
    const competitorRegex = /(\d+)\s*(?:concorrentes?|empresas?|players?)\s*(?:diretos?|identificados?)?/gi;
    const competitorMatches = [...text.matchAll(competitorRegex)];
    if (competitorMatches.length > 0) {
        metrics.competitorCount = parseInt(competitorMatches[0][1]);
    }

    // Extrai potenciais clientes
    const clientRegex = /(\d+(?:[.,]\d+)?)\s*(?:mil|k)?\s*(?:potenciais\s*)?(?:clientes?|empresas?|aceleradoras?)/gi;
    const clientMatches = [...text.matchAll(clientRegex)];
    if (clientMatches.length > 0) {
        metrics.potentialCustomers = clientMatches[0][0];
    }

    return metrics;
};

export const parseFeedback = (text) => {
    const sections = {
        mercado: "",
        forcas: [],
        riscos: [],
        conselho: "",
        metrics: {},
        raw: text
    };

    if (!text) return sections;

    // Extrai métricas quantitativas
    sections.metrics = extractMetrics(text);

    // Regex para pegar os blocos [SEÇÃO X: TITULO] ... conteudo ...
    // O regex procura por [SEÇÃO e captura até a próxima [SEÇÃO ou fim do texto
    // Regex mais flexível para pegar os blocos [SEÇÃO X] ou [SEÇÃO X: Título]
    // Captura: (Grupo 1: Número), (Grupo 2: Conteúdo)
    const regex = /\[SEÇÃO\s*(\d+)[^\]]*\]([\s\S]*?)(?=\[SEÇÃO|$)/gi;
    let match;
    let foundAny = false;

    while ((match = regex.exec(text)) !== null) {
        foundAny = true;
        const sectionNum = match[1];

        // Limpeza avançada do conteúdo
        let content = match[2].trim();

        // 1. Remove qualquer tag [SEÇÃO...] que tenha ficado dentro do conteúdo capturado
        content = content.replace(/\[SEÇÃO\s*\d+[^\]]*\]/gi, '');

        // 2. Remove o título se repetido no início (Ex: "Análise de Mercado:\nO mercado...")
        const titleRegex = /^(análise de mercado|forças|riscos|conselho|estratégia)[^:\n]*:?\s*/i;
        content = content.replace(titleRegex, '');

        // 3. Limpa Markdown
        content = content
            .replace(/\*\*/g, '')          // Remove negrito
            .replace(/^#+\s+/gm, '')       // Remove headers markdown
            .replace(/^\s*-\s*/gm, '• ')   // Padroniza bullets
            .trim();

        if (sectionNum === "1") {
            sections.mercado = content;
        } else if (sectionNum === "2") {
            sections.forcas = content.split('\n')
                .map(l => l.trim())
                .filter(l => l.length > 2)
                .map(l => l.startsWith('•') ? l.substring(1).trim() : l);
        } else if (sectionNum === "3") {
            sections.riscos = content.split('\n')
                .map(l => l.trim())
                .filter(l => l.length > 2)
                .map(l => l.startsWith('•') ? l.substring(1).trim() : l);
        } else if (sectionNum === "4") {
            sections.conselho = content;
        }
    }

    // Fallback: Se não encontrou NENHUMA seção, assume que o texto inteiro é o relatório não formatado
    // e tenta distribuir de forma inteligente ou apenas mostra no primeiro bloco.
    if (!foundAny) {
        sections.mercado = text || "Conteúdo não disponível.";
    }

    return sections;
};
