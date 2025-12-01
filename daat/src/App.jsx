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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Mobile Header Overlay for Menu */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />

      <div className={`app-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <HistorySidebar
          token={token}
          onSelectReport={(report) => {
            setActiveReport(report);
            setIsMobileMenuOpen(false); // Close menu on selection
          }}
          onNewAnalysis={() => {
            setActiveReport(null);
            setFormKey(prev => prev + 1);
            setIsMobileMenuOpen(false);
          }}
          onLogout={onLogout}
          refreshTrigger={refreshTrigger}
        />
      </div>

      <main className="app-main">
        <div className="content-wrapper">
          <header className="app-header">
            <div className="header-content">
              {/* Mobile Menu Button */}
              <button
                className="btn-mobile-menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>

              <div className="brand-container">
                <h1>Daat <span>AI</span></h1>
                <p>Intelligence Dashboard v1.0</p>
              </div>
              <button className="btn-logout" onClick={onLogout}>
                Sair
              </button>
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
