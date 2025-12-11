import React from "react";
import { motion } from "framer-motion";
import { Brain, Globe, FileText, Zap } from "lucide-react";

const BentoItem = ({ title, description, icon: Icon, className, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={`relative overflow-hidden rounded-3xl bg-neutral-900/50 border border-white/10 p-8 hover:bg-neutral-900/80 transition-colors group ${className}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-violet-400" />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-neutral-400 leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
};

const BentoGrid = () => {
    return (
        <section id="features" className="py-24 px-4 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 pb-4">
                        Tecnologia de Ponta
                    </h2>
                    <p className="mt-4 text-neutral-400 max-w-2xl mx-auto">
                        Combinamos múltiplos agentes de IA para entregar resultados que humanos levariam semanas para produzir.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[300px]">

                    {/* Item Grande (Esquerda) */}
                    <BentoItem
                        title="Análise de Risco Autônoma"
                        description="Nossa IA avalia 50+ pontos de falha em startups, desde Product-Market Fit até riscos regulatórios, gerando um score de viabilidade preciso."
                        icon={Brain}
                        className="md:col-span-2 md:row-span-1"
                        delay={0.1}
                    />

                    {/* Item Pequeno (Direita Cima) */}
                    <BentoItem
                        title="Dados em Tempo Real"
                        description="Conectado à web (Tavily) para buscar tendências de mercado de 2024/2025."
                        icon={Globe}
                        className="md:col-span-1 md:row-span-1"
                        delay={0.2}
                    />

                    {/* Item Pequeno (Esquerda Baixo) */}
                    <BentoItem
                        title="Relatórios PDF"
                        description="Exportação profissional pronta para apresentar a investidores e parceiros."
                        icon={FileText}
                        className="md:col-span-1 md:row-span-1"
                        delay={0.3}
                    />

                    {/* Item Grande (Direita Baixo) */}
                    <BentoItem
                        title="Velocidade Sobre-humana"
                        description="O que um analista júnior leva 2 semanas para pesquisar, o Daat entrega em 45 segundos com maior profundidade e sem alucinações."
                        icon={Zap}
                        className="md:col-span-2 md:row-span-1"
                        delay={0.4}
                    />

                </div>
            </div>
        </section>
    );
};

export default BentoGrid;
