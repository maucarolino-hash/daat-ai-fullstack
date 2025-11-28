import React, { useState, useCallback } from 'react';
import DiagnosticForm from './components/DiagnosticForm';
import HistorySidebar from './components/HistorySidebar';

function App() {
  const [activeReport, setActiveReport] = useState(null);
  const [resetKey, setResetKey] = useState(0);

  const handleNewAnalysis = useCallback(() => {
    setActiveReport(null);
    setResetKey(prev => prev + 1);
  }, []);

  const handleSelectReport = useCallback((report) => {
    setActiveReport(report);
  }, []);

  return (
    // Usamos classes CSS para controlar o layout agora
    <div className="app-container">

      {/* SIDEBAR (Menu) */}
      <div className="app-sidebar">
        <HistorySidebar
          onSelectReport={handleSelectReport}
          onNewAnalysis={handleNewAnalysis}
        />
      </div>

      {/* ÁREA PRINCIPAL */}
      <main className="app-main">
        <div className="content-wrapper">

          <header className="app-header">
            <h1>Daat <span>AI</span></h1>
            <p>Intelligence Dashboard v1.0</p>
          </header>

          <DiagnosticForm
            initialData={activeReport}
            key={activeReport ? activeReport.id : `new-${resetKey}`}
          />

        </div>
      </main>
    </div>
  );
}

export default App;
