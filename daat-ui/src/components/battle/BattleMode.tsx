import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Swords, Trophy, X, Zap, Shield, Users, DollarSign, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDaatEngine } from "@/lib/daat-engine/context";
import { Competitor } from "@/lib/daat-engine/types";

interface CompetitorData {
  name: string;
  color: string;
  stats: {
    pricing: number;
    ux: number;
    features: number;
    support: number;
    innovation: number;
  };
}

const defaultCompetitors: Record<string, CompetitorData> = {
  "our-ai": {
    name: "Nossa IA",
    color: "accent",
    stats: { pricing: 85, ux: 92, features: 88, support: 95, innovation: 90 },
  },
};

const categories = [
  { key: "pricing", label: "Preço", icon: DollarSign },
  { key: "ux", label: "Experiência do Usuário", icon: Star },
  { key: "features", label: "Recursos", icon: Zap },
  { key: "support", label: "Suporte", icon: Shield },
  { key: "innovation", label: "Inovação", icon: Users },
] as const;

interface BattleModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BattleMode({ isOpen, onClose }: BattleModeProps) {
  const { getCompetitors } = useDaatEngine();
  const analysisCompetitors = getCompetitors();

  // Build competitors from Daat Engine data
  const competitors: Record<string, CompetitorData> = {
    ...defaultCompetitors,
    ...analysisCompetitors.reduce((acc, comp: Competitor) => ({
      ...acc,
      [comp.id]: {
        name: comp.name,
        color: "neon-blue",
        stats: comp.stats,
      },
    }), {}),
  };

  const [selectedCompetitor, setSelectedCompetitor] = useState<string>(
    analysisCompetitors[0]?.id || "acme"
  );

  if (!isOpen) return null;

  const ourData = competitors["our-ai"];
  const theirData = competitors[selectedCompetitor] || competitors[analysisCompetitors[0]?.id];

  if (!theirData) return null;

  const getWinner = (category: keyof CompetitorData["stats"]) => {
    const ourScore = ourData.stats[category];
    const theirScore = theirData.stats[category];
    if (ourScore > theirScore) return "us";
    if (theirScore > ourScore) return "them";
    return "tie";
  };

  const totalWins = categories.reduce(
    (acc, cat) => {
      const winner = getWinner(cat.key);
      if (winner === "us") acc.us++;
      if (winner === "them") acc.them++;
      return acc;
    },
    { us: 0, them: 0 }
  );

  const overallWinner = totalWins.us > totalWins.them ? "us" : totalWins.them > totalWins.us ? "them" : "tie";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/90 backdrop-blur-sm" onClick={onClose} />

      {/* Battle Arena */}
      <div className="relative w-full max-w-3xl max-h-[80vh] my-auto animate-scale-in flex flex-col">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute -top-12 right-0 text-muted-foreground hover:text-foreground"
        >
          <X className="w-6 h-6" />
        </Button>

        {/* VS Header */}
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
            <Swords className="w-8 h-8 text-accent" />
            Modo Batalha
            <Swords className="w-8 h-8 text-accent transform scale-x-[-1]" />
          </h2>
          <p className="text-muted-foreground">Análise competitiva frente a frente (dados do Motor Daat)</p>
        </div>

        {/* Competitor Selector */}
        <div className="flex justify-center mb-4">
          <Select value={selectedCompetitor} onValueChange={setSelectedCompetitor}>
            <SelectTrigger className="w-48 bg-secondary border-border">
              <SelectValue placeholder="Selecione o concorrente" />
            </SelectTrigger>
            <SelectContent>
              {analysisCompetitors.map((comp) => (
                <SelectItem key={comp.id} value={comp.id}>
                  {comp.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Battle Grid */}
        <div className="glass-card p-4 overflow-y-auto flex-1">
          {/* Headers */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-6">
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/20 border border-accent/30">
                <Trophy className="w-5 h-5 text-accent" />
                <span className="text-lg font-bold text-accent">{ourData.name}</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-2xl font-black text-muted-foreground">VS</span>
            </div>
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-blue/20 border border-neon-blue/30">
                <span className="text-lg font-bold text-neon-blue">{theirData.name}</span>
                <Swords className="w-5 h-5 text-neon-blue" />
              </div>
            </div>
          </div>

          {/* Category Battles */}
          <div className="space-y-4">
            {categories.map((category) => {
              const ourScore = ourData.stats[category.key];
              const theirScore = theirData.stats[category.key];
              const winner = getWinner(category.key);
              const Icon = category.icon;

              return (
                <div key={category.key} className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                  {/* Our Score */}
                  <div className="flex items-center justify-end gap-3">
                    <span className={cn(
                      "text-xl font-bold",
                      winner === "us" ? "neon-text-purple" : "text-foreground"
                    )}>
                      {ourScore}
                    </span>
                    <div className="w-32 h-3 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          winner === "us" ? "bg-accent" : "bg-muted-foreground/50"
                        )}
                        style={{ width: `${ourScore}%`, marginLeft: "auto" }}
                      />
                    </div>
                  </div>

                  {/* Category Label */}
                  <div className={cn(
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-lg min-w-[140px]",
                    winner === "tie" ? "bg-muted/30" :
                      winner === "us" ? "bg-accent/10 border border-accent/30" :
                        "bg-neon-blue/10 border border-neon-blue/30"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5",
                      winner === "tie" ? "text-muted-foreground" :
                        winner === "us" ? "text-accent" : "text-neon-blue"
                    )} />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {category.label}
                    </span>
                    {winner !== "tie" && (
                      <Trophy className={cn(
                        "w-4 h-4",
                        winner === "us" ? "text-accent" : "text-neon-blue"
                      )} />
                    )}
                  </div>

                  {/* Their Score */}
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-3 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          winner === "them" ? "bg-neon-blue" : "bg-muted-foreground/50"
                        )}
                        style={{ width: `${theirScore}%` }}
                      />
                    </div>
                    <span className={cn(
                      "text-xl font-bold",
                      winner === "them" ? "text-neon-blue" : "text-foreground"
                    )}>
                      {theirScore}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overall Winner */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className={cn(
              "text-center p-6 rounded-xl",
              overallWinner === "us" ? "bg-accent/10 border border-accent/30" :
                overallWinner === "them" ? "bg-neon-blue/10 border border-neon-blue/30" :
                  "bg-muted/20 border border-border"
            )}>
              <Trophy className={cn(
                "w-12 h-12 mx-auto mb-3",
                overallWinner === "us" ? "text-accent" :
                  overallWinner === "them" ? "text-neon-blue" :
                    "text-muted-foreground"
              )} />
              <div className="text-2xl font-bold">
                {overallWinner === "us" ? (
                  <span className="neon-text-purple">Vitória! {ourData.name} Vence</span>
                ) : overallWinner === "them" ? (
                  <span className="text-neon-blue">{theirData.name} Vence</span>
                ) : (
                  <span className="text-muted-foreground">Empate!</span>
                )}
              </div>
              <p className="text-muted-foreground mt-2">
                {totalWins.us} - {totalWins.them} em vitórias por categoria
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
