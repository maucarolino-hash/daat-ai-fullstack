import React from 'react';
import { Twitter, Linkedin, Github, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black border-t border-white/10 py-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

                {/* Brand */}
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white">
                            D
                        </div>
                        <span className="text-xl font-bold text-white">Daat AI</span>
                    </div>
                    <p className="text-neutral-500 max-w-sm">
                        Inteligência artificial para análise de risco e viabilidade de startups.
                        Tome decisões melhores, mais rápido.
                    </p>
                    <p className="text-neutral-600 text-xs mt-4 max-w-sm">
                        Ao usar o Daat AI, você contribui para nosso Índice de Inovação. Seus dados podem ser usados de forma anônima e agregada para gerar benchmarks de mercado.
                    </p>
                </div>

                {/* Links 1 */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Produto</h4>
                    <ul className="space-y-2 text-neutral-400 text-sm">
                        <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                        <li><a href="#solutions" className="hover:text-white transition-colors">Soluções</a></li>
                    </ul>
                </div>

                {/* Links 2 */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Empresa</h4>
                    <ul className="space-y-2 text-neutral-400 text-sm">
                        <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-neutral-600 text-sm">
                    © 2025 Daat AI. Todos os direitos reservados.
                </p>

                <div className="flex gap-4 text-neutral-500">
                    <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                    <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                    <a href="#" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                    <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
