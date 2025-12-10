import { cn } from "@/lib/utils";

interface DaatLogoProps {
  isCollapsed?: boolean;
  className?: string;
}

export function DaatLogo({ isCollapsed = false, className }: DaatLogoProps) {
  return (
    <div className={cn("flex items-center overflow-hidden", className)}>
      {/* Icon - always visible */}
      <svg
        viewBox="0 0 280 280"
        className={cn(
          "flex-shrink-0 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          isCollapsed ? "w-8 h-8" : "w-10 h-10"
        )}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-sidebar-primary transition-colors duration-300"
          d="M140,10c-71.8,4.5-130.2,62.7-135,134.4c-5.6,83.5,59.8,153,141.7,154.5v150.7h12.2V297.4
          c75.4-4.9,135.1-67.6,135.1-144.3C294,70.1,224.2,4.4,140,10z M146.7,288.5c-72.9-1.4-131.6-60.8-131.6-134.1
          S73.7,20.6,147.4,20.1v48.8l42.9-42.9l5,5l-47.9,47.9v42.5l75.2-75.2l5,5l-80.2,80.2v39.7l95.7-95.7l5,5l-100.7,100.7v40.4
          l112.8-112.8l5,5l-117.8,117.8v41l123.9-122l6.2,6.1l-120.8,119c-6-5.9-13.4-10.2-21.5-12.4"
          transform="translate(-5, -10) scale(0.95)"
        />
      </svg>

      {/* Text - hidden when collapsed */}
      <svg
        viewBox="0 0 200 60"
        className={cn(
          "transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          isCollapsed 
            ? "w-0 opacity-0 ml-0" 
            : "w-28 opacity-100 ml-1"
        )}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="0"
          y="42"
          className="fill-sidebar-foreground transition-colors duration-300"
          style={{ 
            fontSize: '38px', 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 600
          }}
        >
          Daat
        </text>
        <text
          x="108"
          y="42"
          className="fill-sidebar-primary transition-colors duration-300"
          style={{ 
            fontSize: '30px', 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 500
          }}
        >
          .AI
        </text>
      </svg>
    </div>
  );
}
