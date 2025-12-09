import { useNavigate } from "react-router-dom";
import { useDaatEngine } from "@/lib/daat-engine/context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Download,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Stamp,
  Clock,
  Building2,
  Hash,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalysisReport() {
  const navigate = useNavigate();
  const { state } = useDaatEngine();
  const { result } = state;

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <FileText className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">Nenhuma análise disponível</h2>
        <p className="text-muted-foreground">Execute uma nova análise para ver o relatório</p>
        <Button onClick={() => navigate('/dashboard')} variant="cyber">
          Ir para Dashboard
        </Button>
      </div>
    );
  }

  const { marketData, competitors, riskAssessment, scoreBreakdown, strategicAdvice } = result;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-accent';
    if (score >= 40) return 'text-neon-orange';
    return 'text-destructive';
  };

  const getClassificationBadge = (classification: string) => {
    switch (classification) {
      case 'Alta Viabilidade': return 'bg-primary/15 text-primary border border-primary/30';
      case 'Viabilidade Moderada': return 'bg-accent/15 text-accent border border-accent/30';
      case 'Baixa Viabilidade': return 'bg-neon-orange/15 text-neon-orange border border-neon-orange/30';
      default: return 'bg-destructive/15 text-destructive border border-destructive/30';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical': return { label: 'CRÍTICO', class: 'text-destructive' };
      case 'high': return { label: 'ALTO', class: 'text-neon-orange' };
      case 'medium': return { label: 'MÉDIO', class: 'text-accent' };
      default: return { label: 'BAIXO', class: 'text-muted-foreground' };
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical': return { label: 'Crítica', class: 'text-destructive font-semibold' };
      case 'high': return { label: 'Alta', class: 'text-neon-orange font-medium' };
      default: return { label: 'Média', class: 'text-muted-foreground' };
    }
  };

  const reportId = `DAAT-${result.id.slice(0, 8).toUpperCase()}`;
  const formattedDate = result.createdAt.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = result.createdAt.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </Button>
        <Button variant="neon" className="gap-2">
          <Download className="w-4 h-4" />
          Exportar PDF Oficial
        </Button>
      </div>

      {/* Document Container */}
      <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
        
        {/* Document Header - Institutional */}
        <div className="bg-secondary/30 border-b border-border px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-neon-blue to-accent flex items-center justify-center">
                <Stamp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">
                  LAUDO DE ANÁLISE COMPETITIVA
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Daat AI Engine • Relatório Automatizado
                </p>
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="flex items-center gap-2 text-muted-foreground justify-end">
                <Hash className="w-3.5 h-3.5" />
                <span className="font-mono">{reportId}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mt-1 justify-end">
                <Clock className="w-3.5 h-3.5" />
                <span>{formattedDate} às {formattedTime}</span>
              </div>
            </div>
          </div>

          {/* Subject Line */}
          <div className="mt-6 p-4 bg-background/50 rounded-lg border border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-1">
              <Building2 className="w-3.5 h-3.5" />
              Objeto de Análise
            </div>
            <p className="text-lg font-semibold text-foreground">{result.segment}</p>
          </div>
        </div>

        {/* Score Verdict Section */}
        <div className="px-8 py-6 border-b border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-4">
            <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-foreground font-bold text-xs">§</span>
            Parecer Final
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Score Display */}
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-20 h-20 rounded-lg flex flex-col items-center justify-center border-2",
                scoreBreakdown.totalScore >= 70 ? "border-primary bg-primary/5" : 
                scoreBreakdown.totalScore >= 50 ? "border-accent bg-accent/5" : "border-destructive bg-destructive/5"
              )}>
                <span className={cn("text-3xl font-bold", getScoreColor(scoreBreakdown.totalScore))}>
                  {scoreBreakdown.totalScore}
                </span>
                <span className="text-xs text-muted-foreground">pontos</span>
              </div>
              <div>
                <Badge className={cn("mb-2 text-sm px-3 py-1", getClassificationBadge(scoreBreakdown.classification))}>
                  {scoreBreakdown.classification}
                </Badge>
                <p className="text-sm text-muted-foreground">Índice de Viabilidade Daat</p>
              </div>
            </div>

            <Separator orientation="vertical" className="h-16 hidden md:block" />

            {/* Score Breakdown Table */}
            <div className="flex-1 w-full">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">Oportunidade de Mercado</td>
                    <td className="py-2 text-right font-mono font-medium text-foreground">{scoreBreakdown.marketOpportunity}/30</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">Posição Competitiva</td>
                    <td className="py-2 text-right font-mono font-medium text-foreground">{scoreBreakdown.competitivePosition}/30</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">Viabilidade de Execução</td>
                    <td className="py-2 text-right font-mono font-medium text-foreground">{scoreBreakdown.executionViability}/25</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">Ajuste de Risco</td>
                    <td className="py-2 text-right font-mono font-medium text-destructive">{scoreBreakdown.riskAdjustment}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 1: Market Data */}
        <div className="px-8 py-6 border-b border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-4">
            <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-foreground font-bold text-xs">1</span>
            Dados de Mercado
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-secondary/30 rounded-lg border border-border">
              <span className="text-xs text-muted-foreground block mb-1">TAM (Mercado Total)</span>
              <span className="text-xl font-bold text-foreground">{marketData.tam}</span>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg border border-border">
              <span className="text-xs text-muted-foreground block mb-1">Crescimento Anual</span>
              <span className="text-xl font-bold text-primary flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {marketData.growthRate}%
              </span>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg border border-border">
              <span className="text-xs text-muted-foreground block mb-1">Concorrentes</span>
              <span className="text-xl font-bold text-foreground">{competitors.length} identificados</span>
            </div>
          </div>

          {/* Competitors Table */}
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Empresa</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Receita</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Market Share</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Crescimento</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((comp, index) => (
                  <tr key={comp.id} className={cn(index !== competitors.length - 1 && "border-b border-border/50")}>
                    <td className="py-3 px-4 font-medium text-foreground">{comp.name}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground font-mono">{comp.revenue}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground font-mono">{comp.marketShare}%</td>
                    <td className="py-3 px-4 text-right">
                      <span className={cn(
                        "inline-flex items-center gap-1 font-mono",
                        comp.growth >= 0 ? "text-primary" : "text-destructive"
                      )}>
                        {comp.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {comp.growth}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Trends */}
          <div className="mt-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Tendências Identificadas</span>
            <div className="flex flex-wrap gap-2">
              {marketData.trends.map((trend, i) => (
                <span key={i} className="text-sm text-foreground bg-secondary/50 px-3 py-1 rounded border border-border">
                  {trend}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Audit */}
        <div className="px-8 py-6 border-b border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-4">
            <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-foreground font-bold text-xs">2</span>
            Análise de Risco
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">Forças Identificadas</span>
              </div>
              <div className="space-y-3">
                {riskAssessment.strengths.map((strength, i) => (
                  <div key={i} className="p-3 border-l-2 border-primary bg-primary/5 rounded-r-lg">
                    <p className="font-medium text-foreground text-sm">{strength.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 italic">"{strength.evidence}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Risks */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="font-medium text-foreground">Riscos Detectados</span>
              </div>
              <div className="space-y-3">
                {riskAssessment.risks.map((risk, i) => {
                  const severity = getSeverityLabel(risk.severity);
                  return (
                    <div key={i} className="p-3 border-l-2 border-destructive bg-destructive/5 rounded-r-lg">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-foreground text-sm">{risk.title}</p>
                        <span className={cn("text-xs font-mono", severity.class)}>[{severity.label}]</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{risk.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Strategic Roadmap */}
        <div className="px-8 py-6 border-b border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-4">
            <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-foreground font-bold text-xs">3</span>
            Plano de Ação (90 Dias)
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((month) => {
              const monthActions = strategicAdvice.roadmap.filter(action => action.month === month);
              if (monthActions.length === 0) return null;
              
              return (
                <div key={month} className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-secondary/30 px-4 py-2 border-b border-border">
                    <span className="font-medium text-foreground">Mês {month}</span>
                  </div>
                  <div className="divide-y divide-border/50">
                    {monthActions.map((action, i) => {
                      const priority = getPriorityLabel(action.priority);
                      return (
                        <div key={i} className="px-4 py-3 flex items-start gap-4">
                          <span className={cn("text-xs min-w-[60px]", priority.class)}>
                            [{priority.label}]
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">{action.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Validations & Quick Wins */}
        <div className="px-8 py-6 border-b border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-4">
            <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-foreground font-bold text-xs">4</span>
            Recomendações
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <span className="text-sm font-medium text-foreground block mb-3">Validações Prioritárias</span>
              <ol className="space-y-2 list-decimal list-inside">
                {strategicAdvice.priorityValidations.map((validation, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    <span className="text-foreground">{validation}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <span className="text-sm font-medium text-foreground block mb-3">Quick Wins</span>
              <ul className="space-y-2">
                {strategicAdvice.quickWins.map((win, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{win}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Document Footer */}
        <div className="bg-secondary/20 px-8 py-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Documento gerado automaticamente pelo Daat AI Engine</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Ref: {reportId}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
