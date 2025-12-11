import React from "react";
import { motion } from "framer-motion";

import Scene3D from "./components/Scene3D";

const Hero = () => {
    return (
        <div className="h-screen w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">

            {/* 3D Background */}
            <Scene3D />

            {/* Gradient Mask to dim particles behind text */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.8)_0%,transparent_50%)]"></div>

            {/* Luz de Fundo (Ambiente) */}
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>

            <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0 flex flex-col items-center">

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 pb-4"
                >
                    Valide <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Startups</span> em <br />
                    segundos, não semanas.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto"
                >
                    O co-piloto de IA para Aceleradoras e Hubs de Inovação.
                    Gere diagnósticos de risco com dados de mercado em tempo real (2025) e relatórios PDF profissionais.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex justify-center mt-8"
                >
                    {/* Link para o seu App de Produção */}
                    <a href="https://daat-app-v2-e7fqmz3fn-mauricios-projects-777bfed5.vercel.app" className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl hover:bg-slate-900 transition-colors">
                            Testar Tecnologia Agora
                        </span>
                    </a>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
