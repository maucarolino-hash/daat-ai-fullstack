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
        viewBox="0 0 100 140"
        className={cn(
          "flex-shrink-0 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          isCollapsed ? "w-6 h-8" : "w-7 h-10"
        )}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-sidebar-primary transition-colors duration-300"
          d="M50,2c-26.8,1.7-48.6,23.4-50.4,50.2c-2.1,31.2,22.3,57.1,52.9,57.7v56.3h4.6v-56.6
          c28.2-1.8,50.4-25.2,50.4-53.9C107.5,24.1,81.4,0.5,50,2z M52.5,106c-27.2-0.5-49.1-22.7-49.1-50.1
          S27.5,5.6,55,5.4v18.2l16-16l1.9,1.9l-17.9,17.9v15.9l28.1-28.1l1.9,1.9l-30,30v14.8l35.7-35.7l1.9,1.9l-37.6,37.6v15.1
          l42.1-42.1l1.9,1.9l-44,44v15.3l46.3-45.6l2.3,2.3l-45.1,44.4c-2.2-2.2-5-3.8-8-4.6"
        />
      </svg>

      {/* Text - hidden when collapsed */}
      <svg
        viewBox="0 0 95 30"
        className={cn(
          "transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          isCollapsed 
            ? "w-0 opacity-0 ml-0" 
            : "w-20 opacity-100 ml-2"
        )}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text
          x="0"
          y="22"
          className="fill-sidebar-foreground transition-colors duration-300"
          style={{ 
            fontSize: '22px', 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 600
          }}
        >
          Daat
        </text>
        <text
          x="52"
          y="22"
          className="fill-sidebar-primary transition-colors duration-300"
          style={{ 
            fontSize: '18px', 
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
