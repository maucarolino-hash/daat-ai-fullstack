import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Cores do Daat AI (Dark/Professional Theme adaptado para fundo branco de papel)
const colors = {
    primary: '#2563EB',   // Azul Royal
    success: '#16A34A',   // Verde
    danger: '#DC2626',    // Vermelho
    dark: '#111827',      // Preto quase total
    gray: '#4B5563',      // Cinza texto
    lightGray: '#F3F4F6'  // Fundo cinza claro
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

    footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 9, color: '#9CA3AF', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 10 }
});

// Componente da Barra de Progresso
const ProgressBar = ({ score }) => {
    // Define cor baseada na nota
    const getColor = (s) => s >= 80 ? colors.success : s >= 50 ? '#D97706' : colors.danger;

    return (
        <View style={styles.progressBarBg}>
            <View style={{
                width: `${score}%`,
                height: '100%',
                backgroundColor: getColor(score),
                borderRadius: 5
            }} />
        </View>
    );
};

// Função auxiliar para extrair seções do Markdown
const parseFeedback = (markdown) => {
    if (!markdown) return {};

    const sections = {
        mercado: "",
        risco: "N/A",
        pros: [],
        contras: [],
        veredito: ""
    };

    // Extração simples baseada nos cabeçalhos conhecidos
    try {
        const parts = markdown.split('### ');

        parts.forEach(part => {
            if (part.includes('Análise de Mercado')) {
                sections.mercado = part.replace('📊 Análise de Mercado (Baseada em Dados Reais)', '').trim();
            } else if (part.includes('Nível de Risco')) {
                const match = part.match(/\*\*(.*?)\*\*/);
                if (match) sections.risco = match[1];
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
    } catch (e) {
        console.error("Erro ao parsear feedback para PDF", e);
    }

    return sections;
};

// O Documento PDF
const DiagnosticPDF = ({ data }) => {
    if (!data) return null;

    // Parseia o feedback markdown para o formato estruturado
    const parsedData = parseFeedback(data.feedback);

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
                    <Text style={styles.scoreBig}>{data.score}/100</Text>
                    <View style={styles.scoreText}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: colors.dark }}>
                            Índice de Viabilidade: {parsedData.risco}
                        </Text>
                        <ProgressBar score={data.score} />
                    </View>
                </View>

                {/* 3. Análise de Mercado (Dados da Tavily) */}
                <View>
                    <Text style={styles.sectionTitle}>Análise de Mercado & Concorrência</Text>
                    <Text style={styles.text}>
                        {parsedData.mercado || "Nenhum dado de mercado específico foi encontrado."}
                    </Text>
                </View>

                {/* 4. Grid Lado a Lado (Prós e Contras) */}
                <View style={styles.gridContainer}>
                    {/* Coluna Esquerda: Forças */}
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

                    {/* Coluna Direita: Riscos */}
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

                {/* Rodapé White-Label Ready */}
                <Text style={styles.footer}>
                    Este relatório foi gerado por inteligência artificial. Valide os dados antes de investir.
                    Daat AI Solutions © 2025
                </Text>
            </Page>
        </Document>
    );
};

export default DiagnosticPDF;
