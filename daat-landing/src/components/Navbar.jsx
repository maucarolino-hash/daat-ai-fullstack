import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4"
        >
            <div className="relative flex items-center justify-between w-full max-w-5xl px-6 py-3 rounded-full backdrop-blur-md bg-black/50 border border-white/10 shadow-lg ring-1 ring-white/5">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white">
                        D
                    </div>
                    <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
                        Daat AI
                    </span>
                </div>

                {/* Links (Desktop) */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
                    <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
                    <a href="#solutions" className="hover:text-white transition-colors">Soluções</a>
                </div>

                {/* Actions (Desktop & Mobile) */}
                <div className="flex items-center gap-4">
                    <a
                        href="https://daat-app-v2-e7fqmz3fn-mauricios-projects-777bfed5.vercel.app"
                        className="hidden md:block px-5 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all hover:scale-105 active:scale-95"
                    >
                        Login
                    </a>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-white p-1"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="absolute top-24 left-4 right-4 p-4 bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-2xl md:hidden flex flex-col gap-4 shadow-2xl"
                    >
                        <a href="#features" className="text-neutral-300 hover:text-white font-medium p-2 hover:bg-white/5 rounded-lg transition-colors">Funcionalidades</a>
                        <a href="#solutions" className="text-neutral-300 hover:text-white font-medium p-2 hover:bg-white/5 rounded-lg transition-colors">Soluções</a>
                        <div className="h-px bg-white/10 my-2" />
                        <a
                            href="https://daat-app-v2-e7fqmz3fn-mauricios-projects-777bfed5.vercel.app"
                            className="text-center py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors"
                        >
                            Fazer Login
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
