import { cn } from "@/lib/utils";
import { LucideIcon, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
  tooltip?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  children,
  className,
  tooltip,
}: StatCardProps) {
  return (
    <div className={cn("glass-card p-5", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground font-medium">{title}</span>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help hover:text-muted-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <p className="text-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
            <Icon className="w-4 h-4 text-accent" />
          </div>
        )}
      </div>
      
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold text-foreground tracking-tight">{value}</span>
        {change && (
          <span
            className={cn(
              "text-sm font-medium px-2 py-0.5 rounded-full",
              changeType === "positive" && "bg-primary/20 text-primary",
              changeType === "negative" && "bg-destructive/20 text-destructive",
              changeType === "neutral" && "bg-muted text-muted-foreground"
            )}
          >
            {change}
          </span>
        )}
      </div>
      
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
