# Prompts e Estratégias de Implementação
## IA Autônoma para Análise de Pitch Decks

---

## 📝 Biblioteca de Prompts Prontos

### 1. EXTRATOR DE CONTEÚDO

#### Prompt 1.1: Extração Estruturada
```
Você é um analista especializado em startups.
Analise este pitch deck e extraia ESTRUTURALMENTE:

Para CADA slide, identifique:
1. Número do slide
2. Tipo (Cover, Problem, Solution, Market, Traction, etc)
3. Título/Heading principal
4. 3-5 pontos-chave do conteúdo
5. Dados numéricos mencionados (com unidades)
6. Métricas visíveis (se houver gráficos)
7. Calls-to-action ou próximos passos

Formato de resposta:
[SLIDE 1] [TIPO: Cover]
Título: [...]
Pontos-chave: [...]
Dados: [...]
...

[SLIDE 2] [TIPO: Problem]
...

Seja preciso e estruturado. Não invente dados não mencionados.
```

#### Prompt 1.2: Extração de Métricas Financeiras
```
Localize todas as métricas financeiras neste pitch deck:

Procure por:
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- Burn rate
- CAC (Customer Acquisition Cost)
- LTV (Customer Lifetime Value)
- Churn rate
- Growth rate (MoM, YoY)
- Gross margin %
- Revenue total
- Runway (meses)
- Valuation
- Funding sought

Para cada métrica encontrada:
- Nome exato
- Valor numérico
- Unidade ($/%, meses, etc)
- Contexto (vs benchmark? projetado? realizado?)
- Slide # onde aparece

Se métrica estiver em gráfico, descreva-a.
```

#### Prompt 1.3: Extração de Tração
```
Este é um pitch deck de [FINTECH/HEALTHTECH/SAAS/MARKETPLACE].

Identifique TODAS as evidências de tração mencionadas:

Procure por:
- Número de usuários/clientes (histórico de crescimento)
- Receita obtida até agora
- Logos de clientes ou parcerias
- Press mentions ou awards
- Produtos em produção ou beta
- Testes realizados com usuários
- Pré-vendas ou LOIs
- Eventos/conferências mencionados
- Media coverage
- Crescimento mês-a-mês (%), trimestral, anual

Estruture como:
TRAÇÃO QUANTITATIVA:
- [Métrica]: [Valor] [Timeline]
- [Métrica]: [Valor] [Timeline]

TRAÇÃO QUALITATIVA:
- [Evidence type]: [Description]

TIMELINE (se inferível):
- [Date/Period]: [Achievement]

Importante: Se não houver tração clara, diga explicitamente.
```

---

### 2. ANALISADOR DE OPORTUNIDADE

#### Prompt 2.1: Análise TAM/SAM/SOM
```
Analise o mercado descrito neste pitch deck (setor: [SETOR]).

Procure especificamente por:
1. TAM (Total Addressable Market)
   - Valor mencionado
   - Método de cálculo (top-down? bottom-up?)
   - Fonte dos dados
   - Realismo da estimativa

2. SAM (Serviceable Addressable Market)
   - Segmentação mencionada
   - Geografia
   - Demográfico/comportamental
   - Realismo do escopo

3. SOM (Serviceable Obtainable Market)
   - Goal de market share em 3-5 anos
   - Metadologia de crescimento

Análise crítica:
- [ ] TAM > $100M? (sim/não/incerto)
- [ ] Método de cálculo credível?
- [ ] Fonte verificável?
- [ ] Comparação com mercado real apropriada?

Recomendação: [Aceito/Questionável/Rejeitado]
Justificativa: [...]
```

#### Prompt 2.2: Análise do Problema
```
Analise a apresentação do problema (Slide X):

Avalie:
1. Clareza
   - Problema é específico ou genérico?
   - Afeta qual % da população? (número citado?)
   
2. Validação
   - Há dados que comprovam existência?
   - User research mencionada? (qual tamanho?)
   - Dados de terceiros? (fonte citada?)
   
3. Conexão com solução
   - Problema proposto → Solução proposta = relação clara?
   
4. Por que não foi resolvido
   - Explicação plausível? (incumbents negligenciosos? novo mercado?)

Scoring de "Problem-Solution Fit":
- 9-10: Problema claro, validado, direto à solução
- 7-8: Problema claro, alguma validação
- 5-6: Problema descritivo, validação fraca
- <5: Problema vago ou não-sequência à solução

Score: [_/10]
Feedback: [...]
```

---

### 3. ANALISADOR DE MODELO DE NEGÓCIO

#### Prompt 3.1: Análise de Unit Economics
```
Analisando o modelo de negócio (setor: [SETOR]):

1. REVENUE MODEL
   - Como o negócio ganha dinheiro? (subscription/transactional/hybrid/outros)
   - Pricing mencionado? ($/mês? $/transação? % comissão?)
   - ARPU (Average Revenue Per User)? ARPA (Average Revenue Per Account)?
   
2. CUSTOMER ACQUISITION
   - CAC (Customer Acquisition Cost) mencionado ou calculável?
   - Canais primários? (vendas diretas? self-serve? marketplace?)
   - CAC payback period (quantos meses para recuperar CAC)?
   
3. LIFETIME VALUE
   - LTV mencionado?
   - Churn rate mencionado?
   - Upsell/expansion revenue?
   - LTV:CAC ratio? (ideal >3:1)
   
4. VIABILIDADE
   - Margins realistas para o setor?
   - Escalável sem custo marginal insustentável?
   - Path to profitability claro?

Análise de Red Flags:
- [ ] CAC muito alto (>LTV em 12 meses)? 🚩
- [ ] Negative unit economics não explicadas? 🚩
- [ ] Margins impossíveis para o setor? 🚩
- [ ] Sem modelo claro? 🚩

Viability Score: [_/10]
Recomendação: [Viável/Questionável/Não-viável]
```

#### Prompt 3.2: Análise de Projeções Financeiras
```
Avaliar as projeções financeiras (próximos 3-5 anos):

1. REVENUE GROWTH
   - Crescimento YoY: [Ano 1: %], [Ano 2: %], [Ano 3: %]
   - Realismo: (30-100% para seed/série A é esperado)
   - Declina ao longo do tempo? (esperado)
   
2. BURN RATE & RUNWAY
   - Burn mensal mencionado?
   - Runway atual (meses até zero cash)?
   - Burn melhorando com receita?
   
3. BREAKEVEN & PATH TO PROFITABILITY
   - Quando breakeven? (ano projetado)
   - Plausível? (em 2-4 anos para SaaS)
   
4. DETALHAMENTO
   - Premissas claramente listadas?
   - Componentes de custo delineados?
   - Sensibilidade (what-if scenarios)?

Realism Score: [_/10]
- 9-10: Projeções conservadoras, premissas claras
- 7-8: Otimista mas plausível
- 5-6: Otimista, faltam detalhes
- <5: Irreal (10x+ YoY indefinidamente, etc)

Recomendação: [Crível/Questionável/Irrealista]
```

---

### 4. ANALISADOR DE TRAÇÃO

#### Prompt 4.1: Avaliação de Tração (por estágio)
```
Avalie a tração deste pitch (estágio: [SEED/SÉRIE A/SÉRIE B]):

EXPECTATIVA PARA [ESTÁGIO]:
[INSERT BENCHMARK AQUI]

TRAÇÃO ATUAL IDENTIFICADA:
[USER/REVENUE METRICS EXTRACTED]

AVALIAÇÃO:

1. EXISTE TRAÇÃO?
   - Sim, quantificada
   - Sim, mas vaga
   - Não, ou muito fraca

2. COMPARAÇÃO COM BENCHMARK
   - Acima do esperado ✓
   - No esperado ✓
   - Abaixo do esperado ⚠️
   - Muito abaixo ❌

3. TRAJETÓRIA
   - Acelerando (crescimento >10% MoM)
   - Linear (consistente mas <10% MoM)
   - Desacelerando 🚩
   - Flat/Negativa 🚩

4. QUALIDADE DE MÉTRICAS
   - Vanity metrics (signup, downloads, etc)? ⚠️
   - Real metrics (paid, retention, etc)? ✓
   - Mix apropriado para estágio?

TRACTION SCORE: [_/10]
Stage-Adjusted Rating: [EXCEEDS/MEETS/BELOW expectations]
```

#### Prompt 4.2: Análise de Crescimento (Growth Rate)
```
Analisando a taxa de crescimento:

DADOS EXTRAÍDOS:
- [Métrica]: [Valor mês 1] → [Valor mês N]
- Timeline: [X meses]
- Trend: [Curva observed]

CÁLCULO DE MoM GROWTH:
- Average MoM: [%]
- Trend: [Acelerando/Linear/Desacelerando]
- Consistency: [Meses em que crescimento positivo] / [Total meses]

BENCHMARK PARA [SETOR]:
- Seed esperado: 15-30% MoM
- Série A esperado: 10-20% MoM
- Série B esperado: 5-15% MoM

COMPARAÇÃO:
Status: [EXCEEDS/MEETS/BELOW]
Assessment: [...]

NOTA: Se crescimento não mostrar, mencione explicitamente.
```

---

### 5. ANALISADOR DE EQUIPE

#### Prompt 5.1: Análise de Fundadores
```
Avalie a equipe fundadora (analise bios/LinkedIn se mencionado):

PARA CADA FUNDADOR:
Nome: [...]
Rol: [CEO/CTO/COO/outro]

Experiência:
1. Domain expertise (relação com o problema)
   - Sim, óbvia ✓
   - Sim, indireta ⚠️
   - Não 🚩

2. Histórico startup
   - Prior exits? (Y/N, qual valuation)
   - Prior founding? (Y/N, qual destino)
   - Track record de execução? (Y/N, exemplos)

3. Relevância da experiência
   - Anterior role: [...]
   - Relação com negócio atual: [Alta/Média/Baixa]

4. Skin in the game
   - Investimento pessoal mencionado? (Y/N)
   - Full-time commitment? (Y/N)

TEAM COMPOSITION:
- Complementaridade entre fundadores: [Alta/Média/Baixa]
- Gaps óbvios: [ex: "Sem CTO em startup tech"]
- Advisory board: [Y/N, influentes?]

OVERALL TEAM SCORE: [_/10]
- 9-10: Domain experts com track record de execução
- 7-8: Domain expertise com alguma startup exp
- 5-6: Smart founders mas novo setor ou primeiras startup
- <5: Sem expertise relevante ou track record fraco
```

---

### 6. SCORING & RELATIVIZAÇÃO

#### Prompt 6.1: Scoring por Categoria
```
Baseado na análise completa, score cada categoria:

[COPY THIS TEMPLATE]

OPORTUNIDADE (20 pts):
- TAM: [_/5] (nota: >$500M validado = 5pts)
- Problem validation: [_/8]
- Solution validation: [_/7]
SUBTOTAL: [_/20]

TRAÇÃO (25 pts):
- Users/Revenue: [_/10] (nota: benchmarks variam por estágio)
- Growth rate: [_/10] (MoM consistent)
- Metrics quality: [_/5]
SUBTOTAL: [_/25]

BUSINESS MODEL (20 pts):
- Economics: [_/8] (Unit economics viável)
- CAC & Payback: [_/7]
- Scalability: [_/5]
SUBTOTAL: [_/20]

EQUIPE (15 pts):
- Expertise: [_/7]
- Complementarity: [_/5]
- Execution: [_/3]
SUBTOTAL: [_/15]

POSICIONAMENTO (10 pts):
- Moat: [_/7]
- vs Competition: [_/3]
SUBTOTAL: [_/10]

FINANCEIRO (10 pts):
- Projections realism: [_/5]
- Ask clarity: [_/5]
SUBTOTAL: [_/10]

APRESENTAÇÃO (5 pts bônus):
- Clarity: [_/3]
- Design: [_/2]
SUBTOTAL: [_/5]

━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: [__/100]
RATING: [95-100: YC-ready | 80-95: Strong | 65-80: Promising | 50-65: Potential | <50: Pass]
```

#### Prompt 6.2: Relativização por Setor
```
O score bruto foi [__/100]. Agora relativize para [SETOR]:

AJUSTES POR SETOR:

[FINTECH]
- Regulatory risk é crítico: desconte -10 pts se não claro
- Growth rate espectativa: 20%+ MoM (aumentar peso se abaixo)
- Team: domain expertise em finança/tech é pesado (+2 pts se evidente)

[HEALTHTECH]
- Clinical validation é não-negociável: desconte -15 pts se não documentado
- FDA/regulatory timeline: adicione 2 anos à projeção
- Provider adoption: tão importante quanto usuários finais
- Team: MDs/PhDs + tech experts aumentam score (+5 pts)

[SAAS]
- Churn <5% é expectativa: desconte -5 pts se >5%
- NRR >100% em série A: score completo se demonstrado
- CAC payback <9 meses: expectativa

[MARKETPLACE]
- Balanceamento supply/demand: crítico (concentration risk)
- Desconte -10 pts se supply/demand muito desbalanceado
- Growth both sides: ambos precisam crescer simultaneamente

ADJUSTED SCORE: [__/100]
ADJUSTED RATING: [...]
KEY CONSIDERATIONS FOR THIS SECTOR: [...]
```

---

### 7. RECOMENDAÇÕES & FEEDBACK

#### Prompt 7.1: Síntese de Pontos Fortes
```
Resuma os TOP 3 PONTOS FORTES deste pitch:

Baseado na análise de [CATEGORIA], os maiores diferenciais são:

1. [FORÇA 1]: [Descrição específica]
   Impacto: [Como isso melhora as chances de sucesso]
   Score contribuído: [_pts]

2. [FORÇA 2]: [Descrição específica]
   Impacto: [...]
   Score contribuído: [_pts]

3. [FORÇA 3]: [Descrição específica]
   Impacto: [...]
   Score contribuído: [_pts]

SÍNTESE: Este pitch é forte em [AREA] principalmente porque [1-2 frases].
```

#### Prompt 7.2: Síntese de Pontos Fracos
```
Resuma os TOP 3 PONTOS FRACOS deste pitch:

1. [FRAQUEZA 1]: [Descrição]
   Risco: [Consequência se não for resolvido]
   Score impactado: [-_pts]
   Ação recomendada: [Como resolver]

2. [FRAQUEZA 2]: [...]
   ...

3. [FRAQUEZA 3]: [...]
   ...

SEVERIDADE:
- [FRAQUEZA 1]: 🚨 CRÍTICA (dealbreaker potencial)
- [FRAQUEZA 2]: ⚠️ SÉRIA (investigação necessária)
- [FRAQUEZA 3]: 📌 ATENÇÃO (monitor mas não fatal)

PRÓXIMOS PASSOS RECOMENDADOS:
1. [...]
2. [...]
3. [...]
```

#### Prompt 7.3: Benchmarking Comparativo
```
Compare este pitch aos benchmarks de [SETOR] em 2025-2026:

MÉTRICA | ESTE PITCH | BENCHMARK [SETOR] | STATUS
─────────────────────────────────────────────────
MoM Growth | [X%] | [Y%] | [ABOVE/MEETS/BELOW]
Churn | [X%] | [Y%] | [...]
LTV:CAC | [X:1] | [Y:1] | [...]
CAC Payback | [X meses] | [Y meses] | [...]
NPS | [X] | [Y] | [...]
Time to Breakeven | [X anos] | [Y anos] | [...]

INTERPRETATION:
- Acima de benchmark em [3] métricas = força competitiva
- Abaixo em [2] = áreas a investigar
- Alinhado com [2] = expectativa normal

POSITIONING: Este pitch está [AHEAD/IN-LINE/BEHIND] vs similar startups.
```

---

### 8. GERADOR DE RELATÓRIO EXECUTIVO

#### Prompt 8.1: Executive Summary
```
Escreva um EXECUTIVE SUMMARY de 1 página (máx 300 palavras):

Estrutura:
1. [Empresa]: [Nome], [setor], [estágio] (1 linha)
2. [Thesis]: 1-2 frases sobre por que este negócio importa
3. [Traction]: 1 frase sobre validação de mercado
4. [Team]: 1 frase sobre equipe
5. [Opportunity]: 1 frase sobre tamanho de mercado
6. [Ask]: [Valor] + [milestones esperados]
7. [Recommendation]: [PASS/INVESTIGATE/STRONG INTEREST/LEADS]

TONE: Profissional, concisos, data-driven.
```

#### Prompt 8.2: Relatório Estruturado (PDF-ready)
```
Gere um relatório estruturado para PDF:

FORMATO:
═══════════════════════════════════════
[COMPANY NAME] - Pitch Deck Analysis
[DATE] | Analyst: [NAME/SYSTEM]
═══════════════════════════════════════

SECTION 1: EXECUTIVE SUMMARY
[1 parágrafo de síntese]

SECTION 2: OVERALL SCORE
Final Score: [__/100]
Rating: [RATING]
[Gráfico de radar: Oportunidade, Tração, Modelo, Equipe, Competição, Financeiro]

SECTION 3: CATEGORY BREAKDOWN
[Tabela com score de cada categoria + explicação de 1-2 frases]

SECTION 4: STRENGTHS (TOP 3)
[3 bullets formatados]

SECTION 5: WEAKNESSES (TOP 3)
[3 bullets formatados]

SECTION 6: SECTOR BENCHMARKING
[Tabela comparativa de 5-6 métricas chaves]

SECTION 7: KEY METRICS AT A GLANCE
[Resumo visual dos números principais]

SECTION 8: INVESTMENT THESIS
[2-3 parágrafos sobre potencial de retorno]

SECTION 9: NEXT STEPS
[3-5 recomendações acionáveis]

SECTION 10: APPENDIX
[Métricas completas, scoring detalhado, metodologia]

FOOTER: [Disclaimer sobre análise automatizada]
```

---

## 🔧 Estratégias de Implementação

### Estratégia 1: Agente Autônomo (Multi-turn)
```
[SYSTEM PROMPT]
Você é um analista especializado em pitch decks de startups.
Objetivo: Avaliar sistematicamente um pitch deck recebido.
Setor: [SETOR] (detectado automaticamente ou definido pelo usuário)
Estágio: [SEED/SÉRIE A/B] (detectado do contexto ou pedido)

FLUXO AUTÔNOMO:

1. RECEPÇÃO
   - Parse do arquivo (PDF/PPT)
   - Detecção de setor
   - Confirmação do estágio

2. EXTRAÇÃO
   - Slides by type (problema, solução, etc)
   - Métricas numéricas
   - Dados de equipe
   - Links/referências

3. ANÁLISE (em paralelo)
   - Oportunidade
   - Tração
   - Modelo
   - Equipe
   - Competição
   - Financeiro
   - Apresentação

4. SCORING
   - Cada categoria
   - Ajuste por setor
   - Score final

5. SÍNTESE
   - Pontos fortes/fracos
   - Recomendações
   - Benchmarking

6. SAÍDA
   - Relatório PDF
   - Chat interativo para Q&A
   - Sugestões de melhorias

[GUARDRAILS]
- Não invente dados não encontrados
- Sempre citar fonte (slide #)
- Explícito quando há gaps
- Recomende investigação, não conclusões finais
- Tone: profissional, helpful, não judicioso
```

### Estratégia 2: Integration com Bubble.io (low-code)
```
FLUXO NO BUBBLE:

1. INPUT FORM
   - File upload (PDF/PPT)
   - Setor (dropdown)
   - Estágio (dropdown)
   - Email para relatório

2. BACKEND WORKFLOW
   - File → Cloud storage (AWS S3)
   - Trigger: API call to [your LLM service]
   - LLM extracts + scores
   - Resultado → Database

3. DISPLAY
   - Loading state (spinner)
   - Score visual (gauge/card)
   - Expandable sections:
     • Category scores
     • Strengths
     • Weaknesses
     • Recommendations

4. EXPORT
   - "Download PDF" button
   - Gera PDF dinâmico com Bubble plugin

5. CHAT
   - "Ask a question" box (bottom)
   - Context-aware Q&A sobre este pitch
```

### Estratégia 3: Feedback Loop (Continuous Improvement)
```
LOOP DE APRENDIZADO:

1. Após análise ser criada
2. Usuário (investor/founder) fornece feedback:
   - "Score muito alto/baixo"
   - "Missed importante métrica: [X]"
   - "Recomendação inútil: [Y]"

3. Feedback → Database
4. Periodicamente (1x semana):
   - Revisar feedback acumulado
   - Ajustar pesos se sistemática
   - Atualizar benchmarks com dados reais
   - Retrair modelo if needed

5. Resultado:
   - Sistema melhora continuamente
   - Calibrado para realidade de mercado
```

### Estratégia 4: Pitch Deck Generator (Reverso)
```
UMA VEZ QUE VOCÊ TEM SISTEMA DE ANÁLISE, PODE REVERTER:

ENTRADA: Descrição textual da startup (ou entrevista)
"Vou criar um pitch deck para [Empresa]. 
Problema: [X]
Solução: [Y]
Tração: [Z]"

PROCESSAMENTO:
1. Parse da descrição
2. Mapeie para estrutura de slides padrão
3. Use seu sistema de scoring INVERSO:
   - "O que um pitch com score 85+ tem?"
   - "Que seção está faltando?"
   - "Que dados deveriam estar neste slide?"

SAÍDA:
- Slide-by-slide recommendations
- Texto sugerido (refineável)
- Gráficos/estruturas (templates Figma)
- "Você score provavelmente seria X se seguir recomendações"

EXECUÇÃO:
- Output em PPTX/Google Slides
- Link para Figma para design
- Iteração com AI chat
```

---

## 🚀 Produtos Potenciais (Monetização)

### Produto 1: Análise Automática (SaaS)
```
PITCH DECK ANALYZER
- Upload deck → Score 0-100
- Relatório PDF
- Chat Q&A
- Benchmarking

Pricing:
- Free: 1 análise/mês
- Pro: $29/mês (unlimited análises + export)
- Enterprise: Custom (API access, white-label)

Público:
- Startups (self-assessment)
- Investidores (portfólio review)
- Aceleradoras (batch evaluation)
```

### Produto 2: Pitch Deck Generator
```
PITCHAI
- Descrição textual → Slide deck completo
- Templates por setor
- Recomendações de melhoria
- Export PPT/PDF/Google Slides

Pricing:
- Free: 1 deck/mês (basic template)
- Pro: $49/mês (all templates, custom colors)
- Pro+: $99/mês (unlimited + AI co-pilot para iterações)

Público:
- Founders (criar decks rapidamente)
- VCs (criar comparative decks)
```

### Produto 3: Feedback Loop para Investidores
```
INVESTOR DASHBOARD
- Suba múltiplos pitch decks
- Dashboard comparativo de scores
- Métricas agregadas (avg score, trends)
- Filtrar por setor, stage, score
- Saved pitches + anotações

Pricing:
- $99-299/mês por VC/fundo
- Based on # de decks analisados

Público:
- VCs
- Angel investors
- Accelerators
```

### Produto 4: Consultoria + Análise
```
PREMIUM SERVICE
- Upload pitch deck
- Análise automática
- 1-hour call com especialista [VOCÊ]
- Recomendações customizadas
- Follow-up em 2 semanas

Pricing:
- $500-1000 por pitch deck review
- Pacotes: 5 decks = $3500 (desconto)

Público:
- Startups antes de rodadas de fundraising
- Aceleradoras (programa)
```

---

## 📊 Métricas de Sucesso

```
PARA VALIDAR QUE SISTEMA FUNCIONA:

1. ACURÁCIA DO SCORING
   - Colete feedback de VCs reais
   - "Como você score este pitch (1-10)?"
   - Compare com seu sistema
   - Target: Correlação >0.7

2. UTILIDADE DAS RECOMENDAÇÕES
   - Usuários implementam feedback? (Y/N)
   - Score melhora após iterar? (avg +10 pts)
   - Feedback citado em conversas com investidores?

3. ADOÇÃO DO PRODUTO
   - # de decks analisados/mês
   - # de usuários ativos
   - % que convertem para premium
   - NPS (Net Promoter Score)

4. METÁFORAS DE NEGÓCIO
   - CAC (cost to acquire user)
   - LTV (lifetime value)
   - Churn rate
   - Expansion revenue (upsell)

TARGET NO ANO 1:
- 1000 decks analisados
- 500 usuários ativos
- $20K MRR
- NPS >40
- Feedback loop calibrado
```

---

## 🎓 Próximos Passos Imediatos

### Para você (VOCÊ):

1. **SEMANA 1-2:**
   - [ ] Escolha 2 setores prioritários (fintech + healthtech OU saas + marketplace)
   - [ ] Faça download de 10 pitch decks reais (Google, AngelList, Crunchbase)
   - [ ] Analise manualmente usando checklists acima
   - [ ] Documente insights

2. **SEMANA 3-4:**
   - [ ] Configure um Bubble.io prototype
   - [ ] Implemente extrator básico (use GPT-4V + pdfplumber)
   - [ ] Teste com 5 decks = valide accuracy

3. **MÊS 2:**
   - [ ] Build scoring engine (7 categorias)
   - [ ] Crie PDF gerador de relatórios
   - [ ] Teste com 20+ decks de dois setores

4. **MÊS 3:**
   - [ ] Launch MVP (análise básica + relatório)
   - [ ] Coleta de feedback via demo com 5-10 VCs
   - [ ] Iterar baseado em feedback

5. **MÊS 4-6:**
   - [ ] Adicione setor #3 e #4
   - [ ] Implemente feedback loop
   - [ ] Começa beta monetizado

---

Boa sorte! Este é um projeto com potencial ALTO para B2B SaaS. O mercado de VC tooling está crescendo rapidamente (AngelList, Crunchbase, PitchBook todas valem $1B+).

O diferencial seu: **IA autônoma que avalia como investor experiente, não como ferramenta genérica**.

Força! 🚀