import { Radar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export function MonitoringRadar() {
  const [active, setActive] = useState(false);

  const handleActivate = () => {
    setActive(true);
    toast.success("Monitoring Radar Activated", {
      description: "You'll receive real-time alerts for competitor movements.",
    });
  };

  return (
    <div className="glass-card p-5 relative overflow-hidden">
      {/* Animated background */}
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
            <h3 className="font-semibold text-foreground">Monitoring Radar</h3>
            <p className="text-xs text-muted-foreground">
              {active ? "Actively scanning..." : "Real-time competitor tracking"}
            </p>
          </div>
        </div>
        
        {!active ? (
          <Button onClick={handleActivate} variant="neon" className="w-full">
            <Zap className="w-4 h-4" />
            Activate Radar
          </Button>
        ) : (
          <div className="flex items-center gap-2 text-sm text-accent">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Monitoring 4 competitors</span>
          </div>
        )}
      </div>
    </div>
  );
}
