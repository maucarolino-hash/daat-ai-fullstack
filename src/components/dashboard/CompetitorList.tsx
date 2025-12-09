import { cn } from "@/lib/utils";

const competitors = [
  { name: "Acme Corp", presence: 85, color: "from-accent to-neon-blue" },
  { name: "Globex", presence: 72, color: "from-primary to-emerald-400" },
  { name: "Soylent", presence: 58, color: "from-neon-orange to-amber-400" },
  { name: "Umbrella", presence: 45, color: "from-neon-red to-rose-400" },
];

export function CompetitorList() {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm text-muted-foreground font-medium mb-4">Concorrentes</h3>
      <div className="space-y-4">
        {competitors.map((competitor) => (
          <div key={competitor.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground font-medium">{competitor.name}</span>
              <span className="text-muted-foreground">{competitor.presence}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", competitor.color)}
                style={{ width: `${competitor.presence}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
