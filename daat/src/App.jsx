import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DiagnosticForm from './components/DiagnosticForm';
import HistorySidebar from './components/HistorySidebar';
import Login from './components/Login';
import ConnectionTest from './components/ConnectionTest';

// Componente Principal do Dashboard (Protegido)
const Dashboard = ({ token, onLogout }) => {
  const [activeReport, setActiveReport] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [formKey, setFormKey] = useState(0);

  return (
    <div className="app-container">
      <div className="app-sidebar">
        <HistorySidebar
          token={token}
          onSelectReport={setActiveReport}
          onNewAnalysis={() => {
            setActiveReport(null);
            setFormKey(prev => prev + 1);
          }}
          onLogout={onLogout}
          refreshTrigger={refreshTrigger}
        />
      </div>

      <main className="app-main">
        <div className="content-wrapper">
          <header className="app-header">
            <div className="header-content">
              <div className="brand-container">
                <h1>Daat <span>AI</span></h1>
                <p>Intelligence Dashboard v1.0</p>
              </div>

              <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
                <button className="btn-logout" onClick={onLogout}>
                  Sair
                </button>
              </div>
            </div>
          </header>

          <DiagnosticForm
            key={formKey}
            initialData={activeReport}
            token={token}
            onAnalysisComplete={() => setRefreshTrigger(prev => prev + 1)}
          />
        </div>
      </main>
    </div>
  );
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('daat_token'));

  const handleLogin = (newToken) => {
    localStorage.setItem('daat_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('daat_token');
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        {/* Rota de Teste de Conexão (Pública) */}
        <Route path="/test" element={<ConnectionTest />} />

        {/* Rota Principal (Protegida) */}
        <Route
          path="/"
          element={
            token ? (
              <Dashboard token={token} onLogout={handleLogout} />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
