import { useLocation } from "react-router-dom";

const pathNames: Record<string, string> = {
  "/": "Início",
  "/dashboard": "Dashboard",
  "/history": "Histórico de Análises",
  "/analysis": "Matriz Competitiva",
  "/analysis/overview": "Visão Geral",
  "/analysis/simulator": "Simulador de Cenários",
  "/analysis/features": "Matriz de Recursos",
  "/report": "Relatório Daat AI",
  "/settings": "Configurações",
};

import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

export function TopNav() {
  const location = useLocation();
  const currentPath = pathNames[location.pathname] || "Painel";
  const { user } = useAuth();

  return (
    <nav className="flex items-center justify-between w-full gap-2 text-sm pr-4">
      <span className="text-foreground font-medium">{currentPath}</span>

      {user && (
        <div className="flex items-center gap-2">
          <Badge variant={user.credits && user.credits > 0 ? "secondary" : "destructive"} className="h-7 px-3">
            💎 {user.credits ?? 0} Créditos
          </Badge>
        </div>
      )}
    </nav>
  );
}
