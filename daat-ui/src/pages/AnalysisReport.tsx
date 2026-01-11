import { useNavigate, useSearchParams } from "react-router-dom";
import { useDaatEngine } from "@/lib/daat-engine/context";
import { createMockAnalysisResult } from "@/lib/daat-engine/mock-data";
import { useEffect, useState } from "react";
import api from "@/services/api";
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
  Loader2,
  DollarSign,
  Rocket,
  Milestone,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { FeedbackModal } from "@/components/analysis/FeedbackModal";
import { ImprovedDeckModal } from "@/components/vc/ImprovedDeckModal";
import { InvestmentMemoModal } from "@/components/analysis/InvestmentMemoModal";
import { MonitorPlay, FileText as FileTextIcon } from "lucide-react";

export default function AnalysisReport() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reportIdParam = searchParams.get("id");
  const { state, setResult } = useDaatEngine(); // Updated to use setResult
  const { result } = state;
  const [isLoading, setIsLoading] = useState(false);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [showMemoModal, setShowMemoModal] = useState(false);

  // Fetch report if ID is present and result is empty or different
  useEffect(() => {
    const fetchReport = async () => {
      if (!reportIdParam) return;

      try {
        setIsLoading(true);
        // Call check_status endpoint which handles db_task_ format
        const response = await api.get(`/api/status/${reportIdParam}/`);


        // ... imports

        // inside fetchReport
        if (response.data.status === "completed" && response.data.data) {
          const backendData = response.data.data;
          const segment = backendData.customer_segment || "Análise";

          // 1. Start with Base Structure (Mock)
          const baseResult = createMockAnalysisResult(segment);

          // 2. Parse Backend Result (Real Data)
          let realData: any = {};
          if (backendData.result) {
            realData = backendData.result;
          } else {
            try {
              realData = typeof backendData.feedback === 'string'
                ? JSON.parse(backendData.feedback)
                : backendData.feedback;
            } catch (e) { console.log("JSON Parse Error", e); }
          }

          // 3. Merge Real Data into Base
          // Extract text sections if available
          const sections = realData.sections || {};
          const metrics = realData.metrics || {};

          // Override ID and Date
          baseResult.id = backendData.id.toString();
          baseResult.createdAt = new Date(backendData.created_at);

          // Phase 0: Deck Structure
          if (backendData.deck_analysis && backendData.deck_analysis.slides) {
            baseResult.deckAnalysis = backendData.deck_analysis;
          }

          // Phase 0.5: Financial Analysis
          if (backendData.financial_analysis) {
            baseResult.financialAnalysis = backendData.financial_analysis;
          }

          // Phase 0.9.5: Growth Analysis
          if (backendData.growth_analysis) {
            baseResult.growthAnalysis = backendData.growth_analysis;
          }

          // Phase 0.9.6: Team Analysis
          if (backendData.team_analysis) {
            baseResult.teamAnalysis = backendData.team_analysis;
          }

          // Override Score
          // Override Score
          if (backendData.score) {
            baseResult.scoreBreakdown.totalScore = backendData.score;
            // Adjust classification based on score - Updated to new rules
            // Adjust classification based on score - Updated to new rules (Prompt 6.1)
            if (backendData.score >= 95) baseResult.scoreBreakdown.classification = "YC-ready";
            else if (backendData.score >= 80) baseResult.scoreBreakdown.classification = "Strong";
            else if (backendData.score >= 65) baseResult.scoreBreakdown.classification = "Promising";
            else if (backendData.score >= 50) baseResult.scoreBreakdown.classification = "Potential";
            else baseResult.scoreBreakdown.classification = "Pass";
          }


          // Phase 0.9.7: Sector Adjustment
          if (backendData.sector_adjustment) {
            baseResult.sectorAdjustment = backendData.sector_adjustment;
          }

          if (backendData.strengths_synthesis) {
            baseResult.strengthsSynthesis = backendData.strengths_synthesis;
          }

          if (backendData.weaknesses_synthesis) {
            baseResult.weaknessesSynthesis = backendData.weaknesses_synthesis;
          }

          if (backendData.benchmarking_analysis) {
            baseResult.benchmarkingAnalysis = backendData.benchmarking_analysis;
          }

          // Map new score breakdown if available
          if (realData.score_breakdown) {
            const sb = realData.score_breakdown;
            baseResult.scoreBreakdown.marketOpportunity = sb.market_opportunity?.score || 0;
            baseResult.scoreBreakdown.traction = sb.traction?.score || 0;
            baseResult.scoreBreakdown.businessModel = sb.business_model?.score || 0;
            baseResult.scoreBreakdown.team = sb.team?.score || 0;
            baseResult.scoreBreakdown.competitivePosition = sb.competitive_position?.score || 0;
            baseResult.scoreBreakdown.financials = sb.financials?.score || 0;
            baseResult.scoreBreakdown.presentation = sb.presentation?.score || 0;
          }

          // Override Market Data if present (Metrics)
          if (metrics.marketSize) baseResult.marketData.tam = metrics.marketSize;
          if (metrics.growthRate) baseResult.marketData.growthRate = metrics.growthRate;

          // CRITICAL: Override Competitors to remove Mocks (Acme, Globex)
          // Use real competitors if available (New Structure: inside metrics), otherwise empty.
          const realCompetitors = realData.competitors || metrics.competitors;

          if (realCompetitors && Array.isArray(realCompetitors)) {
            // Map backend format to UI format if needed
            baseResult.competitors = realCompetitors.map((c: any) => ({
              id: c.name,
              name: c.name,
              revenue: c.revenue || c.funding || "N/A",
              marketShare: c.market_share || "N/A",
              growth: 0, // Mantendo 0 pois ainda não temos fonte fiável para crescimento individual
              description: c.differentiation || "",
              stats: { pricing: 50, ux: 50, features: 50, support: 50, innovation: 50 },
              strengths: [c.differentiation || "Forte presença"],
              weaknesses: c.weaknesses || ["Não analisado"]
            }));
          } else {
            // Clear mocks so we don't show fake data
            baseResult.competitors = [];
          }

          // Override Risks if available
          if (realData.riskAssessment && Array.isArray(realData.riskAssessment.risks)) {
            baseResult.riskAssessment.risks = realData.riskAssessment.risks;
          }

          // Update Context
          setResult(baseResult);
        }
      } catch (error) {
        console.error("Failed to load report", error);
        toast.error("Erro ao carregar relatório.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [reportIdParam, setResult]);

  const handleExportPdf = () => {
    if (!result) return;

    // Server-side PDF Generation
    // We assume the ID is consistent (e.g. db_task_123 or just 123)
    // The backend strips 'db_task_' if present.
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const pdfUrl = `${apiUrl}/api/status/${result.id}/pdf/`;

    window.open(pdfUrl, '_blank');
    toast.success("Download iniciado!");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-16 h-16 animate-spin text-primary" />
        <p className="text-muted-foreground">Carregando análise...</p>
      </div>
    );
  }

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

  const { marketData, competitors, riskAssessment, scoreBreakdown, strategicAdvice, deckAnalysis, financialAnalysis, tractionAnalysis, marketSizingAnalysis, problemAnalysis, businessModelAnalysis, financialProjectionsAnalysis, tractionCritique, growthAnalysis, teamAnalysis, sectorAdjustment, strengthsSynthesis, weaknessesSynthesis, benchmarkingAnalysis, executiveSummary, structuredReport } = result;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-accent';
    if (score >= 40) return 'text-neon-orange';
    return 'text-destructive';
  };

  const getClassificationBadge = (classification: string) => {
    switch (classification) {
      case 'YC-ready': return 'bg-primary/15 text-primary border border-primary/30';
      case 'Strong': return 'bg-accent/15 text-accent border border-accent/30';
      case 'Promising': return 'bg-neon-blue/15 text-neon-blue border border-neon-blue/30';
      case 'Potential': return 'bg-neon-orange/15 text-neon-orange border border-neon-orange/30';
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
        <div className="flex items-center gap-2">
          {reportIdParam && <FeedbackModal diagnosticId={reportIdParam} />}

          <Button
            variant="outline"
            className="gap-2 border-primary/30 hover:bg-primary/10 hover:text-primary"
            onClick={() => {
              if (!result) return;
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
              const downloadAnchorNode = document.createElement('a');
              downloadAnchorNode.setAttribute("href", dataStr);
              downloadAnchorNode.setAttribute("download", `daat_analysis_${result.id}.json`);
              document.body.appendChild(downloadAnchorNode);
              downloadAnchorNode.click();
              downloadAnchorNode.remove();
              toast.success("JSON para integração baixado!");
            }}
          >
            <Hash className="w-4 h-4" />
            JSON
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-primary/30 hover:bg-primary/10 hover:text-primary"
            onClick={() => setShowMemoModal(true)}
          >
            <FileTextIcon className="w-4 h-4" />
            Investment Memo
          </Button>

          <Button
            variant="neon"
            className="gap-2"
            onClick={() => setShowDeckModal(true)}
          >
            <MonitorPlay className="w-4 h-4" />
            Gerar Deck Otimizado
          </Button>

          <Button
            variant="ghost"
            className="gap-2"
            onClick={handleExportPdf}
          >
            <Download className="w-4 h-4" />
            PDF
          </Button>
          <Button variant="ghost" onClick={() => navigate('/')}>Nova Análise</Button>

          {/* Modals */}
          <ImprovedDeckModal
            isOpen={showDeckModal}
            onClose={() => setShowDeckModal(false)}
            diagnosticId={result ? parseInt(result.id) : 0}
          />
          <InvestmentMemoModal
            isOpen={showMemoModal}
            onClose={() => setShowMemoModal(false)}
            diagnosticId={result?.id || ""}
          />
        </div>
      </div>

      {/* Document Container */}
      <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden relative">

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="text-[120px] font-bold text-foreground/[0.02] rotate-[-30deg] select-none whitespace-nowrap tracking-widest">
            CONFIDENCIAL
          </div>
        </div>

        {/* Document Header - Institutional */}
        <div className="bg-secondary/30 border-b border-border px-8 py-6 relative z-10">
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
        </div >

        {/* Executive Summary */}
        <div className="px-8 py-6 border-b border-border bg-primary/5 relative z-10" >
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-3">
            <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">★</span>
            Sumário Executivo
          </div>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">
                Score de viabilidade: <strong className={getScoreColor(scoreBreakdown.totalScore)}>{scoreBreakdown.totalScore}/100</strong> — {scoreBreakdown.classification}
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-foreground">
                Mercado total de <strong>{marketData.tam}</strong> com crescimento anual de <strong>{marketData.growthRate}%</strong>
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <AlertTriangle className="w-4 h-4 text-neon-orange flex-shrink-0 mt-0.5" />
              <span className="text-foreground">
                {riskAssessment.risks.length} riscos identificados, sendo {riskAssessment.risks.filter(r => r.severity === 'critical' || r.severity === 'high').length} de alta prioridade
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <FileText className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <span className="text-foreground">
                Plano de ação: {strategicAdvice.roadmap.length} ações distribuídas em 90 dias
              </span>
            </li>
          </ul>
        </div >

        {/* Score Verdict Section */}
        <div className="px-8 py-6 border-b border-border relative z-10" >
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-4">
            <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-foreground font-bold text-xs">§</span>
            Parecer Final {sectorAdjustment && <span className="ml-2 text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30 tracking-normal capitalize">Setor: {sectorAdjustment.sector_detected}</span>}
          </div>

          {
            sectorAdjustment && (
              <div className="mb-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-accent">Ajuste Setorial</h4>
                  <div className="text-xs font-mono text-muted-foreground">Original: {sectorAdjustment.original_score} ➔ Ajustado: {sectorAdjustment.adjusted_score}</div>
                </div>
                <div className="space-y-2">
                  {sectorAdjustment.adjustments.map((adj, i) => (
                    <div key={i} className="flex gap-2 text-xs">
                      <span className={cn("font-bold px-1.5 py-0.5 rounded h-fit", adj.impact >= 0 ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500")}>
                        {adj.impact > 0 ? '+' : ''}{adj.impact}
                      </span>
                      <div>
                        <span className="font-semibold text-foreground">{adj.criteria}:</span> <span className="text-muted-foreground">{adj.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {sectorAdjustment.key_considerations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-accent/10">
                    <span className="text-[10px] uppercase tracking-wider text-accent/70 block mb-1">Considerações Chave</span>
                    <ul className="list-disc list-inside text-xs text-muted-foreground">
                      {sectorAdjustment.key_considerations.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )
          }

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
                    <td className="py-2 text-muted-foreground">Oportunidade (20)</td>
                    <td className="py-2 text-right font-mono font-medium text-foreground">{scoreBreakdown.marketOpportunity || 0}/20</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">Tração (25)</td>
                    <td className="py-2 text-right font-mono font-medium text-foreground">{scoreBreakdown.traction || 0}/25</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">Modelo de Negócio (20)</td>
                    <td className="py-2 text-right font-mono font-medium text-foreground">{scoreBreakdown.businessModel || 0}/20</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">Equipe (15)</td>
                    <td className="py-2 text-right font-mono font-medium text-foreground">{scoreBreakdown.team || 0}/15</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">Competitividade (10)</td>
                    <td className="py-2 text-right font-mono font-medium text-foreground">{scoreBreakdown.competitivePosition || 0}/10</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2 text-muted-foreground">Financeiro (10)</td>
                    <td className="py-2 text-right font-mono font-medium text-foreground">{scoreBreakdown.financials || 0}/10</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">Apresentação (5)</td>
                    <td className="py-2 text-right font-mono font-medium text-accent">+{scoreBreakdown.presentation || 0}/5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div >

        {/* Section 0.9.8: Key Strengths (New) */}
        {
          strengthsSynthesis && (
            <div className="mb-6">
              <h4 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                <span className="w-1 h-4 bg-green-500 rounded-full"></span>
                Key Strengths
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {strengthsSynthesis.strengths.map((s, i) => (
                  <Card key={i} className="bg-background/50 border-border hover:border-green-500/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold text-sm text-foreground line-clamp-1" title={s.strength}>{s.strength}</h5>
                        <span className="text-[10px] bg-green-500/10 text-green-500 font-mono px-1.5 rounded">{s.score_contribution}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2" title={s.description}>{s.description}</p>
                      <div className="text-[10px] text-green-600/80 font-medium flex items-center gap-1">
                        <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                        {s.impact}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 text-xs text-muted-foreground italic">
                <span className="font-bold text-primary not-italic mr-1">Síntese:</span>
                {strengthsSynthesis.synthesis_summary}
              </div>
            </div>
          )
        }

        {/* Section 0.9.9: Key Weaknesses (New) */}
        {
          weaknessesSynthesis && (
            <div className="mb-6">
              <h4 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                <span className="w-1 h-4 bg-red-500 rounded-full"></span>
                Key Risks & Weaknesses
              </h4>
              <div className="space-y-3 mb-4">
                {weaknessesSynthesis.weaknesses.map((w, i) => (
                  <div key={i} className="bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        {w.severity === 'critical' && <span className="text-red-500 text-lg" title="Critical">🚨</span>}
                        {w.severity === 'serious' && <span className="text-orange-500 text-lg" title="Serious">⚠️</span>}
                        {w.severity === 'attention' && <span className="text-yellow-500 text-lg" title="Attention">📌</span>}
                        <h5 className="font-bold text-sm text-foreground">{w.weakness}</h5>
                      </div>
                      <span className="text-[10px] bg-red-500/10 text-red-500 font-mono px-1.5 rounded">{w.score_impact}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 ml-7">{w.risk_description}</p>
                    <div className="flex items-center gap-2 ml-7">
                      <span className="text-[10px] font-bold text-red-600/70 border border-red-200/20 px-1 rounded uppercase">Action</span>
                      <span className="text-xs text-foreground/80">{w.recommendation}</span>
                    </div>
                  </div>
                ))}
              </div>
              {weaknessesSynthesis.next_steps.length > 0 && (
                <div className="bg-background/50 border border-border rounded-lg p-3">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-2">Recommended Next Steps</span>
                  <ul className="list-decimal list-inside text-xs text-muted-foreground space-y-1">
                    {weaknessesSynthesis.next_steps.map((step, i) => <li key={i}>{step}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )
        }

        {/* Section 0.9.10: Benchmarking (New) */}
        {
          benchmarkingAnalysis && (
            <div className="mb-6 glass-card p-6">
              <h4 className="flex items-center gap-2 text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
                <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                Comparative Benchmarking
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-secondary/30">
                    <tr>
                      <th className="px-4 py-2 rounded-l-lg">Metric</th>
                      <th className="px-4 py-2">Your Pitch</th>
                      <th className="px-4 py-2">Industry Benchmark</th>
                      <th className="px-4 py-2 rounded-r-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {benchmarkingAnalysis.benchmarks.map((b, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{b.metric}</td>
                        <td className="px-4 py-3 font-mono text-foreground/80">{b.pitch_value}</td>
                        <td className="px-4 py-3 font-mono text-muted-foreground">{b.benchmark_value}</td>
                        <td className="px-4 py-3">
                          {b.status === 'Above Benchmark' && <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-bold">ABOVE</span>}
                          {b.status === 'Meets Benchmark' && <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-bold">MEETS</span>}
                          {b.status === 'Below Benchmark' && <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-bold">BELOW</span>}
                          {b.status === 'Unknown' && <span className="text-[10px] bg-gray-500/10 text-gray-500 px-2 py-0.5 rounded-full font-bold">UNKNOWN</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {benchmarkingAnalysis.interpretation.strengths.length > 0 && (
                  <div className="bg-green-500/5 p-3 rounded-lg border border-green-500/10">
                    <span className="text-[10px] uppercase font-bold text-green-600 mb-1 block">Competitive Advantages</span>
                    <ul className="list-disc list-inside text-xs text-muted-foreground">
                      {benchmarkingAnalysis.interpretation.strengths.map((str, k) => <li key={k}>{str}</li>)}
                    </ul>
                  </div>
                )}
                {benchmarkingAnalysis.interpretation.areas_for_improvement.length > 0 && (
                  <div className="bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">
                    <span className="text-[10px] uppercase font-bold text-amber-600 mb-1 block">Areas for Improvement</span>
                    <ul className="list-disc list-inside text-xs text-muted-foreground">
                      {benchmarkingAnalysis.interpretation.areas_for_improvement.map((str, k) => <li key={k}>{str}</li>)}
                    </ul>
                  </div>
                )}
              </div>
              <div className="mt-3 text-center">
                <span className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                  Positioning: <strong className="text-foreground">{benchmarkingAnalysis.positioning_statement}</strong>
                </span>
              </div>
            </div>
          )
        }

        {/* Section 0: Pitch Deck Structure (New) */}
        {
          deckAnalysis && deckAnalysis.slides && deckAnalysis.slides.length > 0 && (
            <div className="px-8 py-6 border-b border-border relative z-10">
              <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-4">
                <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-foreground font-bold text-xs">0</span>
                Análise Estrutural do Pitch Deck
              </div>

              <div className="mb-4 p-4 bg-secondary/30 rounded-lg border border-border">
                <span className="text-sm font-medium text-foreground block mb-2">Feedback Estrutural</span>
                <p className="text-sm text-muted-foreground">{deckAnalysis.structural_feedback}</p>
              </div>

              <div className="space-y-4">
                {deckAnalysis.slides.map((slide) => (
                  <div key={slide.slide_number} className="border border-border rounded-lg overflow-hidden bg-card/50">
                    <div className="px-4 py-2 bg-secondary/20 border-b border-border flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-muted-foreground">SLIDE {slide.slide_number}</span>
                        <Badge variant="outline" className="text-xs py-0 h-5 bg-background">{slide.type}</Badge>
                      </div>
                      {slide.cta && <span className="text-xs text-primary font-medium">CTA: {slide.cta}</span>}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-foreground mb-2">{slide.title}</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Pontos-Chave</span>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            {slide.key_points.map((p, i) => <li key={i}>{p}</li>)}
                          </ul>
                        </div>
                        <div className="space-y-2">
                          {slide.data_mentioned && slide.data_mentioned.length > 0 && (
                            <div>
                              <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Dados Mencionados</span>
                              <div className="flex flex-wrap gap-1">
                                {slide.data_mentioned.map((d, i) => (
                                  <span key={i} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/20">{d}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          {slide.metrics_visible && slide.metrics_visible.length > 0 && (
                            <div>
                              <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Métricas Visuais</span>
                              <div className="flex flex-wrap gap-1">
                                {slide.metrics_visible.map((m, i) => (
                                  <span key={i} className="text-xs bg-neon-blue/10 text-neon-blue px-2 py-0.5 rounded border border-neon-blue/20">{m}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        }

        {/* Section 0.2: Problem Analysis (New) */}
        {
          problemAnalysis && (
            <div className="px-8 py-6 border-b border-border relative z-10">
              <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-4">
                <span className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold text-xs">!</span>
                Análise do Problema
              </div>

              <div className="flex flex-col md:flex-row gap-6 mb-4">
                {/* Score Card */}
                <div className="w-full md:w-1/3 p-4 bg-secondary/30 rounded-lg border border-border flex flex-col items-center justify-center text-center">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Problem-Solution Fit</span>
                  <div className={cn("text-4xl font-bold mb-1",
                    problemAnalysis.problem_solution_fit_score >= 8 ? "text-primary" :
                      problemAnalysis.problem_solution_fit_score >= 5 ? "text-accent" : "text-destructive"
                  )}>
                    {problemAnalysis.problem_solution_fit_score}/10
                  </div>
                  <div className="text-xs text-muted-foreground">Score de Clareza e Validação</div>
                </div>

                {/* Feedback */}
                <div className="w-full md:w-2/3 space-y-3">
                  <div className="p-3 bg-secondary/10 rounded border border-border">
                    <span className="text-xs text-muted-foreground block mb-1">Resumo do Problema</span>
                    <p className="text-sm font-medium text-foreground">{problemAnalysis.problem_summary}</p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded border border-border">
                    <span className="text-xs text-muted-foreground block mb-1">Feedback do Analista</span>
                    <p className="text-sm text-muted-foreground italic">"{problemAnalysis.feedback_text}"</p>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-secondary/20 rounded">
                  <span className="block text-[10px] text-muted-foreground uppercase">Clareza</span>
                  <span className="font-mono font-bold text-foreground">{problemAnalysis.clarity_score}/10</span>
                </div>
                <div className="text-center p-2 bg-secondary/20 rounded">
                  <span className="block text-[10px] text-muted-foreground uppercase">Validação</span>
                  <span className="font-mono font-bold text-foreground">{problemAnalysis.validation_score}/10</span>
                </div>
                <div className="text-center p-2 bg-secondary/20 rounded">
                  <span className="block text-[10px] text-muted-foreground uppercase">Conexão</span>
                  <span className="font-mono font-bold text-foreground">{problemAnalysis.connection_score}/10</span>
                </div>
              </div>

              {/* Missing Elements */}
              {problemAnalysis.missing_elements && problemAnalysis.missing_elements.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-destructive font-bold uppercase tracking-wider block mb-2">Pontos de Atenção</span>
                  <ul className="space-y-1">
                    {problemAnalysis.missing_elements.map((el, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                        <AlertTriangle className="w-3 h-3 text-destructive" />
                        {el}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        }

        {/* Section 0.5: Financial Metrics (New) */}
        {
          financialAnalysis && financialAnalysis.metrics && financialAnalysis.metrics.length > 0 && (
            <div className="px-8 py-6 border-b border-border relative z-10">
              <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-4">
                <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">$</span>
                Deep Dive Financeiro (Extraído do Deck)
              </div>

              <div className="mb-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
                <span className="text-sm font-medium text-foreground block mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-accent" />
                  Resumo Financeiro
                </span>
                <p className="text-sm text-foreground/80">{financialAnalysis.financial_summary}</p>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground w-1/4">Métrica</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground w-1/4">Valor</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground flex-1">Contexto</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground w-[100px]">Slide</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {financialAnalysis.metrics.map((m, i) => (
                      <tr key={i} className="group hover:bg-secondary/20 transition-colors">
                        <td className="py-3 px-4 font-medium text-foreground">{m.name}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-accent">{m.value}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{m.context}</td>
                        <td className="py-3 px-4 text-center text-muted-foreground font-mono text-xs">
                          {m.source_slide ? `#${m.source_slide}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )
        }

        {/* Section 0.7: Traction Analysis (New) */}
        {
          tractionAnalysis && (tractionAnalysis.quantitative_traction.length > 0 || tractionAnalysis.qualitative_traction.length > 0) && (
            <div className="px-8 py-6 border-b border-border relative z-10">
              <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-4">
                <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">🚀</span>
                Tração e Validação (Evidências)
              </div>

              <div className="mb-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <span className="text-sm font-medium text-foreground block mb-2 flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-primary" />
                  Status de Validação
                </span>
                <p className="text-sm text-foreground/80">{tractionAnalysis.traction_summary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quantitative */}
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-3">Métricas de Crescimento</span>
                  {tractionAnalysis.quantitative_traction.length > 0 ? (
                    <div className="space-y-3">
                      {tractionAnalysis.quantitative_traction.map((m, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-secondary/30 rounded border border-border">
                          <div>
                            <span className="block text-sm font-medium text-foreground">{m.metric}</span>
                            <span className="text-xs text-muted-foreground">{m.timeline}</span>
                          </div>
                          <span className="text-lg font-bold text-primary">{m.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-sm text-muted-foreground italic">Nenhuma métrica quantitativa encontrada.</p>}
                </div>

                {/* Qualitative */}
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-3">Conquistas e Marcos</span>
                  {tractionAnalysis.qualitative_traction.length > 0 ? (
                    <ul className="space-y-2">
                      {tractionAnalysis.qualitative_traction.map((q, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-medium text-foreground mr-1">{q.type}:</span>
                            <span className="text-muted-foreground">{q.description}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-sm text-muted-foreground italic">Nenhuma validação qualitativa encontrada.</p>}
                </div>
              </div>

              {/* Timeline */}
              {tractionAnalysis.timeline_events.length > 0 && (
                <div className="mt-6">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-3">Timeline Identificada</span>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {tractionAnalysis.timeline_events.map((e, i) => (
                      <div key={i} className="flex-shrink-0 w-[200px] p-3 bg-secondary/20 rounded border border-border relative">
                        <Milestone className="w-4 h-4 text-muted-foreground mb-2" />
                        <span className="block text-xs font-bold text-primary mb-1">{e.date}</span>
                        <p className="text-xs text-foreground">{e.event}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        }

        {/* Section 1: Market Data */}
        <div className="px-8 py-6 border-b border-border relative z-10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-4">
            <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center text-foreground font-bold text-xs">1</span>
            Dados de Mercado
          </div>

          {/* New: Market Sizing Critique */}
          {result.marketSizingAnalysis && (
            <div className="mb-6 p-4 bg-background/50 rounded-lg border border-border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm font-medium text-foreground block">Validacão do Tamanho de Mercado (TAM/SAM/SOM)</span>
                  <span className="text-xs text-muted-foreground">Análise crítica das estimativas do fundador</span>
                </div>
                <Badge variant={
                  result.marketSizingAnalysis.recommendation === 'Aceito' ? 'outline' :
                    result.marketSizingAnalysis.recommendation === 'Rejeitado' ? 'destructive' : 'outline'
                } className={cn("uppercase",
                  result.marketSizingAnalysis.recommendation === 'Aceito' ? 'text-primary border-primary/30' :
                    result.marketSizingAnalysis.recommendation === 'Rejeitado' ? 'bg-destructive/10' : 'text-neon-orange border-neon-orange/30'
                )}>
                  {result.marketSizingAnalysis.recommendation}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-secondary/20 rounded border border-border">
                  <span className="text-xs text-muted-foreground block mb-1">TAM (Total)</span>
                  <div className="font-mono text-sm font-medium text-foreground">{result.marketSizingAnalysis.tam_analysis.value}</div>
                  <div className="text-[10px] text-muted-foreground mt-1 truncate" title={result.marketSizingAnalysis.tam_analysis.method}>{result.marketSizingAnalysis.tam_analysis.method}</div>
                </div>
                <div className="p-3 bg-secondary/20 rounded border border-border">
                  <span className="text-xs text-muted-foreground block mb-1">SAM (Segmento)</span>
                  <div className="text-xs text-foreground line-clamp-2" title={result.marketSizingAnalysis.sam_analysis.segmentation}>{result.marketSizingAnalysis.sam_analysis.segmentation}</div>
                </div>
                <div className="p-3 bg-secondary/20 rounded border border-border">
                  <span className="text-xs text-muted-foreground block mb-1">SOM (Meta)</span>
                  <div className="font-mono text-sm font-medium text-accent">{result.marketSizingAnalysis.som_analysis.target_share}</div>
                  <div className="text-[10px] text-muted-foreground mt-1">{result.marketSizingAnalysis.som_analysis.timeline}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs py-1 border-b border-border/50">
                  <span className="text-muted-foreground">TAM &gt; $100M?</span>
                  <span className={cn("font-medium", result.marketSizingAnalysis.critique.tam_over_100m ? "text-primary" : "text-destructive")}>
                    {result.marketSizingAnalysis.critique.tam_over_100m ? "Sim" : "Não/Incerto"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Método Credível?</span>
                  <span className={cn("font-medium", result.marketSizingAnalysis.critique.credible_method ? "text-primary" : "text-destructive")}>
                    {result.marketSizingAnalysis.critique.credible_method ? "Sim" : "Não"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Fonte Verificável?</span>
                  <span className={cn("font-medium", result.marketSizingAnalysis.critique.verifiable_source ? "text-primary" : "text-destructive")}>
                    {result.marketSizingAnalysis.critique.verifiable_source ? "Sim" : "Não"}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-destructive/5 border border-destructive/20 rounded text-xs text-muted-foreground italic">
                "{result.marketSizingAnalysis.justification}"
              </div>
            </div>
          )}

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

        {/* Section 1.5: Business Model & Unit Economics (New) */}
        {
          businessModelAnalysis && (
            <div className="px-8 py-6 border-b border-border relative z-10">
              <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-4">
                <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xs">$</span>
                Modelo de Negócio & Unit Economics
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Viability Summary */}
                <div className="p-4 bg-background/50 rounded-lg border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-foreground">Score de Viabilidade</span>
                    <Badge variant="outline" className={cn(
                      businessModelAnalysis.viability.recommendation === 'Viável' ? 'text-primary border-primary/30' :
                        businessModelAnalysis.viability.recommendation === 'Questionável' ? 'text-neon-orange border-neon-orange/30' : 'text-destructive border-destructive/30'
                    )}>
                      {businessModelAnalysis.viability.recommendation}
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={cn("text-3xl font-bold",
                      businessModelAnalysis.viability.score >= 7 ? "text-primary" :
                        businessModelAnalysis.viability.score >= 4 ? "text-accent" : "text-destructive"
                    )}>{businessModelAnalysis.viability.score}/10</span>
                    <span className="text-xs text-muted-foreground">índice de saúde do modelo</span>
                  </div>

                  {/* Red Flags */}
                  {businessModelAnalysis.viability.flags && businessModelAnalysis.viability.flags.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <span className="text-xs text-destructive font-bold uppercase tracking-wider block mb-1">Red Flags Detectadas</span>
                      <ul className="space-y-1">
                        {businessModelAnalysis.viability.flags.map((flag, i) => (
                          <li key={i} className="text-xs text-destructive flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Revenue Model */}
                <div className="space-y-3">
                  <div className="p-3 bg-secondary/10 rounded border border-border">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Revenue Model</span>
                    <div className="font-medium text-foreground">{businessModelAnalysis.revenue_model.type}</div>
                    <div className="text-xs text-muted-foreground">{businessModelAnalysis.revenue_model.details}</div>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded border border-border">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Análise Geral</span>
                    <p className="text-xs text-muted-foreground italic">"{businessModelAnalysis.analysis_text}"</p>
                  </div>
                </div>
              </div>

              {/* Unit Economics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Acquisition */}
                <div className="border border-border rounded-lg p-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block border-b border-border/50 pb-1">Aquisição (CAC)</span>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">CAC</span>
                      <span className="font-mono text-sm font-bold text-foreground">{businessModelAnalysis.acquisition.cac}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Payback</span>
                      <span className="font-mono text-xs text-foreground">{businessModelAnalysis.acquisition.payback}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Canais</span>
                      <span className="text-xs text-muted-foreground line-clamp-2" title={businessModelAnalysis.acquisition.channels}>{businessModelAnalysis.acquisition.channels}</span>
                    </div>
                  </div>
                </div>

                {/* Lifetime Value */}
                <div className="border border-border rounded-lg p-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block border-b border-border/50 pb-1">Retenção (LTV)</span>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">LTV</span>
                      <span className="font-mono text-sm font-bold text-primary">{businessModelAnalysis.ltv_analysis.ltv}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Churn</span>
                      <span className="font-mono text-xs text-destructive">{businessModelAnalysis.ltv_analysis.churn}</span>
                    </div>
                  </div>
                </div>

                {/* Efficiency */}
                <div className="border border-border rounded-lg p-3 bg-accent/5">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block border-b border-border/50 pb-1">Eficiência</span>

                  <div className="flex flex-col items-center justify-center h-20">
                    <span className="text-[10px] text-muted-foreground block mb-1">LTV:CAC Ratio</span>
                    <span className="text-2xl font-bold text-foreground">{businessModelAnalysis.ltv_analysis.ltv_cac_ratio}</span>
                    <span className="text-[10px] text-muted-foreground">(Ideal &gt; 3:1)</span>
                  </div>
                </div>
              </div>
            </div>
          )
        }


        {/* Section 1.7: Financial Projections (New) */}
        {
          financialProjectionsAnalysis && (
            <div className="px-8 py-6 border-b border-border relative z-10">
              <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-4">
                <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">📈</span>
                Análise de Projeções (3-5 Anos)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Realism Summary */}
                <div className="p-4 bg-background/50 rounded-lg border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-foreground">Score de Realismo</span>
                    <Badge variant="outline" className={cn(
                      financialProjectionsAnalysis.realism.recommendation === 'Crível' ? 'text-primary border-primary/30' :
                        financialProjectionsAnalysis.realism.recommendation === 'Questionável' ? 'text-neon-orange border-neon-orange/30' : 'text-destructive border-destructive/30'
                    )}>
                      {financialProjectionsAnalysis.realism.recommendation}
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className={cn("text-3xl font-bold",
                      financialProjectionsAnalysis.realism.score >= 7 ? "text-primary" :
                        financialProjectionsAnalysis.realism.score >= 5 ? "text-accent" : "text-destructive"
                    )}>{financialProjectionsAnalysis.realism.score}/10</span>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{financialProjectionsAnalysis.realism.label}</span>
                  </div>
                  <p className="text-sm text-foreground/80 italic mt-2">"{financialProjectionsAnalysis.realism.critique}"</p>
                </div>

                {/* Growth & Breakeven */}
                <div className="space-y-3">
                  <div className="p-3 bg-secondary/10 rounded border border-border">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Crescimento Projetado</span>
                    {financialProjectionsAnalysis.revenue_growth.length > 0 ? (
                      <ul className="space-y-1">
                        {financialProjectionsAnalysis.revenue_growth.map((g, i) => (
                          <li key={i} className="text-sm font-mono text-foreground">{g}</li>
                        ))}
                      </ul>
                    ) : <span className="text-sm text-muted-foreground">Não detalhado no deck.</span>}
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 p-3 bg-secondary/10 rounded border border-border">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Breakeven</span>
                      <span className="font-bold text-foreground">{financialProjectionsAnalysis.breakeven.projected_year}</span>
                      <p className="text-[10px] text-muted-foreground mt-1">{financialProjectionsAnalysis.breakeven.plausibility}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Burn & Runway */}
              <div className="p-4 bg-secondary/20 rounded border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-neon-orange animate-pulse"></span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Burn Rate & Runway</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground block">Burn Mensal</span>
                    <span className="font-mono text-lg text-foreground">{financialProjectionsAnalysis.burn_runway.burn_rate}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Runway Atual</span>
                    <span className="font-mono text-lg text-foreground">{financialProjectionsAnalysis.burn_runway.runway}</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground border-t border-border/50 pt-2">
                  {financialProjectionsAnalysis.burn_runway.analysis}
                </div>
              </div>
            </div>
          )
        }

        {/* Section 0.9.5: Growth Analysis (New) */}
        {
          growthAnalysis && (
            <div className="px-8 py-6 border-b border-border relative z-10">
              <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-4">
                <TrendingUp className="w-4 h-4 text-neon-blue" />
                Análise de Crescimento (MoM & Trends)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Growth Stats */}
                <div className="p-4 bg-secondary/10 rounded border border-border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs text-muted-foreground block uppercase tracking-wider">Crescimento (MoM)</span>
                      <span className="text-3xl font-bold font-mono text-foreground">{growthAnalysis.growth_rate}</span>
                      <span className="text-xs text-muted-foreground block mt-1">{growthAnalysis.period}</span>
                    </div>
                    <Badge variant="outline" className={cn(
                      growthAnalysis.benchmark_comparison.status === 'EXCEEDS' ? "bg-primary/20 text-primary border-primary/50" :
                        growthAnalysis.benchmark_comparison.status === 'MEETS' ? "bg-accent/20 text-accent border-accent/50" : "bg-destructive/10 text-destructive border-destructive/50"
                    )}>
                      {growthAnalysis.benchmark_comparison.status} expectations
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground border-t border-border/50 pt-2 italic">
                    "{growthAnalysis.benchmark_comparison.text}"
                  </div>
                </div>

                {/* Trend & Consistency */}
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 p-3 bg-secondary/10 rounded border border-border">
                      <span className="text-xs text-muted-foreground block uppercase tracking-wider mb-1">Tendência</span>
                      <span className={cn("font-bold",
                        growthAnalysis.trend === 'Acelerando' ? "text-primary" :
                          growthAnalysis.trend === 'Linear' ? "text-accent" : "text-destructive"
                      )}>{growthAnalysis.trend}</span>
                    </div>
                    <div className="flex-1 p-3 bg-secondary/10 rounded border border-border">
                      <span className="text-xs text-muted-foreground block uppercase tracking-wider mb-1">Consistência</span>
                      <span className="font-bold text-foreground">{growthAnalysis.consistency}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-background/50 rounded border border-border">
                    <span className="text-xs text-muted-foreground block uppercase tracking-wider mb-1">Avaliação Geral</span>
                    <p className="text-sm text-foreground/80 lowercasefirst">{growthAnalysis.assessment}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        }


        {/* Section 0.9.6: Team Analysis (New) */}
        {
          teamAnalysis && (
            <div className="px-8 py-6 border-b border-border relative z-10">
              <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-4">
                <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">👥</span>
                Análise de Equipe (Founders & Composition)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Score Card */}
                <div className="md:col-span-1 p-4 bg-background/50 rounded-lg border border-border flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-foreground">Team Score</span>
                  </div>
                  <div className={cn("text-4xl font-bold mb-1",
                    teamAnalysis.overall_score >= 8 ? "text-primary" :
                      teamAnalysis.overall_score >= 6 ? "text-accent" : "text-destructive"
                  )}>
                    {teamAnalysis.overall_score}/10
                  </div>
                  <p className="text-xs text-muted-foreground italic mt-2 px-2">"{teamAnalysis.summary_assessment}"</p>
                </div>

                {/* Composition Details */}
                <div className="md:col-span-2 space-y-3">
                  <div className="flex gap-4">
                    <div className="flex-1 p-3 bg-secondary/10 rounded border border-border">
                      <span className="text-xs text-muted-foreground block uppercase tracking-wider mb-1">Complementaridade</span>
                      <span className={cn("font-bold", teamAnalysis.composition.complementarity === 'Alta' ? 'text-primary' : 'text-foreground')}>{teamAnalysis.composition.complementarity}</span>
                    </div>
                    <div className="flex-1 p-3 bg-secondary/10 rounded border border-border">
                      <span className="text-xs text-muted-foreground block uppercase tracking-wider mb-1">Advisory Board</span>
                      <span className="font-bold text-foreground">{teamAnalysis.composition.advisory_board}</span>
                    </div>
                  </div>

                  {teamAnalysis.composition.identified_gaps.length > 0 && (
                    <div className="p-3 bg-destructive/10 rounded border border-destructive/20">
                      <span className="text-xs text-destructive font-bold uppercase tracking-wider mb-1 block">Gaps Identificados</span>
                      <ul className="list-disc list-inside">
                        {teamAnalysis.composition.identified_gaps.map((gap, i) => (
                          <li key={i} className="text-xs text-destructive">{gap}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Founders List */}
              <div className="space-y-3">
                <span className="text-xs text-muted-foreground uppercase tracking-wider block">Sócios Fundadores</span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamAnalysis.founders.map((founder, i) => (
                    <div key={i} className="p-4 bg-secondary/20 rounded border border-border relative overflow-hidden group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold text-lg text-foreground block">{founder.name}</span>
                          <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{founder.role}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground uppercase border border-border px-1 rounded">{founder.bias}</span>
                      </div>

                      <div className="space-y-2 mt-4">
                        <div>
                          <span className="text-[10px] text-muted-foreground block">Domain Expertise</span>
                          <span className={cn("text-xs font-medium", founder.experience.domain_expertise.includes('Sim') ? 'text-primary' : 'text-foreground')}>{founder.experience.domain_expertise}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-muted-foreground block">Startup History</span>
                          <span className="text-xs text-foreground">{founder.experience.startup_history}</span>
                        </div>
                        <div className="pt-2 border-t border-border/50">
                          <p className="text-xs italic text-muted-foreground">{founder.key_highlight}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        }

        {/* Section 2: Audit */}
        <div className="px-8 py-6 border-b border-border relative z-10">
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
        <div className="px-8 py-6 border-b border-border relative z-10">
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
        <div className="px-8 py-6 border-b border-border relative z-10">
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

        {/* Section 12: Structured Investment Memo (New) */}
        {
          structuredReport && (
            <div className="max-w-7xl mx-auto px-8 py-8 mb-12">
              <div className="border border-border rounded-xl bg-card overflow-hidden">
                <div className="bg-secondary/30 px-6 py-4 border-b border-border flex justify-between items-center">
                  <h2 className="text-xl font-bold text-foreground">Investment Memo</h2>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={() => navigator.clipboard.writeText(structuredReport.full_report_text)}>
                      <Copy className="w-3 h-3" />
                      Copy Markdown
                    </Button>
                  </div>
                </div>
                <div className="p-8 font-mono text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap bg-background">
                  {structuredReport.full_report_text}
                </div>
                <div className="bg-secondary/10 px-6 py-3 border-t border-border text-xs text-muted-foreground italic text-center">
                  {structuredReport.disclaimer}
                </div>
              </div>
            </div>
          )
        }

        {/* Document Footer */}
        <div className="bg-secondary/20 px-8 py-4 relative z-10">
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
