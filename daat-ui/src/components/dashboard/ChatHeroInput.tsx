import { useState } from "react";
import { Sparkles, ArrowUp, Zap, Target, BarChart3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatHeroInputProps {
  onStartAnalysis: (segment: string) => void;
  isAnalyzing: boolean;
}

const suggestionChips = [
  { icon: Target, label: "SaaS B2B no Brasil" },
  { icon: BarChart3, label: "Fintech de pagamentos" },
  { icon: Shield, label: "HealthTech telemedicina" },
];

export function ChatHeroInput({ onStartAnalysis, isAnalyzing }: ChatHeroInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    if (input.trim() && !isAnalyzing) {
      onStartAnalysis(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Hero Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-accent">Motor Daat AI</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Qual mercado você quer{" "}
          <span className="neon-text-purple">analisar?</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Análise competitiva profunda com IA em 4 fases: pesquisa, análise crítica, pontuação e consultoria estratégica.
        </p>
      </div>

      {/* Chat Input Box */}
      <div className="relative">
        <div className={cn(
          "glass-card p-2 transition-all duration-300",
          "focus-within:border-accent/50 focus-within:cyber-glow"
        )}>
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ex: SaaS de gestão financeira para PMEs no Brasil..."
                disabled={isAnalyzing}
                className={cn(
                  "w-full bg-transparent border-0 resize-none text-foreground placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-0 p-3 min-h-[60px] max-h-[200px]",
                  "text-base leading-relaxed"
                )}
                rows={2}
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!input.trim() || isAnalyzing}
              size="icon"
              className={cn(
                "h-12 w-12 rounded-xl shrink-0 transition-all duration-300",
                input.trim() && !isAnalyzing
                  ? "bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/20"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {isAnalyzing ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowUp className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Powered by badge */}
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3" />
          <span>Powered by Daat AI Engine • Análise em 4 fases</span>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="flex flex-col items-center gap-3 mt-6 px-4">
        <span className="text-sm text-muted-foreground">Experimente:</span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {suggestionChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => setInput(chip.label)}
              disabled={isAnalyzing}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-full",
                "bg-secondary/50 border border-border hover:border-accent/30 hover:bg-secondary",
                "text-xs sm:text-sm text-foreground transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <chip.icon className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
              {chip.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
