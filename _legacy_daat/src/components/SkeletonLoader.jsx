import React from 'react';

const SkeletonLoader = () => {
    return (
        <div style={{
            padding: '20px',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            backgroundColor: '#f7fafc',
            height: '100%', // Ocupa todo o espaço do pai
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        }}>
            {/* Barra do Score (Grande) */}
            <div className="skeleton-pulse" style={{ width: '80px', height: '50px' }}></div>

            {/* Barra de Título */}
            <div className="skeleton-pulse" style={{ width: '40%', height: '20px' }}></div>

            {/* Barras de Texto (Simulando 3 linhas) */}
            <div className="skeleton-pulse" style={{ width: '100%', height: '15px' }}></div>
            <div className="skeleton-pulse" style={{ width: '90%', height: '15px' }}></div>
            <div className="skeleton-pulse" style={{ width: '70%', height: '15px' }}></div>
        </div>
    );
};

export default SkeletonLoader;
