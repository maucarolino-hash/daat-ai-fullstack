import { useEffect, useState } from "react";
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

export function LiveTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [showInsight, setShowInsight] = useState(false);
  const [displayedInsight, setDisplayedInsight] = useState("");

  useEffect(() => {
    logLines.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines(index + 1);
      }, line.delay);
    });

    setTimeout(() => {
      setShowInsight(true);
    }, 5500);
  }, []);

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
        {logLines.slice(0, visibleLines).map((line, index) => (
          <div
            key={index}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className={
              line.text.includes("[SUCCESS]") ? "text-primary" :
              line.text.includes("[AI]") ? "text-accent" :
              line.text.includes("[CALC]") ? "text-neon-blue" :
              line.text.includes("[INFO]") ? "text-muted-foreground" :
              "text-foreground"
            }>
              {line.text}
            </span>
          </div>
        ))}
        
        {visibleLines === logLines.length && !showInsight && (
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
