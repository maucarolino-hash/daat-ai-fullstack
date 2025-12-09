import { FeatureMatrix } from "@/components/analysis/FeatureMatrix";
import { MarketDataCard } from "@/components/analysis/MarketDataCard";
import { MonitoringRadar } from "@/components/analysis/MonitoringRadar";

const marketData = [
  { company: "Acme Corp", revenue: "$10M", growth: 15, color: "bg-accent/20" },
  { company: "Globex", revenue: "$8.5M", growth: 8, color: "bg-primary/20" },
  { company: "Soylent", revenue: "$6.2M", growth: -3, color: "bg-neon-orange/20" },
  { company: "Umbrella", revenue: "$4.8M", growth: 22, color: "bg-neon-blue/20" },
];

export default function Analysis() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Competitive Matrix</h1>
        <p className="text-muted-foreground">Deep-dive analysis of your competitive landscape</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Feature Matrix */}
        <div className="lg:col-span-1">
          <FeatureMatrix />
        </div>

        {/* Right: Market Data & Radar */}
        <div className="space-y-4">
          {/* Market Data Grid */}
          <div className="grid grid-cols-2 gap-4">
            {marketData.map((data) => (
              <MarketDataCard key={data.company} {...data} />
            ))}
          </div>

          {/* Monitoring Radar */}
          <MonitoringRadar />
        </div>
      </div>
    </div>
  );
}
