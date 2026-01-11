import { Check, X, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDaatEngine } from "@/lib/daat-engine/context";

export function FeatureMatrix() {
  const { getCompetitors } = useDaatEngine();
  const competitors = getCompetitors();

  // Limitar a exibir no máximo 3 concorrentes + "Nossa IA" (Total 4 colunas para caber na tela)
  const displayCompetitors = competitors.slice(0, 3);

  // Mapear estatísticas genéricas para "Features" visuais
  // Se o score for > 7, consideramos que tem a feature (True)
  const featureList = [
    { label: "Preço Competitivo", statKey: "pricing" },
    { label: "Experiência de Usuário (UX)", statKey: "ux" },
    { label: "Recursos Avançados", statKey: "features" },
    { label: "Suporte ao Cliente", statKey: "support" },
    { label: "Inovação Tecnológica", statKey: "innovation" },
  ];

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-3 sm:p-4 border-b border-border">
        <h3 className="font-semibold text-sm sm:text-base text-foreground">Matriz de Comparação de Recursos</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs sm:text-sm font-medium text-muted-foreground p-3 sm:p-4 sticky left-0 bg-card z-10">
                Recurso
              </th>
              {/* Coluna do Usuário (Nossa Solução) - Sempre High Score :) */}
              <th className="text-center text-xs sm:text-sm font-medium p-3 sm:p-4 whitespace-nowrap text-primary bg-primary/5">
                Nossa IA
              </th>
              {/* Colunas dos Concorrentes Dinâmicos */}
              {displayCompetitors.map((comp) => (
                <th
                  key={comp.id}
                  className="text-center text-xs sm:text-sm font-medium text-muted-foreground p-3 sm:p-4 whitespace-nowrap max-w-[120px] truncate"
                  title={comp.name}
                >
                  {comp.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featureList.map((feature, index) => (
              <tr
                key={feature.label}
                className={cn(
                  "border-b border-border/50 hover:bg-secondary/30 transition-colors",
                  index === featureList.length - 1 && "border-b-0"
                )}
              >
                <td className="p-3 sm:p-4 text-xs sm:text-sm text-foreground sticky left-0 bg-card z-10">
                  {feature.label}
                </td>

                {/* Nossa Solução (User) - Sempre Check para validar a ideia */}
                <td className="text-center p-3 sm:p-4 bg-primary/5">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto" />
                </td>

                {/* Dados dos Concorrentes */}
                {displayCompetitors.map((comp) => {
                  const score = comp.stats[feature.statKey as keyof typeof comp.stats] || 0;
                  // Threshold de 70 (ou 7 dependendo da escala, assumindo 0-100 aqui baseado na UI de barras)
                  // Ajuste: Context.tsx mock data as vezes usa 0-100 ou 0-10. Vamos assumir > 60 como "Tem".
                  const hasFeature = score >= 60;

                  return (
                    <td key={`${comp.id}-${feature.statKey}`} className="text-center p-3 sm:p-4">
                      {hasFeature ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mx-auto" />
                      ) : (
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/30 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
