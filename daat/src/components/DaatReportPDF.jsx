import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// --- ESTILOS DO PDF (Parecido com CSS, mas para papel) ---
const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#1E293B', // Fundo Dark Mode
        color: '#F1F5F9', // Texto Claro
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F1F5F9',
    },
    subtitle: {
        fontSize: 10,
        color: '#94A3B8',
        marginTop: 4,
    },
    scoreBadge: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#10B981', // Verde padrão (será dinâmico)
    },
    scoreText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    section: {
        marginTop: 20,
        marginBottom: 10,
    },
    label: {
        fontSize: 10,
        color: '#94A3B8',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    value: {
        fontSize: 12,
        lineHeight: 1.5,
        textAlign: 'justify',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#64748B',
        borderTopWidth: 1,
        borderTopColor: '#334155',
        paddingTop: 10,
    }
});

// --- O COMPONENTE DO DOCUMENTO ---
const DaatReportPDF = ({ data }) => {
    const isViable = data.score > 60;

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* CABEÇALHO */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Relatório Daat AI</Text>
                        <Text style={styles.subtitle}>Análise de Risco de Startup</Text>
                    </View>

                    {/* Círculo do Score */}
                    <View style={[styles.scoreBadge, { backgroundColor: isViable ? '#10B981' : '#EF4444' }]}>
                        <Text style={styles.scoreText}>{data.score}</Text>
                    </View>
                </View>

                {/* DETALHES DO PROJETO */}
                <View style={styles.section}>
                    <Text style={styles.label}>Segmento de Cliente</Text>
                    <Text style={styles.value}>{data.customerSegment || data.customer_segment}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Problema</Text>
                    <Text style={styles.value}>{data.problem}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Proposta de Valor</Text>
                    <Text style={styles.value}>{data.valueProposition || data.value_proposition}</Text>
                </View>

                {/* FEEDBACK (A parte importante) */}
                <View style={[styles.section, { marginTop: 30 }]}>
                    <Text style={styles.label}>Veredicto da IA</Text>
                    <Text style={styles.value}>{data.feedback}</Text>
                </View>

                {/* RODAPÉ */}
                <Text style={styles.footer}>
                    Gerado automaticamente por Daat AI • {new Date().toLocaleDateString()}
                </Text>

            </Page>
        </Document>
    );
};

export default DaatReportPDF;
