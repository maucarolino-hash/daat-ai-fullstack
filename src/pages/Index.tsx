import { useNavigate } from "react-router-dom";
import { StatCard } from "@/components/dashboard/StatCard";
import { CompetitorList } from "@/components/dashboard/CompetitorList";
import { RiskCard } from "@/components/dashboard/RiskCard";
import { DaatTerminal } from "@/components/dashboard/DaatTerminal";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, AlertTriangle, Target, FileText } from "lucide-react";
import { useDaatEngine } from "@/lib/daat-engine/context";

export default function Index() {
  const navigate = useNavigate();
  const { state } = useDaatEngine();
  const { result, isAnalyzing } = state;

  const marketShare = result?.scoreBreakdown.totalScore 
    ? `${(result.scoreBreakdown.totalScore / 10).toFixed(1)}%` 
    : "12,5%";
  
  const competitorCount = result?.competitors.length || 4;
  const riskLevel = result?.riskAssessment.level || "medium";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Dashboard de Crescimento</h1>
          <p className="text-muted-foreground">Visão geral da sua posição de mercado e inteligência competitiva</p>
        </div>
        {result && !isAnalyzing && (
          <Button onClick={() => navigate('/report')} variant="neon" className="gap-2">
            <FileText className="w-4 h-4" />
            Ver Relatório Completo
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Participação de Mercado" value={marketShare} change="+2,1%" changeType="positive" icon={TrendingUp} />
        <StatCard title="Concorrentes Rastreados" value={competitorCount.toString()} change="+1" changeType="positive" icon={Users} />
        <StatCard title="Índice de Risco" value={riskLevel === 'low' ? "Baixo" : riskLevel === 'medium' ? "Médio" : "Alto"} change="-5%" changeType="positive" icon={AlertTriangle} />
        <StatCard title="Score Daat" value={result?.scoreBreakdown.totalScore?.toString() || "—"} change={result ? "+8" : undefined} changeType="positive" icon={Target} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <CompetitorList />
          <RiskCard />
        </div>
        <div className="lg:col-span-2">
          <DaatTerminal />
        </div>
      </div>
    </div>
  );
}
