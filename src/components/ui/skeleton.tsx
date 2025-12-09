import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "cyber";
}

function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
  return (
    <div 
      className={cn(
        "rounded-md",
        variant === "cyber" 
          ? "skeleton-cyber" 
          : "animate-pulse bg-muted",
        className
      )} 
      {...props} 
    />
  );
}

export { Skeleton };
