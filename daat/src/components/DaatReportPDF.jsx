import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Cores do Daat AI (Dark/Professional Theme adaptado para fundo branco de papel)
const colors = {
    primary: '#2563EB',   // Azul Royal
    success: '#16A34A',   // Verde Escuro (Sucesso)
    warning: '#D97706',   // Ambar/Laranja (Alerta)
    danger: '#DC2626',    // Vermelho (Perigo)
    dark: '#111827',      // Preto quase total
    gray: '#4B5563',      // Cinza texto
    lightGray: '#F3F4F6', // Fundo cinza claro
    footerGray: '#6B7280' // Cinza médio para rodapé (mais escuro que antes)
};

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica', backgroundColor: '#FFFFFF' },
    header: { marginBottom: 20, borderBottomWidth: 2, borderBottomColor: colors.primary, paddingBottom: 10 },
    title: { fontSize: 24, color: colors.dark, fontWeight: 'bold' },
    subtitle: { fontSize: 10, color: colors.gray, marginTop: 4 },

    // Seção do Score (O "Relógio")
    scoreSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, backgroundColor: colors.lightGray, padding: 15, borderRadius: 8 },
    scoreBig: { fontSize: 40, fontWeight: 'bold', color: colors.primary, marginRight: 15 },
    scoreText: { flex: 1 },
    progressBarBg: { height: 10, backgroundColor: '#D1D5DB', borderRadius: 5, marginTop: 5, width: '100%' },

    // Seção de Mercado
    sectionTitle: { fontSize: 14, fontWeight: 'bold', color: colors.dark, marginTop: 15, marginBottom: 8, textTransform: 'uppercase' },
    text: { fontSize: 11, color: colors.gray, lineHeight: 1.5, textAlign: 'justify' },

    // Grid SWOT (Lado a Lado)
    gridContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    column: { width: '48%' },
    cardGreen: { padding: 10, backgroundColor: '#F0FDF4', borderLeftWidth: 4, borderLeftColor: colors.success, borderRadius: 4 },
    cardRed: { padding: 10, backgroundColor: '#FEF2F2', borderLeftWidth: 4, borderLeftColor: colors.danger, borderRadius: 4 },
    bullet: { fontSize: 10, marginBottom: 4, color: colors.dark },

    // Rodapé (Mais visível agora)
    footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 9, color: colors.footerGray, borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10 }
});

// Componente da Barra de Progresso
const ProgressBar = ({ score }) => {
    // Define cor baseada na nota
    // Sincronizado com os Labels de Texto
    const getColor = (s) => {
        if (s >= 60) return colors.success; // Alta e Altíssima (Verde)
        if (s >= 40) return colors.warning; // Média (Laranja)
        return colors.danger;               // Baixa (Vermelho)
    };

    return (
        <View style={styles.progressBarBg}>
            <View style={{
                width: `${score}%`,
                height: '100%',
                backgroundColor: getColor(score || 0),
                borderRadius: 5
            }} />
        </View>
    );
};

// Helper: Calcula o texto de viabilidade baseado no score
const getViabilityLabel = (score) => {
    if (!score) return "Calculando...";
    if (score >= 80) return "Altíssima Viabilidade";
    if (score >= 60) return "Alta Viabilidade";
    if (score >= 40) return "Média Viabilidade";
    return "Baixa Viabilidade (Alto Risco)";
};

// Helper function to extract bullet points intelligently (handling multi-line)
const extractBullets = (text) => {
    if (!text) return [];

    // Remove markdown bold/italic (** or *) for cleaner PDF
    const cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '');

    const lines = cleanText.split('\n');
    const bullets = [];
    let currentBullet = "";

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        // Verifica se é um novo bullet (começa com -, •, numero ou *)
        const isNewBullet = /^(?:-|\u2022|\d+\.|>)\s/.test(trimmed);

        if (isNewBullet) {
            if (currentBullet) bullets.push(currentBullet);
            currentBullet = trimmed.replace(/^(?:-|\u2022|\d+\.|>)\s/, '').trim();
        } else {
            // Continuação da linha anterior
            if (currentBullet) {
                currentBullet += " " + trimmed;
            } else {
                currentBullet = trimmed;
            }
        }
    });

    if (currentBullet) bullets.push(currentBullet);

    return bullets.slice(0, 6);
};


// Função auxiliar para extrair seções do Markdown
const parseFeedback = (markdown) => {
    const sections = {
        mercado: "Não foi possível extrair a análise de mercado.",
        pros: [],
        contras: [],
        veredito: "Conselho não disponível."
    };

    if (!markdown) return sections;

    try {
        const regex = /(?:\[|\*\*|##|^)\s*SEÇÃO\s+(\d+)[^\]\*\n]*(?:\]|\*\*|:|\n|$)/gmi;
        const parts = markdown.split(regex);

        for (let i = 1; i < parts.length; i += 2) {
            const sectionNum = parts[i];
            const content = parts[i + 1] ? parts[i + 1].trim() : "";

            if (sectionNum === "1") {
                sections.mercado = content.replace(/\*\*/g, '');
            } else if (sectionNum === "2") {
                sections.pros = extractBullets(content);
            } else if (sectionNum === "3") {
                sections.contras = extractBullets(content);
            } else if (sectionNum === "4") {
                sections.veredito = content.replace(/\*\*/g, '');
            }
        }

        // --- FALLBACKS ---
        if (parts.length < 3 && markdown.includes('### ')) {
            const legacyParts = markdown.split('### ');
            legacyParts.forEach(part => {
                if (part.includes('Análise de Mercado')) {
                    sections.mercado = part.replace('📊 Análise de Mercado (Baseada em Dados Reais)', '').trim();
                } else if (part.includes('Pontos Fortes')) {
                    const lines = part.split('\n').filter(l => l.trim().startsWith('-'));
                    sections.pros = lines.map(l => l.replace('-', '').trim());
                } else if (part.includes('Pontos Fracos')) {
                    const lines = part.split('\n').filter(l => l.trim().startsWith('-'));
                    sections.contras = lines.map(l => l.replace('-', '').trim());
                } else if (part.includes('Veredito Final')) {
                    sections.veredito = part.replace('🎯 Veredito Final', '').trim();
                }
            });
        }
        else if (parts.length < 3 && markdown.trim().length > 50 && !sections.mercado.includes("Não foi possível")) {
            sections.mercado = markdown;
        } else if (parts.length < 3 && markdown.trim().length > 50) {
            sections.mercado = markdown;
        }

    } catch (e) {
        console.error("Erro ao parsear feedback para PDF", e);
    }

    return sections;
};

// O Documento PDF
const DiagnosticPDF = ({ data }) => {
    if (!data) return null;

    const parsedData = parseFeedback(data.feedback);
    const viabilityLabel = getViabilityLabel(data.score); // Calcula label dinamicamente

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* 1. Cabeçalho */}
                <View style={styles.header}>
                    <Text style={styles.title}>Relatório de Validação</Text>
                    <Text style={styles.subtitle}>Gerado pelo Daat AI • {new Date().toLocaleDateString()}</Text>
                </View>

                {/* 2. O Veredito Visual (Score) */}
                <View style={styles.scoreSection}>
                    <Text style={styles.scoreBig}>{data.score || 0}/100</Text>
                    <View style={styles.scoreText}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.dark }}>
                            Índice de Viabilidade: {viabilityLabel}
                        </Text>
                        <ProgressBar score={data.score} />
                    </View>
                </View>

                {/* 3. Análise de Mercado */}
                <View>
                    <Text style={styles.sectionTitle}>Análise de Mercado & Concorrência</Text>
                    <Text style={styles.text}>
                        {parsedData.mercado}
                    </Text>
                </View>

                {/* 4. Grid Lado a Lado */}
                <View style={styles.gridContainer}>
                    <View style={styles.column}>
                        <Text style={[styles.sectionTitle, { color: colors.success }]}>Potencial & Forças</Text>
                        <View style={styles.cardGreen}>
                            {parsedData.pros.length > 0 ? (
                                parsedData.pros.map((item, index) => (
                                    <Text key={index} style={styles.bullet}>• {item}</Text>
                                ))
                            ) : <Text style={styles.bullet}>-</Text>}
                        </View>
                    </View>

                    <View style={styles.column}>
                        <Text style={[styles.sectionTitle, { color: colors.danger }]}>Riscos & Desafios</Text>
                        <View style={styles.cardRed}>
                            {parsedData.contras.length > 0 ? (
                                parsedData.contras.map((item, index) => (
                                    <Text key={index} style={styles.bullet}>• {item}</Text>
                                ))
                            ) : <Text style={styles.bullet}>-</Text>}
                        </View>
                    </View>
                </View>

                {/* 5. Veredito Final */}
                <View style={{ marginTop: 30 }}>
                    <Text style={styles.sectionTitle}>Conselho do Especialista</Text>
                    <Text style={[styles.text, { fontStyle: 'italic' }]}>
                        "{parsedData.veredito}"
                    </Text>
                </View>

                <Text style={styles.footer}>
                    Este relatório foi gerado por inteligência artificial. Valide os dados antes de investir.
                    Ao usar o Daat AI, você contribui para nosso Índice de Inovação. Seus dados podem ser usados de forma anônima e agregada para gerar benchmarks de mercado.
                    Daat AI Solutions © 2025
                </Text>
            </Page>
        </Document>
    );
};

export default DiagnosticPDF;
