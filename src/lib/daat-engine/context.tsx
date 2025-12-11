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

  const startAnalysis = useCallback((segment: string, competitors: string[]) => {
    const allLogs = generateTerminalLogs(segment);
    
    setState({
      isAnalyzing: true,
      currentPhase: 1,
      logs: [],
      result: null,
      segment,
    });

    // Simulate the 4-phase process
    let logIndex = 0;
    let currentPhase: AnalysisPhase = 1;

    const processNextLog = () => {
      if (logIndex >= allLogs.length) {
        // Analysis complete
        const result = createMockAnalysisResult(segment);
        setState(prev => ({
          ...prev,
          isAnalyzing: false,
          result,
          currentPhase: 4,
        }));
        return;
      }

      const log = allLogs[logIndex];
      
      // Update phase if needed
      if (log.phase > currentPhase) {
        currentPhase = log.phase as AnalysisPhase;
      }

      setState(prev => ({
        ...prev,
        currentPhase,
        logs: [...prev.logs, log],
      }));

      logIndex++;
      
      // Variable timing for realistic effect
      const delay = log.type === 'command' ? 400 : 
                   log.type === 'calc' ? 300 :
                   log.type === 'ai' ? 600 :
                   log.type === 'success' ? 500 : 250;
      
      setTimeout(processNextLog, delay);
    };

    // Start processing after a short delay
    setTimeout(processNextLog, 500);
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

  return (
    <DaatEngineContext.Provider value={{ 
      state, 
      startAnalysis, 
      resetAnalysis,
      getCompetitors,
      getBaseScore,
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
