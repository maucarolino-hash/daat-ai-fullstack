import { FileText, ArrowRight, Eye, Activity, Grid3X3 } from "lucide-react";
import { Link } from "react-router-dom";

const analysisPages = [
  {
    title: "Visão Geral",
    description: "Panorama completo do mercado, dados de concorrentes e comparação de recursos",
    icon: Eye,
    path: "/analysis/overview",
    color: "bg-accent/20 text-accent",
  },
  {
    title: "Simulador de Cenários",
    description: "Análise preditiva 'E Se' para tomada de decisões estratégicas",
    icon: Activity,
    path: "/analysis/simulator",
    color: "bg-primary/20 text-primary",
  },
  {
    title: "Matriz de Recursos",
    description: "Comparação detalhada de funcionalidades entre concorrentes",
    icon: Grid3X3,
    path: "/analysis/features",
    color: "bg-neon-orange/20 text-neon-orange",
  },
];

export default function Analysis() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Matriz Competitiva & Diagnóstico</h1>
        <p className="text-lg text-muted-foreground">
          Visão estratégica gerada pela IA para análise competitiva aprofundada
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {analysisPages.map((page) => (
          <Link
            key={page.path}
            to={page.path}
            className="glass-card p-6 hover:border-primary/50 transition-all duration-300 group"
          >
            <div className="flex flex-col h-full">
              <div className={`w-14 h-14 rounded-xl ${page.color} flex items-center justify-center mb-5`}>
                <page.icon className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                {page.title}
              </h2>
              <p className="text-base text-muted-foreground flex-1 leading-relaxed">
                {page.description}
              </p>
              <div className="flex items-center gap-2 text-primary mt-5 text-base font-medium">
                <span>Acessar</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Info */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Relatório de Inteligência</h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Para gerar um relatório completo com análise detalhada, auditoria de riscos e recomendações 
              estratégicas, acesse o <Link to="/" className="text-primary hover:underline font-medium">Painel Principal</Link> e 
              inicie uma nova análise através do Daat Engine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
