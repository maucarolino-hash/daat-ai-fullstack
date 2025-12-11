import { Radar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export function MonitoringRadar() {
  const [active, setActive] = useState(false);

  const handleActivate = () => {
    setActive(true);
    toast.success("Radar de Monitoramento Ativado", {
      description: "Você receberá alertas em tempo real sobre movimentações dos concorrentes.",
    });
  };

  return (
    <div className="glass-card p-5 relative overflow-hidden">
      {active && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent animate-pulse-glow" />
        </div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? 'bg-accent/20' : 'bg-secondary'}`}>
            <Radar className={`w-5 h-5 ${active ? 'text-accent animate-pulse' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Radar de Monitoramento</h3>
            <p className="text-xs text-muted-foreground">
              {active ? "Escaneando ativamente..." : "Rastreamento de concorrentes em tempo real"}
            </p>
          </div>
        </div>
        
        {!active ? (
          <Button onClick={handleActivate} variant="neon" className="w-full">
            <Zap className="w-4 h-4" />
            Ativar Radar
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-sm text-accent">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Monitorando 4 concorrentes</span>
          </div>
        )}
      </div>
    </div>
  );
}
