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
  startAnalysis: (segment: string, competitors: string[]) => void;
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

  const startAnalysis = useCallback(async (segment: string, competitors: string[]) => {
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
      const payload = {
        customerSegment: segment,
        problem: `Análise de mercado para ${segment}`, // Synthesized
        valueProposition: "Análise Estratégica Geral" // Synthesized
      };

      // Dynamic import to avoid circular dependencies
      const api = (await import('../../services/api')).default;
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await api.post('/api/analyze-public/', payload, { headers });
      const data = response.data;

      const handleCompletion = (apiData: any) => {
        clearInterval(logInterval);

        // HYBRID MERGE: Real Score/Feedback + Mock Charts
        // This ensures the UI is full while Backend is limited
        const hybridResult: AnalysisResult = {
          ...createMockAnalysisResult(segment), // Start with full mock
          id: apiData.task_id || "daat-real-" + Date.now(),
          // Overwrite with Real AI Data
          scoreBreakdown: {
            ...createMockAnalysisResult(segment).scoreBreakdown,
            totalScore: apiData.score || 0,
            classification: apiData.score > 70 ? 'Alta Viabilidade' : apiData.score > 40 ? 'Viabilidade Moderada' : 'Alto Risco',
          },
          // Use feedback as the main text or first quick win
          strategicAdvice: {
            ...createMockAnalysisResult(segment).strategicAdvice,
            quickWins: [apiData.feedback || "Feedback não disponível.", ...createMockAnalysisResult(segment).strategicAdvice.quickWins.slice(1)]
          }
        };

        // Store pure feedback for simple display if needed
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
        // Initiate Polling
        const pollingId = setInterval(async () => {
          try {
            const pollRes = await api.get(`/api/status/${data.task_id}/`, { headers });
            if (pollRes.data.status === 'completed') {
              clearInterval(pollingId);
              handleCompletion(pollRes.data.data);
            } else if (pollRes.data.status === 'failed') {
              clearInterval(pollingId);
              setState(prev => ({ ...prev, isAnalyzing: false }));
              alert("Erro no processamento da IA.");
            }
          } catch (e) {
            // Ignore transient errors
          }
        }, 3000);

      } else {
        console.error("No task_id returned");
        setState(prev => ({ ...prev, isAnalyzing: false }));
        alert("Erro ao iniciar análise.");
      }

    } catch (error) {
      console.error("API Error", error);
      clearInterval(logInterval);
      setState(prev => ({ ...prev, isAnalyzing: false }));
      // Don't alert here to avoid spamming if it's just a dev mode restart
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
