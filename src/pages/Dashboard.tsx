import { TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { CompetitorList } from "@/components/dashboard/CompetitorList";
import { RiskCard } from "@/components/dashboard/RiskCard";
import { LiveTerminal } from "@/components/dashboard/LiveTerminal";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Painel de Crescimento</h1>
        <p className="text-muted-foreground">Visão geral de inteligência de mercado em tempo real</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Participação de Mercado"
          value="12,5%"
          change="+2,1%"
          changeType="positive"
          icon={TrendingUp}
        />
        <CompetitorList />
        <RiskCard />
      </div>

      {/* Live Terminal */}
      <div>
        <LiveTerminal />
      </div>
    </div>
  );
}
