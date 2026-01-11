import React from 'react';

const logos = [
    { name: "TechStars", color: "text-white" },
    { name: "Y Combinator", color: "text-orange-500" },
    { name: "500 Startups", color: "text-white" },
    { name: "Sequoia", color: "text-green-500" },
    { name: "Andreessen Horowitz", color: "text-white" },
    { name: "Google for Startups", color: "text-blue-400" },
    { name: "AWS Startups", color: "text-yellow-500" },
];

const LogoMarquee = () => {
    return (
        <section className="py-10 bg-black border-y border-white/5 relative overflow-hidden z-20">
            <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
                <p className="text-sm text-neutral-500 font-medium uppercase tracking-widest">
                    Confiado por inovadores em
                </p>
            </div>

            <div className="flex overflow-hidden group">
                {/* Container que move (precisa de 2 cópias para o loop infinito) */}
                <div className="flex animate-loop-scroll group-hover:paused gap-8 md:gap-16 pr-8 md:pr-16 w-max">
                    {logos.map((logo, index) => (
                        <div key={index} className={`text-2xl font-bold whitespace-nowrap opacity-50 hover:opacity-100 transition-opacity ${logo.color}`}>
                            {logo.name}
                        </div>
                    ))}
                    {/* Duplicata para o loop */}
                    {logos.map((logo, index) => (
                        <div key={`dup-${index}`} className={`text-2xl font-bold whitespace-nowrap opacity-50 hover:opacity-100 transition-opacity ${logo.color}`}>
                            {logo.name}
                        </div>
                    ))}
                    {/* Triplicata para garantir telas largas */}
                    {logos.map((logo, index) => (
                        <div key={`tri-${index}`} className={`text-2xl font-bold whitespace-nowrap opacity-50 hover:opacity-100 transition-opacity ${logo.color}`}>
                            {logo.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Fade nas bordas */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent pointer-events-none" />
        </section>
    );
};

export default LogoMarquee;
