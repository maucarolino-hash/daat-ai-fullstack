import { useState } from "react";
import { FeatureMatrix } from "@/components/analysis/FeatureMatrix";
import { MarketDataCard } from "@/components/analysis/MarketDataCard";
import { MonitoringRadar } from "@/components/analysis/MonitoringRadar";
import { ScenarioSimulator } from "@/components/analysis/ScenarioSimulator";
import { BattleMode } from "@/components/battle/BattleMode";
import { Button } from "@/components/ui/button";
import { Swords } from "lucide-react";

const marketData = [
  { company: "Acme Corp", revenue: "R$50M", growth: 15, color: "bg-accent/20" },
  { company: "Globex", revenue: "R$42,5M", growth: 8, color: "bg-primary/20" },
  { company: "Soylent", revenue: "R$31M", growth: -3, color: "bg-neon-orange/20" },
  { company: "Umbrella", revenue: "R$24M", growth: 22, color: "bg-neon-blue/20" },
];

export default function Analysis() {
  const [battleModeOpen, setBattleModeOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Matriz Competitiva</h1>
          <p className="text-muted-foreground">Análise aprofundada do seu cenário competitivo</p>
        </div>
        <Button onClick={() => setBattleModeOpen(true)} variant="neon" className="gap-2">
          <Swords className="w-4 h-4" />
          Modo Batalha
        </Button>
      </div>

      {/* Scenario Simulator */}
      <ScenarioSimulator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Feature Matrix */}
        <div className="lg:col-span-1">
          <FeatureMatrix />
        </div>

        {/* Right: Market Data & Radar */}
        <div className="space-y-4">
          {/* Market Data Grid */}
          <div className="grid grid-cols-2 gap-4">
            {marketData.map((data) => (
              <MarketDataCard key={data.company} {...data} />
            ))}
          </div>

          {/* Monitoring Radar */}
          <MonitoringRadar />
        </div>
      </div>

      {/* Battle Mode Overlay */}
      <BattleMode isOpen={battleModeOpen} onClose={() => setBattleModeOpen(false)} />
    </div>
  );
}
