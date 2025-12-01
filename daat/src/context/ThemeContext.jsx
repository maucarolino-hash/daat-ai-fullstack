import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Tenta ler do localStorage ou usa 'system' como padrão
    const [theme, setTheme] = useState(localStorage.getItem('daat-theme') || 'system');

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove classes antigas
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }

        // Salva a preferência
        localStorage.setItem('daat-theme', theme);

    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
