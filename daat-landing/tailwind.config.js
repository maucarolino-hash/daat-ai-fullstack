/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#2563EB", // Azul Daat
                dark: "#0a0a0a",    // Fundo quase preto
            },
            animation: {
                "shimmer": "shimmer 2s linear infinite",
                "loop-scroll": "loop-scroll 25s linear infinite",
            },
            keyframes: {
                shimmer: {
                    from: { backgroundPosition: "0 0" },
                    to: { backgroundPosition: "-200% 0" },
                },
                "loop-scroll": {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(-100%)" },
                },
            },
        },
    },
    plugins: [],
}
