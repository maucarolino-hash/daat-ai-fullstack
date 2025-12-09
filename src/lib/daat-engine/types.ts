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

export interface MarketData {
  tam: string; // Total Addressable Market
  sam: string; // Serviceable Addressable Market
  som: string; // Serviceable Obtainable Market
  growthRate: number;
  trends: string[];
}

export interface RiskAssessment {
  level: 'high' | 'medium' | 'low';
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
  marketOpportunity: number; // max 30
  competitivePosition: number; // max 30
  executionViability: number; // max 25
  riskAdjustment: number; // max -15
  totalScore: number;
  classification: 'Alta Viabilidade' | 'Viabilidade Moderada' | 'Baixa Viabilidade' | 'Alto Risco';
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
