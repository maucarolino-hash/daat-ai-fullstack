import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useDaatEngine } from "@/lib/daat-engine/context";
import { cn } from "@/lib/utils";

export function RiskCard() {
  const { state } = useDaatEngine();
  const { result } = state;

  // Use real data or defaults
  const riskLevel = result?.riskAssessment?.level || "none";
  const risks = result?.riskAssessment?.risks || [];

  // Tag limit
  const displayRisks = risks.slice(0, 4);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return "text-destructive border-destructive/30 bg-destructive/10";
      case 'high': return "text-neon-orange border-neon-orange/30 bg-neon-orange/10";
      case 'medium': return "text-accent border-accent/30 bg-accent/10";
      case 'low': return "text-emerald-500 border-emerald-500/30 bg-emerald-500/10";
      default: return "text-muted-foreground border-border bg-secondary/50";
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'critical': return "Crítico";
      case 'high': return "Alto";
      case 'medium': return "Moderado";
      case 'low': return "Baixo";
      default: return "Aguardando";
    }
  };

  return (
    <div className={cn("glass-card p-5 border-l-4",
      riskLevel === 'critical' ? "border-l-destructive" :
        riskLevel === 'high' ? "border-l-neon-orange" :
          riskLevel === 'medium' ? "border-l-accent" :
            riskLevel === 'low' ? "border-l-emerald-500" : "border-l-muted"
    )}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm text-muted-foreground font-medium">Nível de Risco</span>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center",
          riskLevel === 'low' ? "bg-emerald-500/20" : "bg-neon-orange/20"
        )}>
          {riskLevel === 'low' ?
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> :
            <AlertTriangle className={cn("w-4 h-4",
              riskLevel === 'critical' ? "text-destructive" : "text-neon-orange"
            )} />
          }
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={cn("text-2xl font-bold capitalize",
          riskLevel === 'critical' ? "text-destructive" :
            riskLevel === 'high' ? "text-neon-orange" :
              riskLevel === 'medium' ? "text-accent" :
                riskLevel === 'low' ? "text-emerald-500" : "text-muted-foreground"
        )}>
          {getRiskLabel(riskLevel)}
        </span>
        {/* Simple dots indicator */}
        <div className="flex gap-1">
          <div className={cn("w-2 h-2 rounded-full", riskLevel === 'none' ? "bg-muted" : "bg-current animate-pulse")} />
          <div className={cn("w-2 h-2 rounded-full opacity-50", riskLevel === 'none' ? "bg-muted" : "bg-current")} />
          <div className={cn("w-2 h-2 rounded-full opacity-25", riskLevel === 'none' ? "bg-muted" : "bg-current")} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {displayRisks.length === 0 ? (
          <span className="text-xs text-muted-foreground italic">
            {riskLevel === 'none' ? "Aguardando análise..." : "Nenhum risco crítico detectado."}
          </span>
        ) : (
          displayRisks.map((risk, idx) => (
            <span
              key={idx}
              className={cn("px-2.5 py-1 text-xs font-medium rounded-full border truncate max-w-[140px]",
                risk.severity === 'critical' ? "border-destructive/30 text-destructive bg-destructive/5" :
                  risk.severity === 'high' ? "border-neon-orange/30 text-neon-orange bg-neon-orange/5" :
                    "border-accent/30 text-accent bg-accent/5"
              )}
              title={risk.title}
            >
              {risk.title}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
