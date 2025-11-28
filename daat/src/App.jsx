import React, { useState } from 'react';
import DiagnosticForm from './components/DiagnosticForm';
import HistorySidebar from './components/HistorySidebar';

function App() {
  // O ESTADO GLOBAL: Qual relatório estamos a ver agora?
  // null = Modo "Nova Análise" (Formulário vazio)
  const [activeReport, setActiveReport] = useState(null);
  const [resetKey, setResetKey] = useState(0); // Chave para forçar reset do form

  // Função para limpar e começar do zero
  const handleNewAnalysis = () => {
    setActiveReport(null);
    setResetKey(prev => prev + 1);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-main)' }}>

      {/* SIDEBAR: Recebe a função para AVISAR que mudou */}
      <div style={{ width: '280px', flexShrink: 0, backgroundColor: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column' }}>
        <HistorySidebar
          onSelectReport={(report) => setActiveReport(report)}
          onNewAnalysis={handleNewAnalysis} // Botão "+"
        />
      </div>

      {/* ÁREA PRINCIPAL: Recebe os DADOS para mostrar */}
      <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>

          <header style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '10px' }}>
              Daat <span style={{ color: 'var(--brand-primary)' }}>AI</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              Intelligence Dashboard v1.0
            </p>
          </header>

          {/* O Formulário reage ao relatório ativo */}
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
