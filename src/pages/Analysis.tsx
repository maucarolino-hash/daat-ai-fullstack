import { useState } from "react";
import { FeatureMatrix } from "@/components/analysis/FeatureMatrix";
import { MarketDataCard } from "@/components/analysis/MarketDataCard";
import { MonitoringRadar } from "@/components/analysis/MonitoringRadar";
import { ScenarioSimulator } from "@/components/analysis/ScenarioSimulator";
import { BattleMode } from "@/components/battle/BattleMode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Swords, BarChart3, Grid3X3, Activity, TrendingUp } from "lucide-react";
import { useDaatEngine } from "@/lib/daat-engine/context";

export default function Analysis() {
  const [battleModeOpen, setBattleModeOpen] = useState(false);
  const { getCompetitors } = useDaatEngine();
  const competitors = getCompetitors();

  const marketData = competitors.slice(0, 4).map((c, i) => ({
    company: c.name,
    revenue: c.revenue,
    growth: c.growth,
    color: ["bg-accent/20", "bg-primary/20", "bg-neon-orange/20", "bg-neon-blue/20"][i],
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Matriz Competitiva</h1>
          <p className="text-muted-foreground">Análise aprofundada do seu cenário competitivo</p>
        </div>
        <Button onClick={() => setBattleModeOpen(true)} variant="neon" className="gap-2 self-start sm:self-auto">
          <Swords className="w-4 h-4" />
          Modo Batalha
        </Button>
      </div>

      {/* Tabs for Organization */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-secondary/50 p-1">
          <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-background">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Visão Geral</span>
          </TabsTrigger>
          <TabsTrigger value="simulator" className="gap-2 data-[state=active]:bg-background">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Simulador</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="gap-2 data-[state=active]:bg-background">
            <Grid3X3 className="w-4 h-4" />
            <span className="hidden sm:inline">Recursos</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-0">
          {/* Market Data Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-semibold text-foreground">Dados de Mercado</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {marketData.map((data) => (
                <MarketDataCard key={data.company} {...data} />
              ))}
            </div>
          </section>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Feature Matrix - Takes 2 columns */}
            <div className="lg:col-span-2">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Grid3X3 className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold text-foreground">Comparação de Recursos</h2>
                </div>
                <FeatureMatrix />
              </section>
            </div>

            {/* Sidebar - Radar */}
            <div className="lg:col-span-1">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold text-foreground">Monitoramento</h2>
                </div>
                <MonitoringRadar />
              </section>
            </div>
          </div>
        </TabsContent>

        {/* Simulator Tab */}
        <TabsContent value="simulator" className="mt-0">
          <ScenarioSimulator />
        </TabsContent>

        {/* Features Tab - Full Width Matrix */}
        <TabsContent value="features" className="mt-0">
          <FeatureMatrix />
        </TabsContent>
      </Tabs>

      {/* Battle Mode Overlay */}
      <BattleMode isOpen={battleModeOpen} onClose={() => setBattleModeOpen(false)} />
    </div>
  );
}
