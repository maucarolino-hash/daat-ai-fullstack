import { TrendingUp, Grid3X3, Activity, Swords, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FeatureMatrix } from "@/components/analysis/FeatureMatrix";
import { MarketDataCard } from "@/components/analysis/MarketDataCard";
import { MonitoringRadar } from "@/components/analysis/MonitoringRadar";
import { BattleMode } from "@/components/battle/BattleMode";
import { useDaatEngine } from "@/lib/daat-engine/context";
import { exportReportToPdf } from "@/lib/pdf-export";

export default function AnalysisOverview() {
  const [battleModeOpen, setBattleModeOpen] = useState(false);
  const { getCompetitors, state } = useDaatEngine();
  const competitors = getCompetitors();

  const handleExport = () => {
    if (state.result) {
      exportReportToPdf(state.result);
    }
  };

  const marketData = competitors.slice(0, 4).map((c, i) => ({
    company: c.name,
    revenue: c.revenue,
    growth: c.growth,
    color: ["bg-accent/20", "bg-primary/20", "bg-neon-orange/20", "bg-neon-blue/20"][i],
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Visão Geral do Mercado</h1>
          <p className="text-lg text-muted-foreground">Panorama completo do seu cenário competitivo</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="w-5 h-5" />
            Exportar PDF
          </Button>
          <Button onClick={() => setBattleModeOpen(true)} variant="neon" className="gap-2 text-base px-6 py-3">
            <Swords className="w-5 h-5" />
            Modo Batalha
          </Button>
        </div>
      </div>

      {/* Market Data Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-semibold text-foreground">Dados de Mercado</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {marketData.map((data) => (
            <MarketDataCard key={data.company} {...data} />
          ))}
        </div>
      </section>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Feature Matrix - Takes 2 columns */}
        <div className="lg:col-span-2">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Grid3X3 className="w-6 h-6 text-accent" />
              <h2 className="text-xl font-semibold text-foreground">Comparação de Recursos</h2>
            </div>
            <FeatureMatrix />
          </section>
        </div>

        {/* Sidebar - Radar */}
        <div className="lg:col-span-1">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-accent" />
              <h2 className="text-xl font-semibold text-foreground">Monitoramento</h2>
            </div>
            <MonitoringRadar />
          </section>
        </div>
      </div>

      {/* Battle Mode Overlay */}
      <BattleMode isOpen={battleModeOpen} onClose={() => setBattleModeOpen(false)} />
    </div>
  );
}
