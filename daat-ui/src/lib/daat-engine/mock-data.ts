import { AnalysisResult, Competitor, TerminalLog } from './types';

export const mockCompetitors: Competitor[] = [
  {
    id: 'acme',
    name: 'Acme Corp',
    revenue: 'R$50M',
    marketShare: 24,
    growth: 15,
    strengths: ['Marca estabelecida', 'Grande base de clientes', 'Forte presença enterprise'],
    weaknesses: ['Interface defasada', 'Suporte lento', 'Preços altos'],
    stats: { pricing: 70, ux: 75, features: 80, support: 60, innovation: 65 },
  },
  {
    id: 'globex',
    name: 'Globex',
    revenue: 'R$42,5M',
    marketShare: 18,
    growth: 8,
    strengths: ['Bom custo-benefício', 'Integração fácil'],
    weaknesses: ['Poucos recursos avançados', 'Documentação ruim'],
    stats: { pricing: 80, ux: 70, features: 75, support: 72, innovation: 68 },
  },
  {
    id: 'soylent',
    name: 'Soylent Corp',
    revenue: 'R$31M',
    marketShare: 15,
    growth: -3,
    strengths: ['Preço competitivo', 'Simplicidade'],
    weaknesses: ['Crescimento negativo', 'Falta de inovação', 'Equipe reduzida'],
    stats: { pricing: 90, ux: 65, features: 60, support: 55, innovation: 50 },
  },
  {
    id: 'umbrella',
    name: 'Umbrella Tech',
    revenue: 'R$24M',
    marketShare: 12,
    growth: 22,
    strengths: ['Alta inovação', 'UX moderna', 'Crescimento acelerado'],
    weaknesses: ['Empresa jovem', 'Menos recursos', 'Suporte limitado'],
    stats: { pricing: 60, ux: 80, features: 85, support: 78, innovation: 82 },
  },
  {
    id: 'initech',
    name: 'Initech Solutions',
    revenue: 'R$18M',
    marketShare: 8,
    growth: 5,
    strengths: ['Nicho especializado', 'Alta retenção'],
    weaknesses: ['Mercado limitado', 'Pouca escalabilidade'],
    stats: { pricing: 75, ux: 68, features: 70, support: 80, innovation: 55 },
  },
];

export const createMockAnalysisResult = (segment: string): AnalysisResult => ({
  id: `analysis-${Date.now()}`,
  segment,
  createdAt: new Date(),
  status: 'completed',
  currentPhase: 4,

  marketData: {
    tam: 'R$21B',
    sam: 'R$4,2B',
    som: 'R$840M',
    growthRate: 12.5,
    trends: [
      'Adoção acelerada de IA no setor',
      'Consolidação de mercado esperada em 2025',
      'Regulamentação LGPD impactando decisões',
      'Migração para soluções cloud-native',
    ],
  },

  competitors: mockCompetitors,

  riskAssessment: {
    level: 'medium',
    viabilityIndex: 72,
    strengths: [
      { title: 'Diferencial Tecnológico', evidence: 'Uso de IA proprietária com 40% mais precisão que concorrentes' },
      { title: 'Time Execution', evidence: 'Fundadores com experiência prévia no setor (ex-Acme, ex-Google)' },
      { title: 'First-Mover Advantage', evidence: 'Único player com análise preditiva em tempo real no Brasil' },
      { title: 'Unit Economics', evidence: 'CAC/LTV ratio de 1:5, acima da média do setor (1:3)' },
    ],
    risks: [
      { title: 'Dependência de Terceiros', severity: 'high', description: 'APIs críticas dependem de providers externos sem redundância' },
      { title: 'Concentração de Receita', severity: 'critical', description: '65% da receita vem de 3 clientes principais' },
      { title: 'Talent Gap', severity: 'medium', description: 'Dificuldade em contratar especialistas em ML no Brasil' },
      { title: 'Regulatory Risk', severity: 'low', description: 'Novas regulamentações de IA podem exigir adaptações' },
    ],
  },

  scoreBreakdown: {
    marketOpportunity: 26, // max 30
    competitivePosition: 24, // max 30
    executionViability: 20, // max 25
    riskAdjustment: -8, // max -15
    totalScore: 72,
    classification: 'Viabilidade Moderada',
  },

  strategicAdvice: {
    roadmap: [
      { month: 1, title: 'Diversificar Base de Clientes', description: 'Lançar campanha de aquisição focada em mid-market para reduzir concentração de receita', priority: 'critical' },
      { month: 1, title: 'Redundância de APIs', description: 'Implementar fallback para providers críticos (Tavily, OpenAI)', priority: 'high' },
      { month: 2, title: 'Programa de Talentos', description: 'Criar programa de formação interna para ML engineers', priority: 'medium' },
      { month: 2, title: 'Certificação LGPD', description: 'Obter certificação oficial para diferencial competitivo', priority: 'high' },
      { month: 3, title: 'Expansão Enterprise', description: 'Lançar tier enterprise com SLA dedicado e compliance avançado', priority: 'high' },
      { month: 3, title: 'Parcerias Estratégicas', description: 'Fechar parceria com 2 consultorias Big 4 para canal de vendas', priority: 'medium' },
    ],
    priorityValidations: [
      'Validar disposição de mid-market em pagar pelo produto (entrevistar 20 prospects)',
      'Testar alternativas de API com benchmark de performance',
      'Confirmar demanda enterprise com 5 LOIs antes de investir em features',
    ],
    quickWins: [
      'Adicionar dashboard de ROI para clientes (aumenta retenção em 15%)',
    ],
  },
});

export const generateTerminalLogs = (segment: string): TerminalLog[] => [
  // Phase 1: Market Research
  { text: `$ iniciando_motor_daat...`, type: 'command', phase: 1 },
  { text: `[FASE 1] Pesquisa de Mercado`, type: 'info', phase: 1 },
  { text: `> query: '${segment} competitors Brazil 2024'...`, type: 'command', phase: 1 },
  { text: `[INFO] Conectando à API Tavily...`, type: 'info', phase: 1 },
  { text: `[INFO] Buscando dados de inteligência de mercado...`, type: 'info', phase: 1 },
  { text: `> found: 5 concorrentes diretos identificados`, type: 'success', phase: 1 },
  { text: `[CALC] validando_tamanho_mercado...`, type: 'calc', phase: 1 },
  { text: `[CALC] TAM calculado: R$21B`, type: 'calc', phase: 1 },
  { text: `[CALC] taxa_crescimento: 12,5% ao ano`, type: 'calc', phase: 1 },
  { text: `[SUCESSO] Dados de mercado coletados ✓`, type: 'success', phase: 1 },

  // Phase 2: Critical Analysis
  { text: `[FASE 2] Análise Crítica`, type: 'info', phase: 2 },
  { text: `> analisando_riscos...`, type: 'command', phase: 2 },
  { text: `[AI] Processando dados com modelo de risco...`, type: 'ai', phase: 2 },
  { text: `> detectando_fraquezas...`, type: 'command', phase: 2 },
  { text: `[WARNING] Concentração de receita detectada: 65% em 3 clientes`, type: 'warning', phase: 2 },
  { text: `[WARNING] Dependência crítica de APIs externas`, type: 'warning', phase: 2 },
  { text: `> identificando_forças...`, type: 'command', phase: 2 },
  { text: `[INFO] 4 diferenciais competitivos identificados`, type: 'info', phase: 2 },
  { text: `[CALC] calculando_indice_viabilidade...`, type: 'calc', phase: 2 },
  { text: `[SUCESSO] Nível de risco: MÉDIO ✓`, type: 'success', phase: 2 },

  // Phase 3: Scoring Algorithm
  { text: `[FASE 3] Algoritmo de Pontuação`, type: 'info', phase: 3 },
  { text: `> computando_matriz_pontuacao...`, type: 'command', phase: 3 },
  { text: `[CALC] Oportunidade de Mercado: 26/30`, type: 'calc', phase: 3 },
  { text: `[CALC] Posição Competitiva: 24/30`, type: 'calc', phase: 3 },
  { text: `[CALC] Viabilidade de Execução: 20/25`, type: 'calc', phase: 3 },
  { text: `> ajustando_fatores_risco...`, type: 'command', phase: 3 },
  { text: `[CALC] Ajuste de Risco: -8`, type: 'calc', phase: 3 },
  { text: `[SUCESSO] Pontuação Final: 72/100 ✓`, type: 'success', phase: 3 },

  // Phase 4: Strategic Advice
  { text: `[FASE 4] Consultoria Estratégica`, type: 'info', phase: 4 },
  { text: `> gerando_roadmap...`, type: 'command', phase: 4 },
  { text: `[AI] Sintetizando recomendações estratégicas...`, type: 'ai', phase: 4 },
  { text: `[INFO] 6 ações para roadmap de 90 dias`, type: 'info', phase: 4 },
  { text: `> compilando_validacoes_prioritarias...`, type: 'command', phase: 4 },
  { text: `[INFO] 3 validações críticas identificadas`, type: 'info', phase: 4 },
  { text: `[AI] Gerando quick wins...`, type: 'ai', phase: 4 },
  { text: `[SUCESSO] Análise Daat concluída ✓`, type: 'success', phase: 4 },
];
