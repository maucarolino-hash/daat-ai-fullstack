import { useEffect, useState, useCallback, memo } from "react";
import { Terminal, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotificationSound } from "@/hooks/useNotificationSound";

const logLines = [
  { text: "$ inicializando_motor_de_mercado...", delay: 0 },
  { text: "[INFO] Carregando datasets de concorrentes...", delay: 800 },
  { text: "[INFO] Buscando dados de inteligência de mercado...", delay: 1600 },
  { text: "[CALC] calculando_tam... R$21B", delay: 2400 },
  { text: "[CALC] taxa_crescimento_mercado... 12,5% ao ano", delay: 3200 },
  { text: "[AI] Executando análise competitiva...", delay: 4000 },
  { text: "[SUCESSO] Análise concluída ✓", delay: 4800 },
];

const aiInsight = "Com base nas tendências atuais do mercado, sua posição competitiva se fortaleceu em 15% neste trimestre. Oportunidade chave: Expandir para o segmento enterprise onde a Acme Corp demonstra vulnerabilidade nas pontuações de satisfação do cliente.";

interface TypedLineProps {
  text: string;
  onComplete: () => void;
  speed?: number;
}

const TypedLine = memo(function TypedLine({ text, onComplete, speed = 25 }: TypedLineProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    setIsComplete(false);
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <span>
      {displayedText}
      {!isComplete && <span className="animate-pulse text-primary">▋</span>}
    </span>
  );
});

export function LiveTerminal() {
  const [currentLineIndex, setCurrentLineIndex] = useState(-1);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [showInsight, setShowInsight] = useState(false);
  const [displayedInsight, setDisplayedInsight] = useState("");
  const [isTypingLine, setIsTypingLine] = useState(false);
  const { playBeep } = useNotificationSound();

  // Start the animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentLineIndex(0);
      setIsTypingLine(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLineComplete = useCallback(() => {
    setIsTypingLine(false);
    
    setTimeout(() => {
      setCompletedLines(prev => {
        const currentText = logLines[prev.length]?.text;
        if (currentText && !prev.includes(currentText)) {
          return [...prev, currentText];
        }
        return prev;
      });
      
      setCurrentLineIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex < logLines.length) {
          setIsTypingLine(true);
          return nextIndex;
        } else {
          // Play notification sound when analysis completes
          playBeep();
          setTimeout(() => setShowInsight(true), 500);
          return prev;
        }
      });
    }, 300);
  }, []);

  // AI Insight typing effect
  useEffect(() => {
    if (showInsight) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= aiInsight.length) {
          setDisplayedInsight(aiInsight.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 20);
      return () => clearInterval(interval);
    }
  }, [showInsight]);

  const getLineColor = (text: string) => {
    if (text.includes("[SUCESSO]")) return "text-primary";
    if (text.includes("[AI]")) return "text-accent";
    if (text.includes("[CALC]")) return "text-neon-blue";
    if (text.includes("[INFO]")) return "text-muted-foreground";
    return "text-foreground";
  };

  const currentLine = currentLineIndex >= 0 && currentLineIndex < logLines.length 
    ? logLines[currentLineIndex] 
    : null;

  const isScanning = currentLineIndex >= 0 && currentLineIndex < logLines.length;

  return (
    <div className="glass-card overflow-hidden relative">
      {/* Scanning overlay effect */}
      {isScanning && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-scan" />
        </div>
      )}
      
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
        <Terminal className={cn("w-4 h-4", isScanning ? "text-primary animate-pulse" : "text-primary")} />
        <span className="text-sm font-medium text-foreground">Terminal de Análise em Tempo Real</span>
        {isScanning && (
          <span className="ml-2 text-xs text-primary animate-pulse font-mono">[SCANNING]</span>
        )}
        <div className="ml-auto flex gap-1.5">
          <div className={cn("w-3 h-3 rounded-full", isScanning ? "bg-primary animate-pulse" : "bg-destructive/70")} />
          <div className="w-3 h-3 rounded-full bg-neon-orange/70" />
          <div className="w-3 h-3 rounded-full bg-primary/70" />
        </div>
      </div>

      {/* Terminal Body */}
      <div className="terminal-bg p-4 min-h-[250px] font-mono text-sm space-y-1.5 overflow-y-auto scrollbar-thin">
        {/* Completed lines */}
        {completedLines.map((line, index) => (
          <div key={index} className={getLineColor(line)}>
            {line}
          </div>
        ))}
        
        {/* Currently typing line */}
        {isTypingLine && currentLine && (
          <div className={getLineColor(currentLine.text)}>
            <TypedLine 
              text={currentLine.text} 
              onComplete={handleLineComplete}
              speed={25}
            />
          </div>
        )}
        
        {/* Waiting cursor before animation starts */}
        {currentLineIndex === -1 && (
          <div className="text-muted-foreground cursor-blink">_</div>
        )}
      </div>

      {/* AI Insight Box */}
      {showInsight && (
        <div className="m-4 p-4 rounded-lg bg-accent/10 border border-accent/30 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">Insight de IA</span>
          </div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {displayedInsight}
            {displayedInsight.length < aiInsight.length && (
              <span className="animate-pulse text-accent">▋</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
