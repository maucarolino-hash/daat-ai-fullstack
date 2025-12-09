import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketDataCardProps {
  company: string;
  revenue: string;
  growth: number;
  color: string;
}

export function MarketDataCard({ company, revenue, growth, color }: MarketDataCardProps) {
  const isPositive = growth >= 0;
  
  return (
    <div className="glass-card p-4 group hover:border-border/80 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", color)}>
          <span className="text-sm font-bold text-foreground">{company.charAt(0)}</span>
        </div>
        <span className="font-medium text-foreground">{company}</span>
      </div>
      
      <div className="space-y-2">
        <div>
          <span className="text-xs text-muted-foreground">Revenue</span>
          <p className="text-xl font-bold text-foreground">{revenue}</p>
        </div>
        <div className="flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-primary" />
          ) : (
            <TrendingDown className="w-4 h-4 text-destructive" />
          )}
          <span className={cn("text-sm font-medium", isPositive ? "text-primary" : "text-destructive")}>
            {isPositive ? "+" : ""}{growth}% YoY
          </span>
        </div>
      </div>
    </div>
  );
}
