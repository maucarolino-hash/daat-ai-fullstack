// src/components/ComponentFeedback.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TypewriterText = ({ text }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let i = 0;
        const speed = 10; // Velocidade da digitação (ms)
        setDisplayedText(""); // Reset ao mudar o texto

        const intervalId = setInterval(() => {
            setDisplayedText((prev) => prev + text.charAt(i));
            i++;
            if (i >= text.length) clearInterval(intervalId);
        }, speed);

        return () => clearInterval(intervalId);
    }, [text]);

    return (
        <span style={{ whiteSpace: 'pre-wrap' }}>
            {displayedText}
            <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '16px',
                    backgroundColor: 'var(--brand-primary)',
                    marginLeft: '4px',
                    verticalAlign: 'middle'
                }}
            />
        </span>
    );
};

export default function ComponentFeedback({ feedback }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Linha Divisória */}
            <hr style={{
                border: '0',
                borderTop: '1px solid var(--border-subtle)',
                margin: '16px 0'
            }} aria-hidden="true" />

            {/* Section Wrapper */}
            <section
                style={{
                    width: '100%',
                    maxWidth: '100%',
                    boxSizing: 'border-box',
                    color: 'var(--text-secondary)',
                    fontSize: '1rem',
                    lineHeight: '1.75',
                }}
                aria-live="polite"
            >
                <div
                    style={{
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                        wordWrap: 'break-word',
                        wordBreak: 'break-word',
                        hyphens: 'auto'
                    }}
                >
                    {/* Se o feedback for muito longo, usamos typewriter. Se for curto ou update, direto. */}
                    <TypewriterText text={feedback} />
                </div>
            </section>
        </motion.div>
    );
}
