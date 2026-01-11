import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Cores do Design System
const colors = {
    primary: '#111827',   // Dark Navy
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

    // --- HEADER & CAPA ---
    headerContainer: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 15 },
    brandTitle: { fontSize: 10, color: '#9CA3AF', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
    reportTitle: { fontSize: 24, color: colors.primary, fontWeight: 'bold', textTransform: 'uppercase' },

    // Visual do Score (Barra)
    scoreContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    scoreLabel: { fontSize: 12, color: colors.text, marginRight: 8, fontWeight: 'bold' },
    scoreValueBox: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4 },
    scoreValueText: { color: colors.white, fontWeight: 'bold', fontSize: 14 },
    viabilityText: { marginLeft: 10, fontSize: 12, fontWeight: 'bold' },

    // CONTEXT BOX
    contextBox: { width: '100%', backgroundColor: colors.lightBg, padding: 15, borderRadius: 6, marginBottom: 20 },
    contextLabel: { fontSize: 9, color: colors.accent, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 },
    contextText: { fontSize: 11, color: colors.primary, marginBottom: 10 },

    // SECTIONS & CARDS
    sectionHeader: { fontSize: 14, color: colors.primary, fontWeight: 'bold', borderBottomWidth: 2, borderBottomColor: colors.accent, paddingBottom: 4, marginBottom: 10, marginTop: 15 },
    paragraph: { marginBottom: 8, textAlign: 'justify', fontSize: 10 },

    // Grid System
    grid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
    column: { width: '48%' },

    // Card Styles
    card: { padding: 10, borderRadius: 6, marginBottom: 5 },

    // Bullet Points
    bulletPoint: { flexDirection: 'row', marginBottom: 4 },
    bulletDot: { width: 4, height: 4, borderRadius: 2, marginRight: 6, marginTop: 5 },
    bulletText: { flex: 1, fontSize: 10 },

    // FOOTERS
    footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#9CA3AF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10 }
});

// --- HELPER FUNCTIONS ---

const cleanText = (text) => {
    if (!text) return "";
    return text.replace(/\*\*/g, '').trim();
};

// --- CORREÇÃO CRÍTICA AQUI ---
const parseFeedback = (text) => {
    const sections = {
        mercado: "",
        forcas: [],
        riscos: [],
        conselho: "",
    };

    if (!text) return sections;

    // CORREÇÃO: Adicionei '?' após o '\]' para tornar o fecha-colchetes opcional.
    // Também adicionei '[^\]\n]*' para garantir que ele pega a linha mesmo sem fechar.
    // 1. Limpeza e Normalização Avançada
    let normalize = text || "";

    // Corrige typos comuns da IA
    normalize = normalize
        .replace(/\[EÇÃO/gi, '[SEÇÃO')
        .replace(/\[Seção/gi, '[SEÇÃO')
        .replace(/\[SECTION/gi, '[SEÇÃO');

    // Substitui marcadores por splitter seguro
    normalize = normalize
        .replace(/\[SEÇÃO\s*1[^\]\n]*\]?/gi, '###SPLIT###1|')
        .replace(/\[SEÇÃO\s*2[^\]\n]*\]?/gi, '###SPLIT###2|')
        .replace(/\[SEÇÃO\s*3[^\]\n]*\]?/gi, '###SPLIT###3|')
        .replace(/\[SEÇÃO\s*4[^\]\n]*\]?/gi, '###SPLIT###4|');


    const parts = normalize.split('###SPLIT###');

    parts.forEach(part => {
        if (part.startsWith('1|')) {
            sections.mercado = cleanText(part.replace('1|', ''));
        } else if (part.startsWith('2|')) {
            const content = part.replace('2|', '');
            sections.forcas = content.split('\n')
                .map(l => cleanText(l))
                .filter(l => /^[-\u2022*]/.test(l) || l.length > 5)
                .map(l => l.replace(/^[-\u2022*]\s*/, ''));
        } else if (part.startsWith('3|')) {
            const content = part.replace('3|', '');
            sections.riscos = content.split('\n')
                .map(l => cleanText(l))
                .filter(l => /^[-\u2022*]/.test(l) || l.length > 5)
                .map(l => l.replace(/^[-\u2022*]\s*/, ''));
        } else if (part.startsWith('4|')) {
            sections.conselho = cleanText(part.replace('4|', ''));
        }
    });

    if (!sections.mercado && !sections.forcas.length) {
        sections.mercado = text;
    }

    return sections;
};

// --- COMPONENTES ---

const AnalysisCard = ({ title, items, color, bgColor, emptyMessage }) => {
    return (
        <View style={styles.column}>
            <Text style={[styles.sectionHeader, { color: color, borderBottomColor: color, fontSize: 12 }]}>
                {title}
            </Text>
            <View style={[styles.card, { backgroundColor: bgColor, borderLeftWidth: 3, borderLeftColor: color }]}>
                {items.length > 0 ? (
                    items.map((item, i) => (
                        <View key={i} style={styles.bulletPoint}>
                            <View style={[styles.bulletDot, { backgroundColor: color }]} />
                            <Text style={styles.bulletText}>{item}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.paragraph}>{emptyMessage}</Text>
                )}
            </View>
        </View>
    );
};

const ChartSection = ({ breakdown }) => {
    // Se não houver dados, retorna null para não ocupar espaço
    if (!breakdown) return null;

    const marketScore = breakdown.market_opportunity?.score || 0;
    const marketPct = Math.min(100, (marketScore / 30) * 100);

    const compScore = breakdown.competitive_position?.score || 0;
    const compPct = Math.min(100, (compScore / 30) * 100);

    const execScore = breakdown.execution_viability?.score || 0;
    const execPct = Math.min(100, (execScore / 25) * 100);

    const riskScore = Math.abs(breakdown.risk_adjustment?.score || 0);
    const riskPct = Math.min(100, (riskScore / 15) * 100);

    const BarRow = ({ label, value, max, percentage, color }) => (
        <View style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                <Text style={{ fontSize: 10, color: colors.text, fontWeight: 'bold' }}>{label}</Text>
                <Text style={{ fontSize: 10, color: color, fontWeight: 'bold' }}>{value}/{max} pts</Text>
            </View>
            <View style={{ height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${percentage}%`, backgroundColor: color }} />
            </View>
        </View>
    );

    return (
        <View style={{ marginTop: 20, marginBottom: 20, padding: 15, backgroundColor: '#F9FAFB', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' }}>
            <Text style={{ fontSize: 12, color: colors.primary, fontWeight: 'bold', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 5 }}>
                Detalhamento do Score
            </Text>

            <BarRow label="Oportunidade de Mercado" value={marketScore} max={30} percentage={marketPct} color={colors.accent} />
            <BarRow label="Posição Competitiva" value={compScore} max={30} percentage={compPct} color={colors.success} />
            <BarRow label="Viabilidade de Execução" value={execScore} max={25} percentage={execPct} color={colors.warning} />
            <BarRow label="Impacto de Riscos" value={`-${riskScore}`} max={-15} percentage={riskPct} color={colors.danger} />
        </View>
    );
};

const DaatReportPDF = ({ data }) => {
    if (!data) return null;

    const sections = parseFeedback(data.feedback);
    const score = data.score || 0;

    let scoreColor = colors.danger;
    let viabilityText = "BAIXA VIABILIDADE";
    if (score >= 40) { scoreColor = colors.warning; viabilityText = "MÉDIA VIABILIDADE"; }
    if (score >= 60) { scoreColor = colors.success; viabilityText = "ALTA VIABILIDADE"; }
    if (score >= 80) { scoreColor = colors.accent; viabilityText = "ALTÍSSIMA VIABILIDADE"; }

    return (
        <Document>
            {/* PÁGINA 1: CAPA, SCORE & CONTEXTO */}
            <Page size="A4" style={styles.page}>

                <View style={styles.headerContainer}>
                    <Text style={styles.brandTitle}>DAAT INTELLIGENCE SYSTEM</Text>
                    <Text style={styles.reportTitle}>Relatório de Viabilidade</Text>

                    <View style={styles.scoreContainer}>
                        <Text style={styles.scoreLabel}>DAAT SCORE:</Text>
                        <View style={[styles.scoreValueBox, { backgroundColor: scoreColor }]}>
                            <Text style={styles.scoreValueText}>{score}/100</Text>
                        </View>
                        <Text style={[styles.viabilityText, { color: scoreColor }]}>
                            {viabilityText}
                        </Text>
                    </View>
                </View>

                <View style={styles.contextBox}>
                    <Text style={styles.contextLabel}>O PROBLEMA</Text>
                    <Text style={styles.contextText}>{data.problem || "Não informado"}</Text>

                    <Text style={styles.contextLabel}>A SOLUÇÃO</Text>
                    <Text style={styles.contextText}>{data.valueProposition || "Não informado"}</Text>

                    <Text style={styles.contextLabel}>SEGMENTO ALVO</Text>
                    <Text style={{ fontSize: 10, color: colors.text }}>{data.customerSegment || "Não informado"}</Text>
                </View>

                {/* Gráfico de Barras */}
                <ChartSection breakdown={data.scoreBreakdown || data.score_breakdown} />

                <Text style={styles.footer}>DAAT AI Solutions • Intelligence tailored for startups validation.</Text>
            </Page>

            {/* PÁGINA 2: ANÁLISE COMPLETA */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionHeader}>1. Análise de Mercado</Text>
                <Text style={styles.paragraph}>{sections.mercado}</Text>

                <View style={styles.grid}>
                    <AnalysisCard
                        title="2. Forças & Potencial"
                        items={sections.forcas}
                        color={colors.success}
                        bgColor="#ECFDF5"
                        emptyMessage="A análise não destacou pontos fortes específicos."
                    />

                    <AnalysisCard
                        title="3. Riscos Críticos"
                        items={sections.riscos}
                        color={colors.danger}
                        bgColor="#FEF2F2"
                        emptyMessage="A análise não destacou riscos críticos específicos."
                    />
                </View>

                <Text style={styles.footer}>DAAT AI Solutions • Confidential Report</Text>
            </Page>

            {/* PÁGINA 3: ESTRATÉGIA */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionHeader}>4. Conselho Estratégico (Roadmap)</Text>

                <View style={{ marginBottom: 20 }}>
                    <Text style={styles.paragraph}>{sections.conselho}</Text>
                </View>

                <View style={{ marginTop: 40, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 15 }}>
                    <Text style={{ fontSize: 9, color: colors.text, fontStyle: 'italic', textAlign: 'center' }}>
                        "A inovação distingue um líder de um seguidor."
                    </Text>
                </View>

                <Text style={styles.footer}>
                    Isenção de responsabilidade: Este relatório foi gerado por IA.
                    Decisões de investimento devem ser validadas por diligência humana.
                </Text>
            </Page>
        </Document>
    );
};

export default DaatReportPDF;
