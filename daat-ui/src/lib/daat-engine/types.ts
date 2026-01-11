// Daat Engine Types - Deep Analysis Engine

export interface Competitor {
  id: string;
  name: string;
  revenue: string;
  marketShare: number;
  growth: number;
  strengths: string[];
  weaknesses: string[];
  stats: {
    pricing: number;
    ux: number;
    features: number;
    support: number;
    innovation: number;
  };
}

export interface Slide {
  slide_number: number;
  type: string;
  title: string;
  key_points: string[];
  data_mentioned: string[];
  metrics_visible: string[];
  cta: string;
}

export interface DeckAnalysis {
  slides: Slide[];
  structural_feedback: string;
}

export interface FinancialMetric {
  name: string;
  value: string;
  context: string;
  source_slide?: number;
}

export interface FinancialAnalysis {
  metrics: FinancialMetric[];
  financial_summary: string;
}

export interface TractionMetric {
  metric: string;
  value: string;
  timeline: string;
}

export interface QualitativeTraction {
  type: string;
  description: string;
}

export interface TimelineEvent {
  date: string;
  event: string;
}

export interface TractionAnalysis {
  quantitative_traction: TractionMetric[];
  qualitative_traction: QualitativeTraction[];
  timeline_events: TimelineEvent[];
  traction_summary: string;
}

export interface MarketSizingAnalysis {
  tam_analysis: { value: string; method: string; source: string };
  sam_analysis: { segmentation: string; geography: string };
  som_analysis: { target_share: string; timeline: string };
  critique: {
    tam_over_100m: boolean | null;
    credible_method: boolean;
    verifiable_source: boolean;
    realistic_comparison: boolean;
  };
  recommendation: string;
  justification: string;
}

export interface ProblemAnalysis {
  problem_summary: string;
  clarity_score: number;
  validation_score: number;
  connection_score: number;
  problem_solution_fit_score: number;
  feedback_text: string;
  missing_elements: string[];
}

export interface BusinessModelAnalysis {
  revenue_model: { type: string; details: string };
  acquisition: { cac: string; channels: string; payback: string };
  ltv_analysis: { ltv: string; churn: string; ltv_cac_ratio: string };
  viability: {
    score: number;
    recommendation: string;
    flags: string[];
  };
  analysis_text: string;
}

export interface FinancialProjectionsAnalysis {
  revenue_growth: string[];
  burn_runway: {
    burn_rate: string;
    runway: string;
    analysis: string;
  };
  breakeven: {
    projected_year: string;
    plausibility: string;
  };
  realism: {
    score: number;
    label: string;
    recommendation: string;
    critique: string;
  };
}

export interface TractionCritique {
  traction_score: number;
  stage_context: string;
  stage_rating: string;
  trajectory_analysis: string;
  quality_analysis: {
    has_vanity_metrics: boolean;
    critique: string;
  };
  benchmarking_text: string;
}

export interface GrowthAnalysis {
  growth_rate: string;
  period: string;
  trend: string;
  consistency: string;
  benchmark_comparison: {
    status: string;
    text: string;
  };
  assessment: string;
}

export interface TeamAnalysis {
  founders: {
    name: string;
    role: string;
    bias: string;
    experience: {
      domain_expertise: string;
      startup_history: string;
      relevance: string;
    };
    skin_in_the_game: string;
    key_highlight: string;
  }[];
  composition: {
    complementarity: string;
    identified_gaps: string[];
    advisory_board: string;
  };
  overall_score: number;
  summary_assessment: string;
}

export interface MarketData {
  tam: string; // Total Addressable Market
  sam: string; // Serviceable Addressable Market
  som: string; // Serviceable Obtainable Market
  growthRate: number;
  trends: string[];
}

export interface RiskAssessment {
  level: 'critical' | 'high' | 'medium' | 'low' | 'none';
  viabilityIndex: number;
  strengths: {
    title: string;
    evidence: string;
  }[];
  risks: {
    title: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    description: string;
  }[];
}

export interface ScoreBreakdown {
  marketOpportunity: number; // max 20
  traction: number; // max 25
  businessModel: number; // max 20
  team: number; // max 15
  competitivePosition: number; // max 10
  financials: number; // max 10
  presentation: number; // max 5
  totalScore: number;
  classification: ScoreClassification;
}

export interface Risk {
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
}

export type ScoreClassification =
  | "YC-ready"
  | "Strong"
  | "Promising"
  | "Potential"
  | "Pass"
  // Legacy support
  | "Alta Viabilidade (YC-ready)"
  | "Forte Interesse"
  | "Promissor"
  | "Potencial"
  | "Passe"
  | "Alta Viabilidade"
  | "Viabilidade Moderada"
  | "Baixa Viabilidade"
  | "Alto Risco";

export interface SectorAdjustment {
  original_score: number;
  adjusted_score: number;
  sector_detected: string;
  adjustments: {
    criteria: string;
    impact: number;
    reason: string;
  }[];
  key_considerations: string[];
  final_rating: string;
}

export interface StrengthsSynthesis {
  strengths: {
    strength: string;
    description: string;
    impact: string;
    score_contribution: string;
  }[];
  synthesis_summary: string;
}

export interface WeaknessesSynthesis {
  weaknesses: {
    weakness: string;
    risk_description: string;
    severity: "critical" | "serious" | "attention";
    score_impact: string;
    recommendation: string;
  }[];
  next_steps: string[];
}

export interface BenchmarkingAnalysis {
  benchmarks: {
    metric: string;
    pitch_value: string;
    benchmark_value: string;
    status: "Above Benchmark" | "Meets Benchmark" | "Below Benchmark" | "Unknown";
  }[];
  interpretation: {
    strengths: string[];
    areas_for_improvement: string[];
  };
  positioning_statement: string;
}

export interface ExecutiveSummary {
  company_name: string;
  sector_stage: string;
  thesis: string;
  traction_one_liner: string;
  team_one_liner: string;
  market_opportunity: string;
  ask_milestones: string;
  recommendation: "PASS" | "INVESTIGATE" | "STRONG INTEREST";
  reasoning: string;
}

export interface StructuredReport {
  investment_thesis: string;
  next_steps: string[];
  full_report_text: string;
  disclaimer: string;
}

export interface RoadmapAction {
  month: number;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
}

export interface StrategicAdvice {
  roadmap: RoadmapAction[];
  priorityValidations: string[];
  quickWins: string[];
}

export interface AnalysisResult {
  id: string;
  segment: string;
  createdAt: Date;
  status: 'processing' | 'completed' | 'failed';
  currentPhase: number;


  // Phase 0: Deck Structure
  deckAnalysis?: DeckAnalysis;
  financialAnalysis?: FinancialAnalysis;
  tractionAnalysis?: TractionAnalysis;
  marketSizingAnalysis?: MarketSizingAnalysis;
  problemAnalysis?: ProblemAnalysis;
  businessModelAnalysis?: BusinessModelAnalysis;
  financialProjectionsAnalysis?: FinancialProjectionsAnalysis;
  tractionCritique?: TractionCritique;
  growthAnalysis?: GrowthAnalysis;
  teamAnalysis?: TeamAnalysis;
  sectorAdjustment?: SectorAdjustment;
  strengthsSynthesis?: StrengthsSynthesis;
  weaknessesSynthesis?: WeaknessesSynthesis;
  benchmarkingAnalysis?: BenchmarkingAnalysis;
  executiveSummary?: ExecutiveSummary;
  structuredReport?: StructuredReport;

  // Phase 1: Market Research
  marketData: MarketData;
  competitors: Competitor[];

  // Phase 2: Critical Analysis
  riskAssessment: RiskAssessment;

  // Phase 3: Scoring
  scoreBreakdown: ScoreBreakdown;

  // Phase 4: Strategic Advice
  strategicAdvice: StrategicAdvice;
}

export interface TerminalLog {
  text: string;
  type: 'command' | 'info' | 'success' | 'warning' | 'calc' | 'ai';
  phase: number;
}

export type AnalysisPhase = 1 | 2 | 3 | 4;

export const PHASE_NAMES: Record<AnalysisPhase, string> = {
  1: 'Pesquisa de Mercado',
  2: 'Análise Crítica',
  3: 'Algoritmo de Pontuação',
  4: 'Consultoria Estratégica',
};
