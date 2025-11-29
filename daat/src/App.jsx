import React, { useState, useEffect } from 'react';
import DiagnosticForm from './components/DiagnosticForm';
import HistorySidebar from './components/HistorySidebar';
import Login from './components/Login'; // <--- Importe o Login

function App() {
  // Estado do Token (Tenta ler do localStorage ao iniciar)
  const [token, setToken] = useState(localStorage.getItem('daat_token'));

  const [activeReport, setActiveReport] = useState(null);

  // Função para salvar o token quando fizer login
  const handleLogin = (newToken) => {
    localStorage.setItem('daat_token', newToken);
    setToken(newToken);
  };

  // Função de Logout
  const handleLogout = () => {
    localStorage.removeItem('daat_token');
    setToken(null);
    setActiveReport(null);
  };

  // SE NÃO TIVER TOKEN, MOSTRA TELA DE LOGIN
  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  // SE TIVER TOKEN, MOSTRA O DASHBOARD (O App original)
  return (
    <div className="app-container">

      {/* SIDEBAR */}
      <div className="app-sidebar">
        <HistorySidebar
          token={token} // <--- Passamos o token para a sidebar buscar o histórico
          onSelectReport={(report) => setActiveReport(report)}
          onNewAnalysis={() => setActiveReport(null)}
          onLogout={handleLogout} // Passamos a função de logout
        />
      </div>

      {/* ÁREA PRINCIPAL */}
      <main className="app-main">
        <div className="content-wrapper">
          <header className="app-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1>Daat <span>AI</span></h1>
                <p>Intelligence Dashboard v1.0</p>
              </div>
              {/* Botão de Logout Mobile (Opcional) */}
              <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #334155', color: '#94A3B8', padding: '5px 10px', borderRadius: '5px', fontSize: '0.8rem', cursor: 'pointer' }}>
                Sair
              </button>
            </div>
          </header>

          <DiagnosticForm
            initialData={activeReport}
            token={token} // <--- Passamos o token para o form poder salvar
          />

        </div>
      </main>
    </div>
  );
}

export default App;
