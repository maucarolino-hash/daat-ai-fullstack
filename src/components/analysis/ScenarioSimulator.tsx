import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, Megaphone, BarChart3 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const baseMarketShare = 12.5;
const competitors = [
  { name: "Acme Corp", share: 24 },
  { name: "Globex", share: 18 },
  { name: "Soylent", share: 15 },
  { name: "Umbrella", share: 12 },
];

export function ScenarioSimulator() {
  const [pricing, setPricing] = useState(0);
  const [marketing, setMarketing] = useState(0);

  // Calculate projected market share based on sliders
  const projectedShare = useMemo(() => {
    // Simple simulation: marketing increases share, higher prices decrease it
    const marketingEffect = marketing * 0.08; // +0.08% per 1% marketing increase
    const pricingEffect = pricing * -0.05; // -0.05% per 1% price increase
    return Math.max(0, Math.min(100, baseMarketShare + marketingEffect + pricingEffect));
  }, [pricing, marketing]);

  const projectionData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, i) => {
      const growth = (projectedShare - baseMarketShare) / 6 * (i + 1);
      return {
        month,
        current: baseMarketShare,
        projected: baseMarketShare + growth,
      };
    });
  }, [projectedShare]);

  const shareChange = projectedShare - baseMarketShare;

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Scenario Simulator</h3>
          <p className="text-sm text-muted-foreground">What-if analysis for market share prediction</p>
        </div>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-neon-orange" />
            <span className="text-sm font-medium text-foreground">Pricing Adjustment</span>
            <span className={`ml-auto text-sm font-mono ${pricing >= 0 ? "text-destructive" : "text-primary"}`}>
              {pricing >= 0 ? "+" : ""}{pricing}%
            </span>
          </div>
          <Slider
            value={[pricing]}
            onValueChange={(v) => setPricing(v[0])}
            min={-30}
            max={30}
            step={1}
            className="[&_[role=slider]]:bg-neon-orange [&_[role=slider]]:border-neon-orange"
          />
          <p className="text-xs text-muted-foreground">
            Lower prices attract more customers but reduce margins
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">Marketing Budget</span>
            <span className={`ml-auto text-sm font-mono ${marketing > 0 ? "text-primary" : "text-muted-foreground"}`}>
              {marketing >= 0 ? "+" : ""}{marketing}%
            </span>
          </div>
          <Slider
            value={[marketing]}
            onValueChange={(v) => setMarketing(v[0])}
            min={0}
            max={100}
            step={5}
            className="[&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent"
          />
          <p className="text-xs text-muted-foreground">
            Increased marketing spend improves brand awareness
          </p>
        </div>
      </div>

      {/* Prediction Result */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-secondary/50 border border-border">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Current Share</span>
          <div className="text-2xl font-bold text-foreground mt-1">{baseMarketShare}%</div>
        </div>
        <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
          <span className="text-xs text-accent uppercase tracking-wider">Projected Share</span>
          <div className="text-2xl font-bold neon-text-purple mt-1">{projectedShare.toFixed(1)}%</div>
        </div>
        <div className={`p-4 rounded-lg border ${shareChange >= 0 ? "bg-primary/10 border-primary/30" : "bg-destructive/10 border-destructive/30"}`}>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Change</span>
          <div className={`text-2xl font-bold mt-1 flex items-center gap-2 ${shareChange >= 0 ? "neon-text-green" : "neon-text-red"}`}>
            <TrendingUp className={`w-5 h-5 ${shareChange < 0 ? "rotate-180" : ""}`} />
            {shareChange >= 0 ? "+" : ""}{shareChange.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={projectionData}>
            <defs>
              <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217, 33%, 30%)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(217, 33%, 30%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(271, 91%, 65%)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(271, 91%, 65%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 15%)" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(215, 20%, 55%)" 
              fontSize={12}
              domain={[0, 30]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(222, 47%, 6%)",
                border: "1px solid hsl(217, 33%, 15%)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 98%)",
              }}
              formatter={(value: number) => [`${value.toFixed(1)}%`, ""]}
            />
            <Area
              type="monotone"
              dataKey="current"
              stroke="hsl(217, 33%, 40%)"
              fillOpacity={1}
              fill="url(#currentGradient)"
              name="Current"
            />
            <Area
              type="monotone"
              dataKey="projected"
              stroke="hsl(271, 91%, 65%)"
              fillOpacity={1}
              fill="url(#projectedGradient)"
              name="Projected"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Competitor Impact */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Competitor Ranking (Projected)</h4>
        <div className="space-y-2">
          {[...competitors, { name: "Our AI", share: projectedShare }]
            .sort((a, b) => b.share - a.share)
            .map((c, i) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="w-5 text-xs text-muted-foreground">#{i + 1}</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      c.name === "Our AI" ? "gradient-progress" : "bg-muted-foreground/30"
                    }`}
                    style={{ width: `${(c.share / 30) * 100}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${c.name === "Our AI" ? "text-accent" : "text-foreground"}`}>
                  {c.name}
                </span>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {c.share.toFixed(1)}%
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}