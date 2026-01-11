import { cn } from "@/lib/utils";

import { useDaatEngine } from "@/lib/daat-engine/context";

export function CompetitorList() {
  const { state } = useDaatEngine();
  const { result } = state;

  // Use real competitors if available, otherwise show empty or fallback
  const realCompetitors = result?.competitors || [];

  // Fallback visual colors
  const getCompetitorColor = (index: number) => {
    const colors = [
      "from-accent to-neon-blue",
      "from-primary to-emerald-400",
      "from-neon-orange to-amber-400",
      "from-neon-red to-rose-400"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm text-muted-foreground font-medium">Concorrentes</h3>
        <span className="text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
          {realCompetitors.length}
        </span>
      </div>

      <div className="space-y-4">
        {realCompetitors.length === 0 ? (
          <p className="text-xs text-muted-foreground">Nenhum concorrente identificado ainda.</p>
        ) : (
          realCompetitors.map((competitor, idx) => (
            <div key={competitor.id || idx} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium truncate max-w-[150px]" title={competitor.name}>{competitor.name}</span>
                <span className="text-muted-foreground">{competitor.marketShare}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", getCompetitorColor(idx))}
                  style={{ width: `${Math.min(competitor.marketShare * 2, 100)}%` }} // Scale for visibility
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
