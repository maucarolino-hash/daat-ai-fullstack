import { ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";

const pathNames: Record<string, string> = {
  "/": "Painel de Crescimento",
  "/dashboard": "Painel de Crescimento",
  "/history": "Histórico de Análises",
  "/analysis": "Matriz Competitiva",
  "/report": "Relatório Daat AI",
  "/settings": "Configurações",
};

export function TopNav() {
  const location = useLocation();
  const currentPath = pathNames[location.pathname] || "Painel";

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center px-6 sticky top-0 z-40">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Inteligência de Mercado</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
        <span className="text-foreground font-medium">{currentPath}</span>
      </nav>
    </header>
  );
}
