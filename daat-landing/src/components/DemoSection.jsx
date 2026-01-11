import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import dashboardImg from "../assets/dashboard.png";

const DemoSection = () => {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;
        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <section id="solutions" className="py-20 px-4 flex justify-center perspective-[1200px] overflow-hidden">
            <div className="max-w-6xl w-full">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 pb-4">
                        Poderoso. Intuitivo.
                    </h2>
                    <p className="text-neutral-400">
                        Uma interface desenhada para clareza em meio ao caos de dados.
                    </p>
                </div>

                <motion.div
                    ref={ref}
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d",
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative group"
                >
                    {/* GLASS FRAME CONTAINER */}
                    <div className="relative rounded-2xl bg-neutral-900/50 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">

                        {/* Window Header (The "Frame") */}
                        <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            {/* Optional URL bar or title */}
                            <div className="ml-4 h-6 bg-black/20 rounded-full w-64 hidden sm:block"></div>
                        </div>

                        {/* The Image */}
                        <div className="relative">
                            <img
                                src={dashboardImg}
                                alt="Daat AI Dashboard"
                                className="w-full h-auto opacity-90 group-hover:opacity-100 transition-opacity"
                            />

                            {/* Inner Shadow/Vignette to blend edges */}
                            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none"></div>
                        </div>

                        {/* Glossy Reflection */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-50" />
                    </div>

                </motion.div>
            </div>
        </section>
    );
};

export default DemoSection;
