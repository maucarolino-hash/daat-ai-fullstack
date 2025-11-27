// src/components/ComponentFeedback.jsx
import React from "react";

export default function ComponentFeedback({ feedback }) {
    return (
        <>
            {/* Linha Divisória (hr className="border-t...") */}
            <hr style={{
                border: '0',
                borderTop: '1px solid #edf2f7',
                margin: '16px 0'
            }} aria-hidden="true" />

            {/* Section Wrapper */}
            <section
                style={{
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    color: 'var(--text-secondary)',    // text-gray-600
                    fontSize: '1rem',    // text-base
                    lineHeight: '1.75',  // leading-7
                }}
                aria-live="polite"
            >
                <div
                    style={{
                        whiteSpace: 'pre-wrap',  // Mantém parágrafos
                        overflowWrap: 'break-word', // O segredo moderno
                        wordWrap: 'break-word',     // Compatibilidade legado
                        wordBreak: 'break-word',    // Força bruta para URLs/palavras longas
                        hyphens: 'auto'             // Hifenização automática se o browser suportar
                    }}
                >
                    {feedback}
                </div>
            </section>
        </>
    );
}
