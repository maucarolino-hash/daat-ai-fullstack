import { Grid3X3, CheckCircle2, XCircle } from "lucide-react";
import { FeatureMatrix } from "@/components/analysis/FeatureMatrix";

export default function AnalysisFeatures() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Matriz de Recursos</h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Comparação detalhada de funcionalidades entre concorrentes
        </p>
      </div>

      {/* Legend Card */}
      <div className="glass-card p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-medium text-foreground">Recurso Disponível</span>
              <p className="text-xs sm:text-sm text-muted-foreground">Funcionalidade implementada</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-muted/50 flex items-center justify-center">
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/50" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-medium text-foreground">Recurso Ausente</span>
              <p className="text-xs sm:text-sm text-muted-foreground">Não disponível no produto</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Matrix - Full Width */}
      <FeatureMatrix />
    </div>
  );
}
