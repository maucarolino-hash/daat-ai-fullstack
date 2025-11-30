import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const ConnectionTest = () => {
    const [status, setStatus] = useState('Testando...');
    const [details, setDetails] = useState('');
    const [configUrl, setConfigUrl] = useState(API_BASE_URL);

    const testConnection = async () => {
        setStatus('Conectando...');
        setDetails('');
        try {
            const startTime = Date.now();
            // Tenta acessar uma rota pública ou o admin (que redireciona)
            // Usamos 'HEAD' ou 'GET' no root ou admin para ver se responde
            const response = await fetch(`${API_BASE_URL}/admin/login/`, {
                method: 'GET',
                mode: 'cors', // Importante para testar CORS
            });

            const endTime = Date.now();
            const duration = endTime - startTime;

            if (response.ok || response.status === 200 || response.type === 'opaque') {
                setStatus(`✅ Sucesso! (Status: ${response.status})`);
                setDetails(`Tempo: ${duration}ms\nURL: ${response.url}\nType: ${response.type}`);
            } else {
                setStatus(`⚠️ Respondeu com erro (Status: ${response.status})`);
                setDetails(`Texto: ${response.statusText}`);
            }

        } catch (error) {
            setStatus('❌ Falha Total (Catch)');
            setDetails(`Erro: ${error.message}\nNome: ${error.name}\nStack: ${error.stack}`);
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
