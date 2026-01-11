/**
 * Sistema de Temas para PDF
 * Define paletas de cores e estilos para diferentes temas visuais
 */

export const themes = {
    professional: {
        name: 'Professional',
        description: 'Tema clássico e profissional com tons de azul',
        colors: {
            primary: '#111827',   // Dark Navy
            accent: '#2563EB',    // Royal Blue
            success: '#059669',   // Emerald
            warning: '#D97706',   // Amber
            danger: '#DC2626',    // Red
            text: '#374151',      // Gray 700
            lightBg: '#F3F4F6',   // Gray 100
            white: '#FFFFFF'
        }
    },

    dark: {
        name: 'Dark Mode',
        description: 'Tema escuro moderno para apresentações noturnas',
        colors: {
            primary: '#F9FAFB',   // Light Gray (invertido)
            accent: '#60A5FA',    // Light Blue
            success: '#34D399',   // Light Emerald
            warning: '#FBBF24',   // Light Amber
            danger: '#F87171',    // Light Red
            text: '#E5E7EB',      // Light Gray
            lightBg: '#1F2937',   // Dark Gray
            white: '#111827'      // Dark Navy (invertido)
        }
    },

    colorful: {
        name: 'Colorful',
        description: 'Tema vibrante e criativo com cores vivas',
        colors: {
            primary: '#7C3AED',   // Purple
            accent: '#EC4899',    // Pink
            success: '#10B981',   // Green
            warning: '#F59E0B',   // Orange
            danger: '#EF4444',    // Red
            text: '#1F2937',      // Dark Gray
            lightBg: '#FEF3C7',   // Light Yellow
            white: '#FFFFFF'
        }
    },

    minimal: {
        name: 'Minimal',
        description: 'Tema minimalista em preto e branco',
        colors: {
            primary: '#000000',   // Black
            accent: '#4B5563',    // Gray
            success: '#6B7280',   // Medium Gray
            warning: '#9CA3AF',   // Light Gray
            danger: '#374151',    // Dark Gray
            text: '#1F2937',      // Very Dark Gray
            lightBg: '#F9FAFB',   // Very Light Gray
            white: '#FFFFFF'
        }
    }
};

/**
 * Retorna o tema especificado ou o tema padrão (professional)
 * @param {string} themeName - Nome do tema ('professional', 'dark', 'colorful', 'minimal')
 * @returns {Object} Objeto do tema com name, description e colors
 */
export const getTheme = (themeName = 'professional') => {
    return themes[themeName] || themes.professional;
};

/**
 * Retorna lista de todos os temas disponíveis
 * @returns {Array} Array de objetos {id, name, description}
 */
export const getAvailableThemes = () => {
    return Object.keys(themes).map(key => ({
        id: key,
        name: themes[key].name,
        description: themes[key].description
    }));
};
