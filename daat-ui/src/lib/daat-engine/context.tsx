import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnalysisResult, TerminalLog, AnalysisPhase } from './types';
import { createMockAnalysisResult, generateTerminalLogs, mockCompetitors } from './mock-data';

interface AnalysisState {
  isAnalyzing: boolean;
  currentPhase: AnalysisPhase;
  logs: TerminalLog[];
  result: AnalysisResult | null;
  segment: string;
}

interface DaatEngineContextType {
  state: AnalysisState;
  startAnalysis: (segment: string, competitors: string[], pitchDeck?: File) => void;
  resetAnalysis: () => void;
  getCompetitors: () => typeof mockCompetitors;
  getBaseScore: () => number;
  setResult: (result: AnalysisResult) => void;
}

const DaatEngineContext = createContext<DaatEngineContextType | null>(null);

const initialState: AnalysisState = {
  isAnalyzing: false,
  currentPhase: 1,
  logs: [],
  result: null,
  segment: '',
};

export function DaatEngineProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AnalysisState>(initialState);

  const startAnalysis = useCallback(async (segment: string, competitors: string[], pitchDeck?: File) => {
    // 1. Set Initial State
    setState({
      isAnalyzing: true,
      currentPhase: 1,
      logs: [],
      result: null,
      segment,
    });

    // 2. Start Visual Simulation (Logs)
    const allLogs = generateTerminalLogs(segment);
    let logIndex = 0;

    const logInterval = setInterval(() => {
      if (logIndex >= allLogs.length) {
        clearInterval(logInterval);
        return;
      }
      const log = allLogs[logIndex];
      setState(prev => ({
        ...prev,
        currentPhase: log.phase > prev.currentPhase ? log.phase as AnalysisPhase : prev.currentPhase,
        logs: [...prev.logs, log]
      }));
      logIndex++;
    }, 800);

    // 3. Call Real Backend
    try {
      const token = localStorage.getItem("daat_token");

      const formData = new FormData();
      formData.append("customerSegment", segment);
      formData.append("problem", `Análise de mercado para ${segment}`);
      formData.append("valueProposition", "Análise Estratégica Geral");
      if (pitchDeck) {
        formData.append("pitch_deck", pitchDeck);
      }

      // Dynamic import to avoid circular dependencies
      const api = (await import('../../services/api')).default;
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      // Axios handles multipart/form-data automatically when passed FormData

      const response = await api.post('/api/analyze-public/', formData, { headers });
      const data = response.data;

      const handleCompletion = (apiData: any) => {
        clearInterval(logInterval);

        const feedback = apiData.feedback || {};
        const sections = feedback.sections || {};
        const metrics = feedback.metrics || {};

        // Parse Riscos strings into objects
        const risks = (sections.riscos || []).map((r: string) => ({
          title: r,
          severity: 'medium',
          description: 'Identificado pela IA'
        }));

        // Parse Forças
        const strengths = (sections.forcas || []).map((s: string) => ({
          title: s,
          evidence: 'Análise de mercado'
        }));

        // HYBRID MERGE: Real AI Data with structure
        const hybridResult: AnalysisResult = {
          ...createMockAnalysisResult(segment), // Base structure
          competitors: (metrics.competitors || []).map((c: any) => ({
            id: c.name,
            name: c.name,
            marketShare: 0,
            revenue: "N/A",
            growth: 0,
            description: c.strength || "",
            stats: { pricing: 50, ux: 50, features: 50, support: 50, innovation: 50 },
            strengths: [c.strength || "Forte presença"],
            weaknesses: ["Não analisado"]
          })),
          id: apiData.id || apiData.task_id || "daat-real-" + Date.now(),

          scoreBreakdown: {
            ...createMockAnalysisResult(segment).scoreBreakdown,
            totalScore: apiData.score || 0,
            classification: apiData.score > 70 ? 'Alta Viabilidade' : apiData.score > 40 ? 'Viabilidade Moderada' : 'Alto Risco',
          },

          marketData: {
            ...createMockAnalysisResult(segment).marketData,
            tam: metrics.marketSize || "Não estimado",
            growthRate: parseInt(metrics.growthRate) || 0, // Fallback to 0 if really missing, but Prompt ensures value
            trends: [sections.mercado ? "Análise Detalhada Disponível" : "Sem dados", ...(createMockAnalysisResult(segment).marketData.trends || [])].slice(0, 3)
          },

          riskAssessment: {
            level: 'medium',
            viabilityIndex: apiData.score || 50,
            strengths: strengths.length > 0 ? strengths : createMockAnalysisResult(segment).riskAssessment.strengths,
            risks: risks.length > 0 ? risks : createMockAnalysisResult(segment).riskAssessment.risks
          },

          strategicAdvice: {
            roadmap: createMockAnalysisResult(segment).strategicAdvice.roadmap, // Keep mock roadmap for now as AI doesn't return structured roadmap yet
            priorityValidations: ["Validar TAM", "Entrevistar clientes", "MVP Rápido"],
            quickWins: sections.conselho ? [sections.conselho] : ["Seguir plano de ação"]
          }
        };

        // Store raw feedback for debugging/fallback
        (hybridResult as any).feedback = apiData.feedback;

        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          result: hybridResult,
          currentPhase: 4
        }));
        localStorage.setItem("last_analysis", JSON.stringify(hybridResult));
      };

      if (data.status === 'completed') {
        handleCompletion(data.data);
      } else if (data.task_id) {

        // ---------------------------------------------------------
        // SSE IMPLEMENTATION (Server-Sent Events)
        // ---------------------------------------------------------
        const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:8000");
        const streamUrl = `${apiUrl}/api/stream/${data.task_id}/`;

        console.log("🔌 Connecting to EventStream:", streamUrl);
        const eventSource = new EventSource(streamUrl);

        eventSource.onopen = () => {
          console.log("🔌 SSE Connected!");
        };

        eventSource.onmessage = (event) => {
          try {
            const parsedData = JSON.parse(event.data);

            // Heartbeat / Connected
            if (parsedData.status === 'connected') return;

            // Error from backend
            if (parsedData.status === 'error') {
              console.error("SSE Error:", parsedData.message);
              eventSource.close();
              clearInterval(logInterval);
              setState(prev => ({ ...prev, isAnalyzing: false }));
              alert(`Erro na análise: ${parsedData.message}`);
              return;
            }

            // Completion
            if (parsedData.status === 'completed') {
              console.log("✅ Analysis Completed via SSE");
              eventSource.close();
              clearInterval(logInterval);
              handleCompletion(parsedData.data);
              return;
            }

            // Processing Update (optional: update logs based on real backend feedback)
            if (parsedData.status === 'processing') {
              // Future: Update 'logs' state with real backend feedback instead of mock logs
              // For now, we keep the mock logs running until completion
              // console.log("SSE Update:", parsedData); 
            }

          } catch (e) {
            console.error("Error parsing SSE data", e);
          }
        };

        eventSource.onerror = (err) => {
          console.error("SSE Connection Error:", err);
          eventSource.close();
          clearInterval(logInterval);
          setState(prev => ({ ...prev, isAnalyzing: false }));
          // alert("Conexão perdida com o servidor."); 
        };

        // Cleanup function if component unmounts (safety net)
        // Note: In this context we don't have a direct cleanup hook for the provider unmount
        // but since it's a singleton provider, it persists. 

      } else {
        console.error("No task_id returned");
        setState(prev => ({ ...prev, isAnalyzing: false }));
        alert("Erro ao iniciar análise.");
      }
    } catch (error: any) {
      console.error("API Error", error);
      clearInterval(logInterval);
      setState(prev => ({ ...prev, isAnalyzing: false }));

      if (error.response) {
        if (error.response.status === 402) {
          alert("💳 " + (error.response.data.detail || "Sem créditos suficientes."));
          // Future: Trigger Paywall Modal
        } else if (error.response.status === 401) {
          alert("🔒 " + (error.response.data.detail || "Faça login para continuar."));
          // Future: Redirect to Login
        } else {
          alert("Erro no servidor: " + error.message);
        }
      } else {
        alert("Erro de conexão. Verifique se o backend está rodando.");
      }
    }

  }, []);

  const resetAnalysis = useCallback(() => {
    setState(initialState);
  }, []);

  const getCompetitors = useCallback(() => {
    return state.result?.competitors || mockCompetitors;
  }, [state.result]);

  const getBaseScore = useCallback(() => {
    return state.result?.scoreBreakdown.totalScore || 72;
  }, [state.result]);

  const setResult = useCallback((result: AnalysisResult) => {
    setState(prev => ({ ...prev, result, currentPhase: 4, isAnalyzing: false }));
  }, []);

  return (
    <DaatEngineContext.Provider value={{
      state,
      startAnalysis,
      resetAnalysis,
      getCompetitors,
      getBaseScore,
      setResult,
    }}>
      {children}
    </DaatEngineContext.Provider>
  );
}

export function useDaatEngine() {
  const context = useContext(DaatEngineContext);
  if (!context) {
    throw new Error('useDaatEngine must be used within DaatEngineProvider');
  }
  return context;
}
