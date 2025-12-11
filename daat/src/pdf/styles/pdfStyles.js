// PDF StyleSheet Factory (react-pdf/renderer)
import { StyleSheet } from '@react-pdf/renderer';
import { getTheme } from './pdfThemes';

/**
 * Cria estilos dinâmicos baseados no tema selecionado
 * @param {string} themeName - Nome do tema ('professional', 'dark', 'colorful', 'minimal')
 * @returns {Object} Objeto com colors e styles
 */
export const createPdfStyles = (themeName = 'professional') => {
    const theme = getTheme(themeName);
    const colors = theme.colors;

    const styles = StyleSheet.create({
        page: {
            padding: 40,
            fontFamily: 'Helvetica',
            backgroundColor: colors.white,
            fontSize: 11,
            color: colors.text,
            lineHeight: 1.5
        },

        // HEADER & COVER
        coverContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        brandTitle: {
            fontSize: 14,
            color: colors.text,
            letterSpacing: 2,
            marginBottom: 10,
            textTransform: 'uppercase'
        },
        reportTitle: {
            fontSize: 32,
            color: colors.primary,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 20
        },

        // SCORE BADGE
        scoreBadge: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20
        },
        scoreValue: {
            fontSize: 48,
            color: colors.white,
            fontWeight: 'bold'
        },
        scoreLabel: {
            fontSize: 10,
            color: colors.white,
            textTransform: 'uppercase'
        },

        // CONTEXT BOX
        contextBox: {
            width: '100%',
            backgroundColor: colors.lightBg,
            padding: 20,
            borderRadius: 8,
            marginBottom: 30
        },
        contextLabel: {
            fontSize: 10,
            color: colors.accent,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            marginBottom: 4
        },
        contextText: {
            fontSize: 12,
            color: colors.primary,
            marginBottom: 12
        },

        // SECTIONS
        sectionHeader: {
            fontSize: 16,
            color: colors.primary,
            fontWeight: 'bold',
            borderBottomWidth: 2,
            borderBottomColor: colors.accent,
            paddingBottom: 6,
            marginBottom: 14,
            marginTop: 20
        },
        subHeader: {
            fontSize: 12,
            color: colors.accent,
            fontWeight: 'bold',
            marginTop: 10,
            marginBottom: 4
        },
        paragraph: {
            marginBottom: 10,
            textAlign: 'justify'
        },
        bulletPoint: {
            flexDirection: 'row',
            marginBottom: 6
        },
        bulletDot: {
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: colors.accent,
            marginRight: 8,
            marginTop: 6
        },
        bulletText: {
            flex: 1
        },

        // CARDS (SWOT)
        grid: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10
        },
        column: {
            width: '48%'
        },
        card: {
            padding: 12,
            borderRadius: 6,
            marginBottom: 10
        },
        cardGreen: {
            backgroundColor: '#ECFDF5',
            borderLeftWidth: 3,
            borderLeftColor: colors.success,
            padding: 12
        },
        cardRed: {
            backgroundColor: '#FEF2F2',
            borderLeftWidth: 3,
            borderLeftColor: colors.danger,
            padding: 12
        },

        // METRICS CARDS (NOVO)
        metricsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginBottom: 20,
            marginTop: 10
        },
        metricCard: {
            width: '48%',
            backgroundColor: colors.lightBg,
            padding: 12,
            borderRadius: 6,
            marginBottom: 10,
            borderLeftWidth: 4,
            borderLeftColor: colors.accent
        },
        metricValue: {
            fontSize: 20,
            fontWeight: 'bold',
            color: colors.primary,
            marginBottom: 4
        },
        metricLabel: {
            fontSize: 9,
            color: colors.text,
            textTransform: 'uppercase',
            letterSpacing: 0.5
        },

        // TABLES (NOVO)
        table: {
            width: '100%',
            borderWidth: 1,
            borderColor: '#E5E7EB',
            marginBottom: 15,
            marginTop: 10
        },
        tableRow: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: '#E5E7EB'
        },
        tableHeader: {
            backgroundColor: colors.primary,
            paddingVertical: 8,
            paddingHorizontal: 6
        },
        tableHeaderText: {
            color: colors.white,
            fontWeight: 'bold',
            fontSize: 10,
            textTransform: 'uppercase'
        },
        tableCell: {
            flex: 1,
            padding: 8,
            fontSize: 10,
            borderRightWidth: 1,
            borderRightColor: '#E5E7EB'
        },
        tableCellLast: {
            borderRightWidth: 0
        },

        // COMPETITOR CARDS (NOVO)
        competitorCard: {
            backgroundColor: '#F9FAFB',
            padding: 10,
            borderRadius: 6,
            marginBottom: 8,
            borderWidth: 1,
            borderColor: '#E5E7EB'
        },
        competitorName: {
            fontSize: 11,
            fontWeight: 'bold',
            color: colors.primary,
            marginBottom: 4
        },
        competitorDetail: {
            fontSize: 9,
            color: colors.text,
            marginBottom: 2
        },
        competitorTag: {
            fontSize: 8,
            color: colors.accent,
            backgroundColor: '#F3F4F6',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 3,
            marginTop: 4,
            alignSelf: 'flex-start'
        },

        // ENHANCED TYPOGRAPHY (NOVO)
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.primary,
            marginBottom: 8,
            marginTop: 15
        },
        subsectionTitle: {
            fontSize: 13,
            fontWeight: 'bold',
            color: colors.accent,
            marginTop: 12,
            marginBottom: 6,
            textTransform: 'uppercase',
            letterSpacing: 0.5
        },
        highlight: {
            backgroundColor: '#FEF3C7',
            paddingHorizontal: 4,
            paddingVertical: 2
        },
        badge: {
            fontSize: 8,
            backgroundColor: colors.accent,
            color: colors.white,
            paddingHorizontal: 6,
            paddingVertical: 3,
            borderRadius: 3,
            marginLeft: 6
        },

        // FOOTERS
        footer: {
            position: 'absolute',
            bottom: 30,
            left: 40,
            right: 40,
            textAlign: 'center',
            fontSize: 8,
            color: '#9CA3AF',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            paddingTop: 10
        }
    });

    return { colors, styles };
};

// Exporta versão padrão para compatibilidade retroativa
export const { colors, styles } = createPdfStyles('professional');
