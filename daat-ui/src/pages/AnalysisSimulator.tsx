import { Activity, BarChart3 } from "lucide-react";
import { ScenarioSimulator } from "@/components/analysis/ScenarioSimulator";

export default function AnalysisSimulator() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Simulador de Cenários</h1>
        <p className="text-lg text-muted-foreground">
          Análise preditiva "E Se" para tomada de decisões estratégicas
        </p>
      </div>

      {/* Description Card */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6 text-accent" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Como funciona?</h2>
            <p className="text-base text-muted-foreground leading-relaxed">
              Ajuste os parâmetros de preço e marketing para visualizar projeções de participação de mercado. 
              O simulador utiliza dados do Daat Engine para calcular impactos realistas baseados na sua 
              pontuação competitiva atual e no comportamento histórico do mercado.
            </p>
          </div>
        </div>
      </div>

      {/* Simulator Component */}
      <ScenarioSimulator />
    </div>
  );
}
