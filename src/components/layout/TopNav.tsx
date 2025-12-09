import { ChevronRight, Plus } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const pathNames: Record<string, string> = {
  "/": "Growth Dashboard",
  "/history": "Analysis History",
  "/analysis": "Competitive Matrix",
  "/settings": "Settings",
};

interface TopNavProps {
  onGenerateReport: () => void;
}

export function TopNav({ onGenerateReport }: TopNavProps) {
  const location = useLocation();
  const currentPath = pathNames[location.pathname] || "Dashboard";

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Market Intelligence</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="text-foreground font-medium">{currentPath}</span>
      </nav>

      {/* Actions */}
      <Button onClick={onGenerateReport} variant="cyber" size="sm">
        <Plus className="w-4 h-4" />
        Generate Report
      </Button>
    </header>
  );
}
