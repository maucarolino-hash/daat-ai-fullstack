import { useState, useEffect } from 'react';
import api from '../services/api';

const ConnectionTest = () => {
    const [status, setStatus] = useState('Testando...');
    const [details, setDetails] = useState('');
    const [configUrl, setConfigUrl] = useState(api.defaults.baseURL);

    const testConnection = async () => {
        setStatus('Conectando...');
        setDetails('');
        try {
            const startTime = Date.now();
            // Tenta acessar uma rota pública ou o admin (que redireciona)
            // Usamos 'HEAD' ou 'GET' no root ou admin para ver se responde
            const response = await api.get('/admin/login/');

            const endTime = Date.now();
            const duration = endTime - startTime;

            setStatus(`✅ Sucesso! (Status: ${response.status})`);
            setDetails(`Tempo: ${duration}ms\nURL: ${response.config.url}\nBaseURL: ${response.config.baseURL}`);

        } catch (error) {
            if (error.response) {
                // O servidor respondeu, mas com erro (ex: 404, 500)
                // Isso AINDA É SUCESSO de conexão (o servidor existe!)
                setStatus(`⚠️ Conectado, mas com erro HTTP (Status: ${error.response.status})`);
                setDetails(`Texto: ${error.response.statusText}\nData: ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                // A requisição foi feita mas sem resposta (Network Error, CORS, Server Down)
                setStatus('❌ Falha de Rede / CORS / Servidor Offline');
                setDetails(`Erro: ${error.message}\nVerifique se o backend permite CORS para esta origem.`);
            } else {
                setStatus('❌ Erro Interno');
                setDetails(`Erro: ${error.message}`);
            }
            console.error(error);
        }
    };

    useEffect(() => {
        testConnection();
    }, []);

    return (
        <div style={{ padding: '20px', color: 'white', backgroundColor: '#1a202c', minHeight: '100vh' }}>
            <h1>Teste de Conexão</h1>
            <p><strong>Backend URL Configurada:</strong> {configUrl}</p>

            <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #4a5568', borderRadius: '8px' }}>
                <h2>Status: {status}</h2>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#a0aec0' }}>
                    {details}
                </pre>
            </div>

            <button
                onClick={testConnection}
                style={{ padding: '10px 20px', backgroundColor: '#3182ce', color: 'white', border: 'none', borderRadius: '5px' }}
            >
                Testar Novamente
            </button>
        </div>
    );
};

export default ConnectionTest;
