import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CTA = () => {
    return (
        <section className="py-24 px-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
                >
                    Pronto para validar sua próxima <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                        grande ideia?
                    </span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto"
                >
                    Junte-se a fundadores e investidores que usam Daat AI para tomar decisões baseadas em dados, não em palpites.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <a
                        href="https://daat-app-v2-e7fqmz3fn-mauricios-projects-777bfed5.vercel.app"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black text-lg font-bold rounded-full hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        Começar Agora
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
