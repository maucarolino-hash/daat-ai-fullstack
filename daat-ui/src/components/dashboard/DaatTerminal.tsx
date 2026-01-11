import { useEffect, useRef } from "react";
import { Terminal, Sparkles, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useDaatEngine } from "@/lib/daat-engine/context";
import { PHASE_NAMES, TerminalLog } from "@/lib/daat-engine/types";
import { cn } from "@/lib/utils";

export function DaatTerminal() {
  const { state } = useDaatEngine();
  const { isAnalyzing, currentPhase, logs, result } = state;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const progressPercent = ((currentPhase - 1) / 4) * 100 + (isAnalyzing ? 12.5 : 25);

  const getLogColor = (log: TerminalLog) => {
    switch (log.type) {
      case 'command': return 'text-foreground';
      case 'success': return 'text-primary';
      case 'warning': return 'text-neon-orange';
      case 'calc': return 'text-neon-blue';
      case 'ai': return 'text-accent';
      case 'info': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const showInsight = result && !isAnalyzing;

  return (
    <div className={cn(
      "glass-card overflow-hidden transition-all duration-500",
      isAnalyzing && "border-primary/50 shadow-[0_0_30px_-5px_rgba(var(--primary-rgb),0.3)] ring-1 ring-primary/20"
    )}>
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
        <Terminal className={cn("w-4 h-4 text-primary", isAnalyzing && "animate-pulse")} />
        <span className="text-sm font-medium text-foreground">Motor Daat AI</span>
        <div className="ml-auto flex gap-1.5">
          <div className={cn("w-3 h-3 rounded-full bg-destructive/70", isAnalyzing && "animate-bounce delay-75")} />
          <div className={cn("w-3 h-3 rounded-full bg-neon-orange/70", isAnalyzing && "animate-bounce delay-150")} />
          <div className={cn("w-3 h-3 rounded-full bg-primary/70", isAnalyzing && "animate-bounce delay-300")} />
        </div>
      </div>

      {/* Phase Progress */}
      {(isAnalyzing || logs.length > 0) && (
        <div className="px-4 py-3 border-b border-border bg-secondary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Fase {currentPhase}/4: {PHASE_NAMES[currentPhase]}
            </span>
            <span className="text-xs text-accent font-mono">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />

          {/* Phase Indicators */}
          <div className="flex justify-between mt-2">
            {[1, 2, 3, 4].map((phase) => (
              <div
                key={phase}
                className={cn(
                  "flex items-center gap-1 text-xs",
                  phase < currentPhase ? "text-primary" :
                    phase === currentPhase ? "text-accent" :
                      "text-muted-foreground/50"
                )}
              >
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  phase < currentPhase ? "bg-primary" :
                    phase === currentPhase ? "bg-accent animate-pulse" :
                      "bg-muted-foreground/30"
                )} />
                <span className="hidden sm:inline">{phase}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Terminal Body */}
      <div
        ref={scrollRef}
        className="terminal-bg p-4 min-h-[300px] max-h-[400px] font-mono text-sm space-y-1 overflow-y-auto scrollbar-thin"
      >
        {logs.length === 0 && !isAnalyzing && (
          <div className="text-muted-foreground cursor-blink">
            $ aguardando_analise...
          </div>
        )}

        {logs.map((log, index) => (
          <div
            key={index}
            className={cn(
              getLogColor(log),
              "animate-fade-in"
            )}
          >
            {log.text}
          </div>
        ))}

        {isAnalyzing && (
          <div className="text-accent flex items-center gap-2 mt-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs text-muted-foreground animate-pulse">Processando...</span>
          </div>
        )}
      </div>

      {/* AI Insight Box - Shows when analysis is complete */}
      {showInsight && (
        <div className="m-4 p-4 rounded-lg bg-accent/10 border border-accent/30 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              Resultado Daat AI
            </span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            Análise completa para <strong>{state.segment}</strong>.
            Pontuação final: <span className="text-accent font-bold">{result.scoreBreakdown.totalScore}/100</span> ({result.scoreBreakdown.classification}).
            Identificados {result.competitors.length} concorrentes e {result.riskAssessment.risks.length} riscos críticos.
            Roadmap de 90 dias gerado com {result.strategicAdvice.roadmap.length} ações prioritárias.
          </p>
        </div>
      )}
    </div>
  );
}
