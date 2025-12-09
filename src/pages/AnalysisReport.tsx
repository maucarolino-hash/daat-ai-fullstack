import { useNavigate } from "react-router-dom";
import { useDaatEngine } from "@/lib/daat-engine/context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Download,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Users,
  Target,
  Calendar,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AnalysisReport() {
  const navigate = useNavigate();
  const { state } = useDaatEngine();
  const { result } = state;

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <BarChart3 className="w-16 h-16 text-muted-foreground" />
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

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Alta Viabilidade': return 'bg-primary/20 text-primary border-primary/30';
      case 'Viabilidade Moderada': return 'bg-accent/20 text-accent border-accent/30';
      case 'Baixa Viabilidade': return 'bg-neon-orange/20 text-neon-orange border-neon-orange/30';
      default: return 'bg-destructive/20 text-destructive border-destructive/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/20 text-destructive';
      case 'high': return 'bg-neon-orange/20 text-neon-orange';
      case 'medium': return 'bg-accent/20 text-accent';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-l-destructive';
      case 'high': return 'border-l-neon-orange';
      default: return 'border-l-accent';
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Relatório Daat AI</h1>
            <p className="text-muted-foreground">Análise: {result.segment}</p>
          </div>
        </div>
        <Button variant="neon" className="gap-2">
          <Download className="w-4 h-4" />
          Exportar PDF Oficial
        </Button>
      </div>

      {/* Score Header */}
      <Card className="glass-card p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className={cn(
                "w-32 h-32 rounded-full flex items-center justify-center border-4",
                scoreBreakdown.totalScore >= 70 ? "border-primary" : 
                scoreBreakdown.totalScore >= 50 ? "border-accent" : "border-destructive"
              )}>
                <div className="text-center">
                  <span className={cn("text-4xl font-bold", getScoreColor(scoreBreakdown.totalScore))}>
                    {scoreBreakdown.totalScore}
                  </span>
                  <span className="text-muted-foreground text-sm block">/100</span>
                </div>
              </div>
            </div>
            <div>
              <Badge className={cn("mb-2", getClassificationColor(scoreBreakdown.classification))}>
                {scoreBreakdown.classification}
              </Badge>
              <h2 className="text-xl font-semibold text-foreground mb-1">Pontuação Final</h2>
              <p className="text-muted-foreground text-sm">
                Gerado em {result.createdAt.toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="p-3 rounded-lg bg-secondary/50">
              <span className="text-xs text-muted-foreground">Oportunidade de Mercado</span>
              <div className="flex items-center gap-2">
                <Progress value={(scoreBreakdown.marketOpportunity / 30) * 100} className="h-2 flex-1" />
                <span className="text-sm font-medium text-foreground">{scoreBreakdown.marketOpportunity}/30</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <span className="text-xs text-muted-foreground">Posição Competitiva</span>
              <div className="flex items-center gap-2">
                <Progress value={(scoreBreakdown.competitivePosition / 30) * 100} className="h-2 flex-1" />
                <span className="text-sm font-medium text-foreground">{scoreBreakdown.competitivePosition}/30</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <span className="text-xs text-muted-foreground">Viabilidade de Execução</span>
              <div className="flex items-center gap-2">
                <Progress value={(scoreBreakdown.executionViability / 25) * 100} className="h-2 flex-1" />
                <span className="text-sm font-medium text-foreground">{scoreBreakdown.executionViability}/25</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-destructive/10">
              <span className="text-xs text-muted-foreground">Ajuste de Risco</span>
              <div className="flex items-center gap-2">
                <Progress value={Math.abs(scoreBreakdown.riskAdjustment / 15) * 100} className="h-2 flex-1" />
                <span className="text-sm font-medium text-destructive">{scoreBreakdown.riskAdjustment}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Section 1: Market Data */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-accent" />
          Dados de Mercado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card p-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">TAM (Mercado Total)</span>
            <div className="text-3xl font-bold neon-text-purple mt-1">{marketData.tam}</div>
          </Card>
          <Card className="glass-card p-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Crescimento Anual</span>
            <div className="text-3xl font-bold neon-text-green mt-1 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              {marketData.growthRate}%
            </div>
          </Card>
          <Card className="glass-card p-4">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Concorrentes Identificados</span>
            <div className="text-3xl font-bold text-foreground mt-1 flex items-center gap-2">
              <Users className="w-6 h-6 text-neon-blue" />
              {competitors.length}
            </div>
          </Card>
        </div>

        {/* Competitors Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {competitors.map((comp) => (
            <Card key={comp.id} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">{comp.name}</span>
                <Badge variant="outline" className={comp.growth >= 0 ? "text-primary" : "text-destructive"}>
                  {comp.growth >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {comp.growth}%
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Receita: {comp.revenue}</span>
                <span className="text-muted-foreground">Share: {comp.marketShare}%</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Trends */}
        <Card className="glass-card p-4 mt-4">
          <span className="text-sm font-medium text-foreground mb-3 block">Tendências de Mercado</span>
          <div className="flex flex-wrap gap-2">
            {marketData.trends.map((trend, i) => (
              <Badge key={i} variant="secondary" className="bg-secondary/50">
                {trend}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Section 2: Audit (Strengths vs Risks) */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" />
          Auditoria: Forças vs Riscos
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Strengths */}
          <Card className="glass-card p-4 border-l-4 border-l-primary">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Forças Identificadas
            </h4>
            <div className="space-y-3">
              {riskAssessment.strengths.map((strength, i) => (
                <div key={i} className="p-3 rounded-lg bg-primary/5">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">{strength.title}</span>
                      <p className="text-sm text-muted-foreground mt-1">{strength.evidence}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Risks */}
          <Card className="glass-card p-4 border-l-4 border-l-destructive">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Riscos Detectados
            </h4>
            <div className="space-y-3">
              {riskAssessment.risks.map((risk, i) => (
                <div key={i} className="p-3 rounded-lg bg-destructive/5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">{risk.title}</span>
                        <Badge className={cn("text-xs", getSeverityColor(risk.severity))}>
                          {risk.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{risk.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Section 3: Strategic Roadmap */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent" />
          Roadmap Estratégico (90 Dias)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((month) => (
            <Card key={month} className="glass-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent font-bold">{month}</span>
                </div>
                <span className="font-semibold text-foreground">Mês {month}</span>
              </div>
              <div className="space-y-3">
                {strategicAdvice.roadmap
                  .filter(action => action.month === month)
                  .map((action, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "p-3 rounded-lg bg-secondary/30 border-l-4",
                        getPriorityColor(action.priority)
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-accent" />
                        <span className="font-medium text-foreground text-sm">{action.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Priority Validations & Quick Wins */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass-card p-4">
          <h4 className="font-semibold text-foreground mb-4">Validações Prioritárias</h4>
          <div className="space-y-2">
            {strategicAdvice.priorityValidations.map((validation, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded bg-secondary/30">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-accent font-bold">{i + 1}</span>
                </div>
                <span className="text-sm text-foreground">{validation}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass-card p-4">
          <h4 className="font-semibold text-foreground mb-4">Quick Wins</h4>
          <div className="space-y-2">
            {strategicAdvice.quickWins.map((win, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded bg-primary/10">
                <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{win}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
