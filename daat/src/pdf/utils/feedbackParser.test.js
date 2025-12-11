import { describe, it, expect } from 'vitest';
import { parseFeedback } from './feedbackParser';

describe('parseFeedback', () => {
    it('deve extrair todas as 4 seções corretamente', () => {
        const input = `
      [SEÇÃO 1: Análise de Mercado]
      O mercado de tecnologia está em crescimento exponencial.
      Há uma demanda crescente por soluções inovadoras.
      
      [SEÇÃO 2: Forças e Potencial]
      - Equipe técnica experiente
      - Tecnologia proprietária diferenciada
      - Parcerias estratégicas estabelecidas
      
      [SEÇÃO 3: Riscos Críticos]
      - Concorrência acirrada no setor
      - Dependência de fornecedores externos
      
      [SEÇÃO 4: Conselho Estratégico]
      Recomenda-se focar em marketing digital e expansão gradual.
      Priorizar a retenção de clientes antes da aquisição massiva.
    `;

        const result = parseFeedback(input);

        // Verificar Seção 1: Mercado
        expect(result.mercado).toContain('mercado de tecnologia');
        expect(result.mercado).toContain('crescimento exponencial');

        // Verificar Seção 2: Forças
        expect(result.forcas).toHaveLength(3);
        expect(result.forcas[0]).toContain('Equipe técnica');
        expect(result.forcas[1]).toContain('Tecnologia proprietária');
        expect(result.forcas[2]).toContain('Parcerias estratégicas');

        // Verificar Seção 3: Riscos
        expect(result.riscos).toHaveLength(2);
        expect(result.riscos[0]).toContain('Concorrência acirrada');
        expect(result.riscos[1]).toContain('Dependência de fornecedores');

        // Verificar Seção 4: Conselho
        expect(result.conselho).toContain('marketing digital');
        expect(result.conselho).toContain('retenção de clientes');
    });

    it('deve usar fallback quando não há seções formatadas', () => {
        const input = 'Este é um texto simples sem formatação de seções.';
        const result = parseFeedback(input);

        expect(result.mercado).toBe(input);
        expect(result.forcas).toHaveLength(0);
        expect(result.riscos).toHaveLength(0);
        expect(result.conselho).toBe('');
    });

    it('deve lidar com texto vazio', () => {
        const result = parseFeedback('');

        expect(result.mercado).toBe('');
        expect(result.forcas).toHaveLength(0);
        expect(result.riscos).toHaveLength(0);
        expect(result.conselho).toBe('');
    });

    it('deve lidar com null/undefined', () => {
        const resultNull = parseFeedback(null);
        const resultUndefined = parseFeedback(undefined);

        expect(resultNull.mercado).toBe('');
        expect(resultUndefined.mercado).toBe('');
    });

    it('deve remover marcadores de negrito (**)', () => {
        const input = `
      [SEÇÃO 1]
      **Texto em negrito** e texto normal
      
      [SEÇÃO 2]
      - **Item em negrito**
    `;

        const result = parseFeedback(input);

        expect(result.mercado).not.toContain('**');
        expect(result.forcas[0]).not.toContain('**');
    });

    it('deve aceitar formato [SEÇÃO X] sem título', () => {
        const input = `
      [SEÇÃO 1]
      Conteúdo da seção 1
      
      [SEÇÃO 2]
      - Item 1
      - Item 2
    `;

        const result = parseFeedback(input);

        expect(result.mercado).toContain('Conteúdo da seção 1');
        expect(result.forcas).toHaveLength(2);
    });

    it('deve aceitar formato [SEÇÃO X: Título Customizado]', () => {
        const input = `
      [SEÇÃO 1: Minha Análise Personalizada]
      Análise detalhada aqui
      
      [SEÇÃO 2: Pontos Fortes]
      - Força A
    `;

        const result = parseFeedback(input);

        expect(result.mercado).toContain('Análise detalhada');
        expect(result.forcas).toHaveLength(1);
        expect(result.forcas[0]).toBe('Força A');
    });

    it('deve lidar com múltiplos tipos de marcadores de lista', () => {
        const input = `
      [SEÇÃO 2]
      - Item com hífen
      * Item com asterisco
      • Item com bullet
      
      [SEÇÃO 3]
      - Risco 1
      * Risco 2
    `;

        const result = parseFeedback(input);

        expect(result.forcas).toHaveLength(3);
        expect(result.riscos).toHaveLength(2);
    });

    it('deve preservar o texto original em result.raw', () => {
        const input = '[SEÇÃO 1] Teste';
        const result = parseFeedback(input);

        expect(result.raw).toBe(input);
    });
});
