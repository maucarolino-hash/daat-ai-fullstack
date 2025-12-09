import { Calendar, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportCardProps {
  title: string;
  date: string;
  status: "complete" | "failed" | "processing";
  score: number;
  riskLevel: "low" | "medium" | "high";
}

export function ReportCard({ title, date, status, score, riskLevel }: ReportCardProps) {
  const statusConfig = {
    complete: { label: "Concluído", color: "bg-primary/20 text-primary border-primary/30" },
    failed: { label: "Falhou", color: "bg-destructive/20 text-destructive border-destructive/30" },
    processing: { label: "Processando", color: "bg-accent/20 text-accent border-accent/30" },
  };

  const riskConfig = {
    low: { label: "Risco Baixo", color: "text-primary" },
    medium: { label: "Risco Médio", color: "text-neon-orange" },
    high: { label: "Risco Alto", color: "text-destructive" },
  };

  return (
    <div className="glass-card-hover p-5 cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <span
          className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full border flex items-center gap-1.5",
            statusConfig[status].color
          )}
        >
          {status === "processing" && <Loader2 className="w-3 h-3 animate-spin" />}
          {statusConfig[status].label}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Calendar className="w-4 h-4" />
        <span>{date}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">Pontuação: <span className="text-foreground">{score}</span>/100</span>
        </div>
        <div className="flex items-center gap-1.5">
          <AlertCircle className={cn("w-4 h-4", riskConfig[riskLevel].color)} />
          <span className={cn("text-sm font-medium", riskConfig[riskLevel].color)}>
            {riskConfig[riskLevel].label}
          </span>
        </div>
      </div>
    </div>
  );
}
