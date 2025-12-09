import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  { name: "Modelo SaaS", us: true, acme: true, globex: true, umbrella: false },
  { name: "Integração com IA", us: true, acme: false, globex: true, umbrella: false },
  { name: "Suporte 24/7", us: true, acme: true, globex: false, umbrella: true },
  { name: "Acesso à API", us: true, acme: true, globex: true, umbrella: true },
  { name: "Relatórios Personalizados", us: true, acme: false, globex: false, umbrella: false },
  { name: "Dados em Tempo Real", us: true, acme: true, globex: false, umbrella: false },
];

const columns = [
  { key: "us", label: "Nossa IA", highlight: true },
  { key: "acme", label: "Acme" },
  { key: "globex", label: "Globex" },
  { key: "umbrella", label: "Umbrella" },
];

export function FeatureMatrix() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">Matriz de Comparação de Recursos</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-sm font-medium text-muted-foreground p-4">Recurso</th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "text-center text-sm font-medium p-4",
                    col.highlight ? "text-primary bg-primary/5" : "text-muted-foreground"
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr
                key={feature.name}
                className={cn(
                  "border-b border-border/50 hover:bg-secondary/30 transition-colors",
                  index === features.length - 1 && "border-b-0"
                )}
              >
                <td className="p-4 text-sm text-foreground">{feature.name}</td>
                {columns.map((col) => {
                  const hasFeature = feature[col.key as keyof typeof feature];
                  return (
                    <td
                      key={col.key}
                      className={cn("text-center p-4", col.highlight && "bg-primary/5")}
                    >
                      {hasFeature ? (
                        <Check className="w-5 h-5 text-primary mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
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
