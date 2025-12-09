import { useEffect, useState, useRef } from "react";
import { Terminal, Sparkles } from "lucide-react";

const logLines = [
  { text: "$ initializing_market_engine...", delay: 0 },
  { text: "[INFO] Loading competitor datasets...", delay: 800 },
  { text: "[INFO] Fetching market intelligence data...", delay: 1600 },
  { text: "[CALC] calculating_tam... $4.2B", delay: 2400 },
  { text: "[CALC] market_growth_rate... 12.5% YoY", delay: 3200 },
  { text: "[AI] Running competitive analysis...", delay: 4000 },
  { text: "[SUCCESS] Analysis complete ✓", delay: 4800 },
];

const aiInsight = "Based on current market trends, your competitive position has strengthened by 15% this quarter. Key opportunity: Expand into the enterprise segment where Acme Corp shows vulnerability in customer satisfaction scores.";

interface TypedLineProps {
  text: string;
  onComplete?: () => void;
  speed?: number;
}

function TypedLine({ text, onComplete, speed = 30 }: TypedLineProps) {
  const [displayedText, setDisplayedText] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayedText("");
    
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, onComplete, speed]);

  return (
    <span>
      {displayedText}
      {displayedText.length < text.length && (
        <span className="animate-pulse text-primary">▋</span>
      )}
    </span>
  );
}

export function LiveTerminal() {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [showInsight, setShowInsight] = useState(false);
  const [displayedInsight, setDisplayedInsight] = useState("");

  useEffect(() => {
    if (currentLineIndex > 0 && currentLineIndex <= logLines.length) {
      setCompletedLines(logLines.slice(0, currentLineIndex - 1).map(l => l.text));
    }
  }, [currentLineIndex]);

  useEffect(() => {
    // Start the first line after a short delay
    const timer = setTimeout(() => {
      setCurrentLineIndex(1);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLineComplete = () => {
    if (currentLineIndex < logLines.length) {
      setTimeout(() => {
        setCompletedLines(prev => [...prev, logLines[currentLineIndex - 1].text]);
        setCurrentLineIndex(prev => prev + 1);
      }, 300);
    } else {
      setCompletedLines(prev => [...prev, logLines[currentLineIndex - 1].text]);
      setTimeout(() => setShowInsight(true), 500);
    }
  };

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
    if (text.includes("[SUCCESS]")) return "text-primary";
    if (text.includes("[AI]")) return "text-accent";
    if (text.includes("[CALC]")) return "text-neon-blue";
    if (text.includes("[INFO]")) return "text-muted-foreground";
    return "text-foreground";
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/30">
        <Terminal className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Live Analysis Terminal</span>
        <div className="ml-auto flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/70" />
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
        {currentLineIndex > 0 && currentLineIndex <= logLines.length && (
          <div className={getLineColor(logLines[currentLineIndex - 1].text)}>
            <TypedLine 
              text={logLines[currentLineIndex - 1].text} 
              onComplete={handleLineComplete}
              speed={25}
            />
          </div>
        )}
        
        {/* Waiting cursor */}
        {currentLineIndex === 0 && (
          <div className="text-muted-foreground cursor-blink">_</div>
        )}
      </div>

      {/* AI Insight Box */}
      {showInsight && (
        <div className="m-4 p-4 rounded-lg bg-accent/10 border border-accent/30 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">AI Insight</span>
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
