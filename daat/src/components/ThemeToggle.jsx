import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="theme-toggle-container">
            <button
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
                title="Claro"
            >
                <Sun size={16} />
            </button>
            <button
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
                title="Escuro"
            >
                <Moon size={16} />
            </button>
            <button
                className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
                onClick={() => setTheme('system')}
                title="Sistema"
            >
                <Monitor size={16} />
            </button>
        </div>
    );
};

export default ThemeToggle;
