import { AlertTriangle } from "lucide-react";

const riskTags = ["High CAC", "Retention", "Churn Risk", "Price War"];

export function RiskCard() {
  return (
    <div className="glass-card p-5 border-neon-orange/30">
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm text-muted-foreground font-medium">Risk Detected</span>
        <div className="w-8 h-8 rounded-lg bg-neon-orange/20 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-neon-orange" />
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl font-bold text-neon-orange">Moderate</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-neon-orange animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-neon-orange/50" />
          <div className="w-2 h-2 rounded-full bg-muted" />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {riskTags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-1 text-xs font-medium bg-neon-orange/10 text-neon-orange rounded-full border border-neon-orange/20"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
