import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Registrar Fonte (Opcional, usando Helvetica padrão por enquanto para garantir compatibilidade)
// Font.register({ family: 'Inter', src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.ttf' });

const colors = {
    primary: '#111827',   // Dark Navy (Profissional)
    accent: '#2563EB',    // Royal Blue
    success: '#059669',   // Emerald
    warning: '#D97706',   // Amber
    danger: '#DC2626',    // Red
    text: '#374151',      // Gray 700
    lightBg: '#F3F4F6',   // Gray 100
    white: '#FFFFFF'
};

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#FFFFFF', fontSize: 11, color: colors.text, lineHeight: 1.5 },

    // HEADER & COVER
    coverContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    brandTitle: { fontSize: 14, color: colors.text, letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' },
    reportTitle: { fontSize: 32, color: colors.primary, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },

    // SCORE BADGE
    scoreBadge: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    scoreValue: { fontSize: 48, color: colors.white, fontWeight: 'bold' },
    scoreLabel: { fontSize: 10, color: colors.white, textTransform: 'uppercase' },

    // CONTEXT BOX
    contextBox: { width: '100%', backgroundColor: colors.lightBg, padding: 20, borderRadius: 8, marginBottom: 30 },
    contextLabel: { fontSize: 10, color: colors.accent, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
    contextText: { fontSize: 12, color: colors.primary, marginBottom: 12 },

    // SECTIONS
    sectionHeader: { fontSize: 16, color: colors.primary, fontWeight: 'bold', borderBottomWidth: 2, borderBottomColor: colors.accent, paddingBottom: 6, marginBottom: 14, marginTop: 20 },
    subHeader: { fontSize: 12, color: colors.accent, fontWeight: 'bold', marginTop: 10, marginBottom: 4 },
    paragraph: { marginBottom: 10, textAlign: 'justify' },
    bulletPoint: { flexDirection: 'row', marginBottom: 6 },
    bulletDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.accent, marginRight: 8, marginTop: 6 },
    bulletText: { flex: 1 },

    // CARDS (SWOT)
    grid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    column: { width: '48%' },
    card: { padding: 12, borderRadius: 6, marginBottom: 10 },
    cardGreen: { backgroundColor: '#ECFDF5', borderLeftWidth: 3, borderLeftColor: colors.success },
    cardRed: { backgroundColor: '#FEF2F2', borderLeftWidth: 3, borderLeftColor: colors.danger },

    // FOOTERS
    footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#9CA3AF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10 }
});

// Helper: Extrai seções do novo formato [SEÇÃO X]
const parseFeedback = (text) => {
    const sections = {
        mercado: "",
        forcas: [],
        riscos: [],
        conselho: "",
        raw: text
    };

    if (!text) return sections;

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
        const content = match[2].trim();

        if (sectionNum === "1") {
            sections.mercado = content.replace(/\*\*/g, '');
        } else if (sectionNum === "2") {
            sections.forcas = content.split('\n')
                .map(l => l.trim())
                .filter(l => /^[-\u2022*]/.test(l))
                .map(l => l.replace(/^[-\u2022*]\s*/, '').replace(/\*\*/g, ''));
        } else if (sectionNum === "3") {
            sections.riscos = content.split('\n')
                .map(l => l.trim())
                .filter(l => /^[-\u2022*]/.test(l))
                .map(l => l.replace(/^[-\u2022*]\s*/, '').replace(/\*\*/g, ''));
        } else if (sectionNum === "4") {
            sections.conselho = content.replace(/\*\*/g, '');
        }
    }

    // Fallback: Se não encontrou NENHUMA seção, assume que o texto inteiro é o relatório não formatado
    // e tenta distribuir de forma inteligente ou apenas mostra no primeiro bloco.
    if (!foundAny) {
        sections.mercado = text || "Conteúdo não disponível.";
    }

    return sections;
};

const DaatReportPDF = ({ data }) => {
    if (!data) return null;

    const sections = parseFeedback(data.feedback);
    const score = data.score || 0;

    // Lógica para cor do score
    let scoreColor = colors.danger;
    let viabilityText = "BAIXA VIABILIDADE";
    if (score >= 40) { scoreColor = colors.warning; viabilityText = "MÉDIA VIABILIDADE"; }
    if (score >= 60) { scoreColor = colors.success; viabilityText = "ALTA VIABILIDADE"; }
    if (score >= 80) { scoreColor = colors.accent; viabilityText = "ALTÍSSIMA VIABILIDADE"; }

    return (
        <Document>
            {/* PAGINA 1: CAPA & CONTEXTO */}
            <Page size="A4" style={styles.page}>
                <View style={styles.coverContainer}>
                    <Text style={styles.brandTitle}>DAAT INTELLIGENCE SYSTEM</Text>
                    <Text style={styles.reportTitle}>Relatório de Viabilidade</Text>

                    <View style={[styles.scoreBadge, { backgroundColor: scoreColor }]}>
                        <Text style={styles.scoreValue}>{score}</Text>
                        <Text style={styles.scoreLabel}>Score</Text>
                    </View>
                    <Text style={{ fontSize: 14, color: scoreColor, fontWeight: 'bold', marginBottom: 40, letterSpacing: 2 }}>
                        {viabilityText}
                    </Text>
                </View>

                <View style={styles.contextBox}>
                    <Text style={styles.contextLabel}>O PROBLEMA</Text>
                    <Text style={styles.contextText}>{data.problem || "Não informado"}</Text>

                    <Text style={styles.contextLabel}>A SOLUÇÃO (Proposta de Valor)</Text>
                    <Text style={styles.contextText}>{data.valueProposition || "Não informado"}</Text>

                    <Text style={styles.contextLabel}>SEGMENTO ALVO</Text>
                    <Text style={{ fontSize: 12, color: colors.text }}>{data.customerSegment || "Não informado"}</Text>
                </View>

                <Text style={styles.footer}>DAAT AI Solutions • Intelligence tailored for startups validation.</Text>
            </Page>

            {/* PAGINA 2: ANÁLISE DE MERCADO & SWOT */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionHeader}>1. Análise de Mercado</Text>
                <Text style={styles.paragraph}>{sections.mercado}</Text>

                <View style={styles.grid}>
                    <View style={styles.column}>
                        <Text style={styles.sectionHeader}>2. Forças & Potencial</Text>
                        <View style={styles.cardGreen}>
                            {sections.forcas.length > 0 ? sections.forcas.map((item, i) => (
                                <View key={i} style={styles.bulletPoint}>
                                    <View style={[styles.bulletDot, { backgroundColor: colors.success }]} />
                                    <Text style={styles.bulletText}>{item}</Text>
                                </View>
                            )) : <Text style={styles.paragraph}>Nenhum ponto forte destacado.</Text>}
                        </View>
                    </View>

                    <View style={styles.column}>
                        <Text style={[styles.sectionHeader, { color: colors.danger, borderBottomColor: colors.danger }]}>3. Riscos Críticos</Text>
                        <View style={styles.cardRed}>
                            {sections.riscos.length > 0 ? sections.riscos.map((item, i) => (
                                <View key={i} style={styles.bulletPoint}>
                                    <View style={[styles.bulletDot, { backgroundColor: colors.danger }]} />
                                    <Text style={styles.bulletText}>{item}</Text>
                                </View>
                            )) : <Text style={styles.paragraph}>Nenhum risco crítico destacado.</Text>}
                        </View>
                    </View>
                </View>

                <Text style={styles.footer}>DAAT AI Solutions • Confidential Report</Text>
            </Page>

            {/* PAGINA 3: ESTRATÉGIA */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionHeader}>4. Conselho Estratégico (Roadmap)</Text>

                <View style={{ marginBottom: 20 }}>
                    <Text style={styles.paragraph}>{sections.conselho}</Text>
                </View>

                <View style={{ marginTop: 50, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 20 }}>
                    <Text style={{ fontSize: 10, color: colors.text, fontStyle: 'italic', textAlign: 'center' }}>
                        "A inovação distingue um líder de um seguidor."
                    </Text>
                </View>

                <Text style={styles.footer}>
                    Isenção de responsabilidade: Este relatório foi gerado por IA.
                    As informações de mercado (Fase 1) são baseadas em dados públicos.
                    Decisões de investimento devem ser validadas por diligência humana.
                </Text>
            </Page>
        </Document>
    );
};

export default DaatReportPDF;
