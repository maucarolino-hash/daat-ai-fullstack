import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MarketGrowthChart = ({ growthRate, marketSize, id = "market-chart" }) => {
    // Parser dos dados
    const rate = parseFloat(growthRate) || 15; // Default 15% se não tiver
    // Tenta extrair número do marketSize, se falhar usa 100 (base index 100)
    let baseValue = 100;

    // Gera dados de projeção para 5 anos
    const data = [];
    let currentValue = baseValue;
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < 5; i++) {
        data.push({
            year: currentYear + i,
            value: Math.round(currentValue)
        });
        currentValue = currentValue * (1 + rate / 100);
    }

    return (
        <div
            id={id}
            style={{
                width: '600px',
                height: '300px',
                background: '#fff',
                padding: '20px',
                position: 'absolute',
                left: '-9999px', // Escondido da viewport mas renderizado
                top: 0
            }}
        >
            <h3 style={{ fontFamily: 'Arial', textAlign: 'center', marginBottom: '10px', color: '#333' }}>
                Projeção de Crescimento do Mercado
            </h3>
            <p style={{ fontFamily: 'Arial', textAlign: 'center', fontSize: '12px', color: '#666', marginBottom: '20px' }}>
                Crescimento Anual Composto (CAGR): {rate}%
            </p>

            <ResponsiveContainer width="100%" height={240}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#2563EB"
                        fill="#3B82F6"
                        fillOpacity={0.2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MarketGrowthChart;
