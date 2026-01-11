# Análise de Pitch Decks com IA Autônoma
## Guia Completo para Criar Ferramentas de Avaliação e Preparação para Investimento

---

## 📋 Índice
1. [Fundamentos de Pitch Deck](#fundamentos)
2. [Framework Completo de Análise](#framework)
3. [Métricas por Setor](#métricas-setor)
4. [Sistema de Scoring Automatizado](#scoring)
5. [Arquitetura da Solução com IA](#arquitetura-ia)
6. [Checklist de Avaliação](#checklist)

---

## 🎯 Fundamentos de Pitch Deck {#fundamentos}

### O que é Pitch Deck?
Uma apresentação visual concisa (10-20 slides) que comunica a oportunidade de negócio, potencial de crescimento e por que investidores devem financiar a startup.

### Estatísticas Importantes (2025-2026):
- **$145 bilhões** em investimento seed-to-growth (US/Canada, 1H 2025)
- **3-5 minutos** tempo médio de análise por investidor
- **10-20 slides** número ideal
- **85%** de investidores de healthtech exigem validação clínica antes Series A
- **73%** de fracassos em healthtech = adoção fraca de providers

### Objetivo Tríplice:
1. **Captar atenção** → Problema/Solução clara
2. **Validar oportunidade** → Dados, tração, mercado
3. **Gerar confiança** → Equipe, execução, financeiro

---

## 🔍 Framework Completo de Análise {#framework}

### Estrutura dos 10-20 Slides Padrão

#### **Slide 1: Cover / Título**
```
Elementos:
- Logo da empresa
- Tagline/proposição de valor
- Nomes dos fundadores
- Data de criação

Critérios de Avaliação:
✓ Memória visual imediata
✓ Profissionalismo estético
✓ Clareza do posicionamento (em 1 frase)
```

#### **Slide 2: Problema**
```
Elementos essenciais:
- Definição clara do problema
- Tamanho do problema (% da população afetada)
- Dor dos clientes (específica, não genérica)
- Por que ninguém resolveu ainda

Boas práticas:
- Usar dados de pesquisa (não achismo)
- Conectar com empatia
- Evitar problema muito amplo

Exemplos por setor:
FINTECH: Fricção no acesso a crédito (x% dos brasileiros sem acesso)
HEALTHTECH: Diagnóstico tardio aumenta mortalidade em x%
SAAS: Empresas perdem $X em produtividade sem ferramenta
MARKETPLACE: Ineficiência no matching custo $X por transação
```

#### **Slide 3: Solução**
```
Elementos:
- Apresentação do produto/serviço
- Como resolve o problema específico
- Diferencial (ou "magic" tech)
- Evidência de MVP/Proof of Concept

Critérios:
✓ Simplicidade na explicação (5 frases máx)
✓ Benefício claro (não features)
✓ Validação de que funciona

Dados importantes:
- Prototipagem: fase (idea/MVP/beta/live)
- Validação: testes com usuários (qty/feedback)
- IP/Moat: proteção tecnológica
```

#### **Slide 4: Oportunidade de Mercado (TAM/SAM/SOM)**
```
Conceitos críticos:

TAM (Total Addressable Market):
- Mercado global potencial
- Cálculo: Bottom-up (custo unitário × qty) ou Top-down (% da indústria)
- Exemplo SAAS: $1B mercado de gestão de projetos

SAM (Serviceable Addressable Market):
- Mercado que você pode alcançar
- Segmentação geográfica/demográfica
- Exemplo: $100M em empresas tech de 10-500 pessoas no Brasil

SOM (Serviceable Obtainable Market):
- Meta realista em 3-5 anos
- Exemplo: $5M de ARR em Year 5

Red Flags:
❌ TAM < $100M
❌ Números irreais (sem fonte)
❌ Sem segmentação clara
✓ Top-down + Bottom-up validation

Fórmulas práticas:
TAM = Preço médio × Clientes potenciais (total)
SAM = TAM × % do mercado focado × % penetração
SOM = SAM × % que você pode capturar em 5 anos
```

#### **Slide 5: Modelo de Negócio**
```
Componentes:
1. Revenue Model
   - Como ganha dinheiro (subscription/transacional/hybrid)
   - Pricing strategy (por usuário/por volume/valor)
   - ARPU (Average Revenue Per User)

2. Customer Acquisition
   - CAC (Customer Acquisition Cost)
   - Tempo para ROI (payback period)
   - Canais de aquisição

3. Retention & Growth
   - Churn rate (aceitável: <5% para SaaS)
   - LTV (Lifetime Value)
   - LTV:CAC ratio (ideal >3:1)

Exemplos por modelo:
SUBSCRIPTION: $99/mês/user, CAC $500, payback 5 meses
TRANSACIONAL: 2% de comissão, CAC $10, payback imediato
FREEMIUM: Conversão 2%, ARPU $50/month

Veja Slide 7 para projeções financeiras
```

#### **Slide 6: Tração & Métricas**
```
Definição: Prova REAL de que existe demanda

Métricas por estágio:

SEED/PRE-SEED (Idea → MVP):
- Waiting list: N usuários
- Pre-sales: $ comprometidos
- User interviews: N validações
- Media coverage
- Pitch mentions/awards

SÉRIE A (MVP → Produto):
- MAU/DAU (Monthly/Daily Active Users)
- Revenue: MRR, ARR
- Growth rate: MoM (Month-over-Month)
- Churn rate
- NPS (Net Promoter Score) > 30

SÉRIE B+ (Scale):
- CAC payback < 12 meses
- Negative churn (upsell supera saída)
- Gross/Net margin trajectory
- Enterprise logos/logos count

RED FLAGS:
❌ Nenhuma métrica de tração
❌ Métricas infladas (usuários únicos vs ativos)
❌ Sem benchmark de indústria
```

#### **Slide 7: Projeções Financeiras (3-5 anos)**
```
Elementos obrigatórios:

1. Revenue Projections
   - MRR projection (crescimento mês a mês)
   - ARR projection (crescimento anual)
   - Growth rate (%) - deve declinar progressivamente

2. Unit Economics
   - Gross Margin %
   - Burn rate (com e sem receita)
   - Runway (meses até capital zero)
   - Break-even timeline

3. Financeiro Consolidado
   - P&L simplificado (Revenue - COGS - Opex = Profit)
   - Cash flow projeção
   - Valuation method (revenue multiple, discounted cash flow)

Validações importantes:
✓ Crescimento realista (30-100% YoY para SaaS)
✓ Margins alinhadas com setor
✓ Spending coerente com growth
✓ Breakeven em horizonte viável

RED FLAGS:
❌ 10x growth/ano todo (irrealista)
❌ Sem detalhe de premissas
❌ Margin impossível para o setor
❌ Sem plano de burn ou runway
```

#### **Slide 8: Competição & Posicionamento**
```
Estrutura:

1. Análise Competitiva (Quadrante)
   - Eixo X: Feature/Price
   - Eixo Y: Ease of Use/Support
   - Seu posicionamento: Diferencial claro

2. Competitive Landscape
   - Diretos (mesmo problema, tech similar)
   - Indiretos (solução alternativa)
   - Substitutos (fazer nada)

3. Seu Moat/Defensibilidade
   - Network effects
   - Data advantage
   - IP/Patents
   - Brand
   - Switching costs

Exemplo FINTECH:
Diretos: Nubank, Inter, Bradesco
Indiretos: Fintech de crédito, fintechs globais
Moat: Base de dados de comportamento único, rede de microempreendedores

RED FLAGS:
❌ "Sem competidores"
❌ Ignorar competidores maiores
❌ Moat fraco ou indefinido
❌ Cópia evidente de competidor
```

#### **Slide 9: Equipe**
```
Componentes por fundador:

1. Experiência Relevante
   - Anterior C-level experience
   - Domain expertise
   - Relevant network

2. Complementaridade
   - CEO: Visão, fundraising, execução
   - CTO/Tech: Produto, arquitetura
   - COO/Ops: Go-to-market, sales

3. Histórico de Sucesso
   - Startups anteriores (exits?)
   - Crescimento de empresas
   - Fundação de times

Critérios:
✓ Domain expertise óbvio
✓ Execução comprovada
✓ Roles claros
✓ Advisory board forte (opcional mas ajuda)

RED FLAGS:
❌ Apenas amigos/sócios
❌ Sem expertise no mercado
❌ Não têm skin in the game
❌ Histórico de fracassos não explicado

Dica: Incluir fotos (humaniza) + LinkedIn profiles
```

#### **Slide 10: Go-to-Market / Estratégia de Crescimento**
```
Elementos:

1. Target Customer Profile (ICP)
   - Demográfico/comportamental preciso
   - Tamanho do segmento
   - Willingness to pay

2. Distribution Strategy
   - Direct sales
   - Self-serve/product-led
   - Partnerships
   - Marketplaces

3. Marketing & Channels
   - Primary channel (foco)
   - Secondary channels
   - CAC por canal
   - Milestones de crescimento (Q1-Q2-Q3-Q4)

4. Partnerships estratégicas
   - Integrações
   - Co-marketing
   - White-label

Exemplo SaaS B2B:
ICP: Agências de 20-100 pessoas, revenue $1-5M
Channel: Direct sales + inbound (content)
CAC target: $500, payback 5 meses
Year 1: 10 clientes, Year 2: 50, Year 3: 200

RED FLAGS:
❌ Sem ICP claro
❌ "Vender para todos"
❌ Múltiplos canais sem foco
❌ CAC não viável
```

#### **Slide 11: O Pedido de Investimento (The Ask)**
```
Elementos obrigatórios:

1. Funding Amount
   - Valor específico (não "até $X")
   - Moeda (real/dólar)
   - Tipo (equity/SAFE/convertível)

2. Uso de Fundos (detalhado)
   - Product/R&D: X%
   - Sales & Marketing: Y%
   - Team/Hiring: Z%
   - Working capital: W%

3. Milestones esperados
   - Year 1 com esse capital:
     - MRR target
     - Clientes target
     - Releases/features
     - Team size

Exemplo:
"Procuramos $500K em SAFE (convertível)
- Product: 40% ($200K)
- Sales/Marketing: 35% ($175K)
- Team: 20% ($100K)
- Runway: 18 meses

Year 1 targets:
- MRR: $50K
- Clientes: 30
- Team: 8 pessoas"

NUNCA:
❌ "Procuramos investimento" (vago)
❌ Sem detalhe de uso
❌ Sem milestones
```

#### **Slides 12+: Apêndice (conforme necessário)**

```
Potencial conteúdo adicional:

- Modelo de dados detalhado
- Arquitetura técnica (se produto tech-heavy)
- Detalhes financeiros completos
- Testimoniais de usuários
- Press mentions
- Case studies
- Roadmap técnico
- Legal/Regulatory status
- Estrutura de cap table
```

---

## 📊 Métricas por Setor {#métricas-setor}

### 1. FINTECH
```
Métricas críticas:

Tração:
- Número de contas abertas / clientes ativos
- Volume de transações ($)
- GMV (Gross Merchandise Value)
- Taxa de reativação de usuários
- NPS de satisfação

Financeiro:
- CAC (Customer Acquisition Cost)
- LTV (Customer Lifetime Value)
- Spread/Margem por transação
- Churn (taxa de abandono conta)
- ARU (Average Revenue per User)

Conformidade:
- Status regulatório (aprovações)
- Compliance status
- Riscos legais

Benchmarks 2025-2026:
- MRR growth: 10-15% ao mês (seed)
- Churn: <5% ao mês
- CAC payback: < 6 meses
- NPS: >40

Estrutura do Slide de Tração:
- Gráfico: Contas criadas (exponencial ou linear)
- Gráfico: GMV mensal
- Métrica: NPS + testimoniais
- Métrica: Churn e reativação
```

### 2. HEALTHTECH
```
Métricas CRÍTICAS (4 pilares):

1. VALIDAÇÃO CLÍNICA (essencial)
   - Publicações peer-reviewed
   - Ensaios clínicos (N-size, p-value)
   - Melhoria em outcomes (% redução readmissões)
   - Dados de segurança (sem adverse events)
   - Endorsements de KOLs

2. ADOÇÃO DE PROVIDERS
   - DAU/MAU entre healthcareworkers
   - Workflow integration time (dias)
   - NPS clínico (diferente de NPS geral)
   - Retention rate (6-12 meses)
   - Feature adoption rate
   - Support tickets por provider

3. MILESTONES REGULATÓRIOS
   - Status FDA (aprovação esperada?)
   - Certificações (ISO, HIPAA, LGPD)
   - Timeline: 18-24 meses para 510(k)
   - Custos estimados: $2.8M média

4. TRAÇÃO COM PAYERS
   - Negociações de cobertura (status)
   - Códigos de reembolso
   - Health economics validation
   - Cost savings demonstrados

Benchmarks:
- Taxa de adoção provider: >60% once exposed
- NPS clínico: >50
- Churn provider: <10% ao ano
- Custo salvo por paciente: >$2.8M requisito payer

Red Flags:
❌ Sem evidência clínica
❌ Sem validação com providers
❌ Sem roadmap regulatório
❌ Promessas clínicas sem dados

Estrutura do Slide de Tração:
- Validação clínica: Publicação ou trial status
- Provider adoption: # de clínicos, feedback
- Regulatório: Timeline FDA/cert
- Payer: Negociações em andamento
```

### 3. SaaS B2B
```
Métricas padrão:

Tração:
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- MoM Growth Rate (% crescimento mensal)
- Número de clientes
- ACV (Annual Contract Value)
- CAC (Customer Acquisition Cost)
- Churn Rate (mensal, <5% ideal)
- NRR (Net Revenue Retention - com upsell)

Unit Economics:
- LTV/CAC ratio (>3:1)
- CAC payback period (<12 meses)
- Gross Margin (>60% para SaaS)
- Magic Number (ARR growth / S&M spend)

Validação:
- Número de logos (clientes)
- Expansion revenue ($)
- Net revenue retention (>100% ideal)
- Cohort retention (qual % volta no mês 2-12)

Benchmarks 2025-2026:
- MRR growth: 5-15% ao mês (série A)
- CAC payback: 6-9 meses
- Churn: 2-5% ao mês
- NRR: >110% (série A+)
- Magic Number: >0.75

Estrutura do Slide de Tração:
```
MRR Growth: [Gráfico exponencial]
ARR: $XXK (com projeção)
Principais KPIs em cards:
- Clientes: N
- CAC: $X
- LTV: $X
- Churn: X%
- NRR: X%
```

### 4. MARKETPLACE
```
Métricas críticas:

Demanda de Supply (dois lados):
- Número de sellers/suppliers ativos
- Número de buyers ativos
- Taxa de matching quality

Tração Financeira:
- GMV (Gross Merchandise Value)
- GTV (Gross Transaction Value)
- CAC (Caro no 2-sided)
- Comissão média (%)
- Take rate (% que fica com plataforma)

Engajamento:
- Transactions per user
- Repeat purchase rate
- Conversion rate (buyers)
- NPS (ambos os lados)

Eficiência:
- CAC por lado (buy + sell)
- LTV (lifetime value)
- Unit economics por transação

Balanceamento:
- Razão supply/demand (viável?)
- Concentration risk (top 10% de sellers = X% do GMV?)

Benchmarks:
- Repeat rate: >40% (2nd transaction)
- CAC payback: 8-12 meses
- Take rate: 15-25% (variável)
- Unit economics: Positiva rapidamente

Red Flags:
❌ Supply/demand desequilibrado
❌ High concentration (1-2 sellers dominam)
❌ CAC insustentável
❌ Sem cheques de fraude

Estrutura do Slide:
- GMV crescimento: [Gráfico]
- Razão supply/demand: [Proporção]
- Top KPIs: Transações/mês, Repeat rate, NPS
```

### 5. MARKETPLACE / E-COMMERCE
```
Métricas específicas:

Customer:
- CAC (Customer Acquisition Cost)
- LTV (Customer Lifetime Value)
- Repeat rate (%)
- AOV (Average Order Value)
- Conversion rate (visitor → buyer)

Produto/Inventory:
- Inventory turnover
- ROAS (Return on Ad Spend)
- Margin após COGS + logistics
- Return/Chargeback rate

Operacional:
- Fulfillment cost (%)
- Logistics efficiency
- Time to first delivery

Benchmarks:
- CAC payback: <6 meses
- Repeat rate: >50% retail
- Gross margin: 30-50% (varejo)
- AOV: produto-específico

```

---

## 🤖 Sistema de Scoring Automatizado {#scoring}

### Estrutura de Avaliação (100 pontos)

```
CATEGORIA 1: OPORTUNIDADE (20 pontos)
├─ Tamanho de mercado (TAM) [5]
│  5 pts: TAM > $500M + validação bottom-up
│  3 pts: TAM > $100M
│  0 pts: TAM < $100M ou sem validação
│
├─ Evidência do problema [8]
│  8 pts: Dados quantificados + pesquisa usuários
│  5 pts: Problema claro com alguns dados
│  2 pts: Problema descritivo
│  0 pts: Problema vago ou irrelevante
│
└─ Validação de solução [7]
   7 pts: MVP testado com usuários, feedback positivo
   5 pts: Protótipo funcional, primeiras conversões
   2 pts: Protótipo em fase conceitual
   0 pts: Só ideia


CATEGORIA 2: TRAÇÃO & VALIDAÇÃO (25 pontos)
├─ Usuários/Clientes [10]
│  10 pts: >100 clientes pagando ou >10k usuários ativos
│  7 pts: 10-100 clientes ou 1k-10k users
│  4 pts: <10 clientes ou early pilots
│  0 pts: Nenhum
│
├─ Crescimento (MoM) [10]
│  10 pts: >20% MoM consistente
│  7 pts: 10-20% MoM
│  4 pts: 1-10% MoM
│  0 pts: Sem crescimento ou decline
│
└─ Métricas de qualidade [5]
   5 pts: Churn <5%, NPS >40, LTV:CAC >3:1
   3 pts: Churn <10%, NPS >30, LTV:CAC >2:1
   0 pts: Métricas fracas ou ausentes


CATEGORIA 3: MODELO DE NEGÓCIO (20 pontos)
├─ Viabilidade econômica [8]
│  8 pts: Unit economics positivas, margin >50%
│  5 pts: Path claro para profitabilidade
│  2 pts: Viabilidade incerta
│  0 pts: Modelo insustentável
│
├─ CAC & Payback [7]
│  7 pts: CAC < $500, payback < 6 meses
│  5 pts: CAC viável, payback < 12 meses
│  2 pts: CAC alto, payback > 12 meses
│  0 pts: CAC insustentável
│
└─ Escalabilidade [5]
   5 pts: Modelo escala sem custo marginal alto
   3 pts: Escalável com investimento
   0 pts: Hard to scale


CATEGORIA 4: EQUIPE (15 pontos)
├─ Experiência relevante [7]
│  7 pts: CEO/founder domain expert, anterior exit
│  5 pts: Experiência em startup ou setor
│  2 pts: Experiência genérica
│  0 pts: Sem experiência relevante
│
├─ Complementaridade [5]
│  5 pts: Roles claros, habilidades complementárias
│  3 pts: Times parcialmente montado
│  0 pts: Apenas 1 fundador ou roles indefinidos
│
└─ Execução history [3]
   3 pts: Antecedentes de execução rápida/iterativa
   1 pt: Normal
   0 pts: Parado/sem momentum


CATEGORIA 5: POSICIONAMENTO COMPETITIVO (10 pontos)
├─ Moat/Defensibilidade [7]
│  7 pts: Moat claro (network, dados, IP, brand)
│  4 pts: Alguns fatores defensivos
│  0 pts: Nenhum moat óbvio
│
└─ Posicionamento vs concorrentes [3]
   3 pts: Diferencial claro vs diretos
   1 pt: Posicionamento ok
   0 pts: Cópia ou indefinido


CATEGORIA 6: FINANCEIRO & FUNDRAISING (10 pontos)
├─ Projeções realistas [5]
│  5 pts: Projeções 30-100% YoY, margens realistas
│  3 pts: Projeções otimistas mas possíveis
│  0 pts: Projeções irrealistas (10x+ growth)
│
└─ Clarity do ask [5]
   5 pts: Valor claro, uso detalha, milestones específicos
   3 pts: Ask razoável, mas vago em milestones
   0 pts: Vago ou pedido genérico


CATEGORIA 7: APRESENTAÇÃO & STORYTELLING (BÔNUS 5 pontos)
├─ Clareza [3]
│  3 pts: Mensagem clara, sem jargão, fluxo lógico
│  1 pt: Razoavelmente claro
│  0 pts: Confuso
│
└─ Visual design [2]
   2 pts: Profissional, coerente, impactante
   1 pt: Aceitável
   0 pts: Amador


SCORING FINAL:
────────────────────────────
95-100: Invista (YC-ready)
80-95:  Forte interesse (com conversas)
65-80:  Promissor (acompanhar)
50-65:  Potencial (precisa validar)
<50:    Passe (low priority)
────────────────────────────
```

---

## 🧠 Arquitetura da Solução com IA {#arquitetura-ia}

### Visão Geral do Sistema

```
                    ┌─────────────────────────────┐
                    │   ENTRADA: Pitch Deck       │
                    │   (PDF/PPT/URL)             │
                    └────────────┬────────────────┘
                                 │
                    ┌────────────▼────────────────┐
                    │  EXTRATOR DE CONTEÚDO      │
                    │  (OCR + LLM)                │
                    │  Extrai: Texto, imagens,   │
                    │  tabelas, estrutura slides │
                    └────────────┬────────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
    ┌─────────▼────────┐ ┌──────▼────────┐ ┌──────▼────────┐
    │  ANALISADOR      │ │  EXTRATOR DE  │ │  CLASSIFICADOR │
    │  ESTRUTURAL      │ │  MÉTRICAS     │ │  DE SETOR      │
    │                  │ │                │ │                │
    │ - Slides presentes│ │ - Valores      │ │ - Fintech      │
    │ - Gaps           │ │ - KPIs         │ │ - Healthtech   │
    │ - Sequência      │ │ - Tendências   │ │ - SaaS         │
    │ - Visual quality │ │ - Benchmarks   │ │ - Marketplace  │
    └────────┬─────────┘ └────────┬──────┘ └────────┬───────┘
             │                    │                  │
             └────────────────────┼──────────────────┘
                                  │
                   ┌──────────────▼───────────────┐
                   │  MECANISMO DE SCORING        │
                   │  (Modelo + Regras)           │
                   │  - 7 categorias              │
                   │  - Pesos por setor           │
                   │  - Scoring 0-100             │
                   └──────────────┬────────────────┘
                                  │
                   ┌──────────────▼───────────────┐
                   │  GERAÇÃO DE RELATÓRIO        │
                   │                              │
                   │ - Score geral + breakdown    │
                   │ - Pontos fortes              │
                   │ - Pontos fracos              │
                   │ - Recomendações             │
                   │ - Benchmarks do setor        │
                   │ - Próximos passos            │
                   └──────────────┬────────────────┘
                                  │
              ┌───────────────────┼────────────────┐
              │                   │                │
    ┌─────────▼──────────┐ ┌──────▼───────┐ ┌────▼────────┐
    │  RELATÓRIO PDF     │ │  FEEDBACK    │ │  SUGESTÕES  │
    │  Executivo         │ │  Interativo  │ │  DE MELHORIA│
    │                    │ │  (Chat)      │ │             │
    │ 15-20 páginas      │ │  - Q&A       │ │ - Rewrite   │
    │ - Dashboard visual │ │  - Deep dive │ │  slides     │
    │ - Análises         │ │  - Contexto  │ │ - Add dados │
    │ - Comparativas     │ │              │ │ - Reposit   │
    └────────────────────┘ └──────────────┘ └─────────────┘
```

### Componentes Detalhados

#### 1. EXTRATOR DE CONTEÚDO (Parser)
```python
# Pseudocódigo
class PitchDeckExtractor:
    def __init__(self, file_path):
        self.file = file_path
        self.content = {}
    
    def extract(self):
        # PDFs, PPT, URLs
        raw_content = self.read_file()
        
        # Estrutura de slides
        slides = self.parse_slides()
        
        # OCR + Vision para extrair texto
        text_content = self.ocr_slides(slides)
        
        # Análise de imagens/gráficos
        charts = self.detect_charts(slides)
        tables = self.detect_tables(slides)
        
        # Estruturação de dados
        return {
            "total_slides": len(slides),
            "slide_sequence": [...],
            "text_by_slide": [...],
            "charts": [...],
            "tables": [...],
            "images": [...]
        }

Tecnologias:
- Multimodal LLM (Claude 3.5, GPT-4V)
- PDF libraries: pdfplumber, pypdf
- PPT libraries: python-pptx
- OCR: pytesseract, EasyOCR
```

#### 2. ANALISADOR ESTRUTURAL
```python
class StructuralAnalyzer:
    def analyze(self, extracted_content):
        return {
            "slides_found": {
                "cover": bool,
                "problem": bool,
                "solution": bool,
                "market": bool,
                "traction": bool,
                "financials": bool,
                "team": bool,
                "competition": bool,
                "ask": bool,
                "others": count
            },
            "gaps": [
                "Missing: Clinical validation (healthtech)",
                "Missing: Detailed financials",
            ],
            "flow_assessment": "logical / needs_improvement",
            "visual_quality": "score 1-10",
            "narrative_coherence": "score 1-10"
        }
```

#### 3. EXTRATOR DE MÉTRICAS (Smart)
```python
class MetricsExtractor:
    def __init__(self, sector: str):
        self.sector = sector  # fintech, healthtech, saas, marketplace
        self.metrics_template = SECTOR_METRICS[sector]
    
    def extract_metrics(self, text_content):
        # LLM identifica valores-chave
        metrics = {}
        
        for metric_name, patterns in self.metrics_template.items():
            # Busca padrões (regex + semantic search)
            value = self.find_metric_value(text_content, patterns)
            metrics[metric_name] = {
                "value": value,
                "confidence": 0.0-1.0,
                "source_slide": N
            }
        
        return metrics
    
    # Exemplos por setor
    # FINTECH: GMV, CAC, churn, NPS
    # HEALTHTECH: Clinical trials, provider adoption, FDA status
    # SAAS: MRR, ARR, churn, LTV/CAC
```

#### 4. SCORING ENGINE
```python
class ScoringEngine:
    def __init__(self, sector: str):
        self.sector = sector
        self.weights = SECTOR_WEIGHTS[sector]
    
    def calculate_score(self, metrics, analysis):
        scores = {}
        
        # 1. Oportunidade (20 pts)
        scores["opportunity"] = self.score_opportunity(
            metrics["tam"],
            metrics["problem_validation"],
            metrics["solution_validation"]
        )
        
        # 2. Tração (25 pts)
        scores["traction"] = self.score_traction(
            metrics["users"],
            metrics["growth_rate"],
            metrics["quality_metrics"]
        )
        
        # 3. Modelo de negócio (20 pts)
        scores["business_model"] = self.score_business_model(
            metrics["unit_economics"],
            metrics["cac"],
            metrics["scalability"]
        )
        
        # 4. Equipe (15 pts)
        scores["team"] = self.score_team(
            metrics["founder_experience"],
            metrics["complementarity"],
            metrics["execution_history"]
        )
        
        # 5. Competição (10 pts)
        scores["competition"] = self.score_competition(
            metrics["moat"],
            metrics["positioning"]
        )
        
        # 6. Financeiro (10 pts)
        scores["financial"] = self.score_financial(
            metrics["projections"],
            metrics["ask_clarity"]
        )
        
        # Score final ponderado
        final_score = sum(
            scores[cat] * self.weights[cat]
            for cat in scores
        ) / 100
        
        return {
            "category_scores": scores,
            "final_score": final_score,
            "rating": self.rating_from_score(final_score)
        }
```

#### 5. GERADOR DE RELATÓRIO
```python
class ReportGenerator:
    def generate_report(self, analysis_results):
        report = {
            "executive_summary": "...",
            "overall_score": "85/100",
            "rating": "STRONG INTEREST",
            
            "sections": {
                "1_opportunity": {...},
                "2_traction": {...},
                "3_business_model": {...},
                "4_team": {...},
                "5_competition": {...},
                "6_financial": {...},
                "7_presentation": {...}
            },
            
            "strengths": [
                "Strong TAM ($1B+)",
                "Proven team (2x exits)",
                "Clear moat (proprietary data)"
            ],
            
            "weaknesses": [
                "Low provider adoption",
                "High CAC ($2000)",
                "Weak financial projections"
            ],
            
            "recommendations": [
                "Validate clinical efficacy in Q2",
                "Reduce CAC by 30% via partnerships",
                "Update financial model with 3-year detail"
            ],
            
            "benchmarks": {
                "your_churn": "8%",
                "industry_avg": "5%",
                "status": "⚠️  Above average"
            },
            
            "next_steps": [
                "Schedule follow-up call",
                "Request detailed financials",
                "Meet the team"
            ]
        }
        
        return report.to_pdf()
```

---

## ✅ Checklist Completo de Avaliação {#checklist}

### PRÉ-ANÁLISE (Preparação)
```
□ Arquivo recebido e legível
□ Definir setor (fintech/healthtech/saas/marketplace)
□ Notar funding round alvo (seed/A/B)
□ Revisar contexto (pitch deck ou completo?)
□ Ter à mão benchmarks do setor
```

### ESTRUTURA DO PITCH
```
COBERTURA DE SLIDES:
□ Cover/Título (introdução)
□ Problema (definido, quantificado)
□ Solução (clara, validada)
□ Oportunidade (TAM/SAM/SOM)
□ Modelo de negócio (receita, CAC, viabilidade)
□ Tração (usuários, métricas, crescimento)
□ Financeiro (projeções, burn, runway)
□ Competição (moat, posicionamento)
□ Equipe (experiência, roles)
□ Go-to-market (ICP, canais, milestones)
□ Ask (valor, uso, milestones)

QUALIDADE DA NARRATIVA:
□ Fluxo lógico slide-a-slide
□ Coerência com público (investor-ready)
□ Storytelling (emocional + racional)
□ Calls-to-action claros
□ Sem slides redundantes
```

### OPORTUNIDADE
```
TAM:
□ Valor quantificado (>$100M ideal)
□ Cálculo bottom-up OU top-down
□ Fonte de dados citada
□ Realista para escopo da empresa

PROBLEMA:
□ Problema específico (não genérico)
□ Dados que validam existência
□ Tamanho da audiência afetada
□ Por que não foi resolvido
□ Conexão com solução clara

SOLUÇÃO:
□ MVP funcional ou protótipo
□ Testado com usuários reais
□ Feedback positivo documentado
□ Tech stack apropriado
□ Viabilidade técnica clara
```

### TRAÇÃO
```
ESTÁGIO SEED/PRÉ-SEED:
□ Waiting list / pré-vendas
□ User interviews (N>20)
□ Prototipagem feedback
□ Media mentions / awards
□ Founders conectados

ESTÁGIO SÉRIE A:
□ >10 clientes pagando OU >1000 users ativos
□ MoM growth 5%+ (consistente)
□ Churn <10%
□ NPS >30
□ Retenção mês 2+

ESTÁGIO SÉRIE B+:
□ >50 clientes, >$50K MRR
□ MoM growth 10%+
□ Churn <5%
□ NPS >40
□ Negative churn (upsell)
□ Enterprise logos
```

### MODELO DE NEGÓCIO
```
RECEITA:
□ Revenue model claro (SaaS/transação/hybrid)
□ Pricing strategy definida
□ ARPU ou ACV quantificado
□ Preço validado com clientes

UNIT ECONOMICS:
□ CAC calculado e realista
□ LTV estimado
□ LTV/CAC >1.5 (mínimo)
□ Payback < 12-18 meses
□ Gross margin >40%

ESCALABILIDADE:
□ Modelo não depende de 1-2 clientes
□ Escalável sem custo marginal exponencial
□ Canais de aquisição múltiplos
□ Viabilidade para 10x crescimento
```

### EQUIPE
```
FUNDADORES:
□ Domain expert evidente
□ Anterior experiência startup (seeds/growth)
□ Roles complementares
□ Skin in the game (investimento pessoal)
□ Histórico de execução rápida

CONSTRUÇÃO DE TIMES:
□ Equipe técnica ou plan de hire
□ Hiring strategy clara
□ Salários/equity competitivos
□ Advisory board (opcional, mais é bom)
□ Capacidade de escalar 2-3x em 1 ano
```

### COMPETIÇÃO & MOAT
```
ANÁLISE COMPETITIVA:
□ Competidores diretos identificados
□ Competidores indiretos listados
□ Seu posicionamento vs cada um
□ Diferencial claro (não é "melhor UI")
□ Histórico de competidores

DEFENSIBILIDADE:
□ Moat identificado (network, data, IP, brand, switching)
□ Moat é real ou futuro?
□ Tempo até clone: semanas/meses/anos?
□ Investimento de competidor grande = risco?
```

### FINANCEIRO
```
PROJEÇÕES (3-5 ANOS):
□ Crescimento 30-100% ao ano (realista)
□ Detalhe de premissas de crescimento
□ Margins alinhadas com setor
□ Breakeven projetado (timeline)
□ Profitability path claro

BURN & RUNWAY:
□ Burn rate mensal definido
□ Runway atual (meses)
□ Burn melhorando com receita?
□ Cash needs próximos 18-24 meses

THE ASK:
□ Valor específico ($X)
□ Tipo de instrumento (SAFE/equity/debt)
□ Uso detalhado dos fundos (%)
□ Milestones com esse capital
□ Expectativa de ROI
```

### VALIDAÇÃO ESPECÍFICA POR SETOR
```
FINTECH:
□ Estratégia de compliance clara
□ Approvals regulatórios (status)
□ Segurança de dados (protocols)
□ Transação smoothness (99.9% uptime)
□ Chargeback/fraude rates baixos

HEALTHTECH:
□ Validação clínica OU path claro
□ Aprovação regulatória (FDA/local)
□ Provider adoption >50%
□ Patient outcomes quantificados
□ Payer engagement / reimbursement strategy

SAAS:
□ Customer retention >90% (mês 12)
□ NRR >110% (Series A+)
□ CAC payback <9 meses
□ Negative churn (upsell maturity)
□ Sales efficiency improving

MARKETPLACE:
□ Supply/demand balanceado
□ Concentration risk <30% top 3 sellers
□ Quality control mecanismo
□ Repeat purchase >40%
□ Growth both sides
```

### APRESENTAÇÃO & DESIGN
```
VISUAL:
□ Designs profissional (não DIY appearance)
□ Paleta consistente
□ Tipografia legível
□ Gráficos/charts com ótima qualidade
□ Sem slides poluídas

CONTEÚDO:
□ Sem jargão desnecessário
□ Dados citados (fontes verificáveis)
□ Mensagens-chave por slide (<5)
□ Calls-to-action claros
□ Apêndice para detalhes

DURAÇÃO:
□ 10-20 slides (ideal)
□ 3-5 minutos pitch rápido
□ 15-20 minutos pitch completo
```

### RED FLAGS (Dealbreakers potenciais)
```
❌ CRÍTICAS (Passe):
□ Sem TAM claro ou TAM <$100M
□ Nenhuma tração (seed/pré-seed) sem justificação
□ Modelo de negócio insustentável
□ Fundadores sem domain expertise
□ Sem diferencial competitivo
□ Projeções delirantes (10x+ YoY)
□ Pedir $X sem saber como gastar

❌ SÉRIAS (Investigar):
□ Métricas abaixo de benchmark mas com plano
□ CAC payback >18 meses
□ High churn sem explicação
□ Competição muito forte mas moat claro
□ Equipe incompleta mas hiring plan sólido
□ Regulatory risk sem estratégia

⚠️  ATENÇÃO (Monitor):
□ Crescimento desacelerando
□ Burn rate muito alta
□ Market saturation risk
□ Dependência de 1-2 clientes
□ Founders novatos (primeira empresa)
```

---

## 🚀 Implantação da Solução

### MVP (Mínimo Viável Produto)
```
Fase 1: Automatização Básica
┌─────────────────────────────────────┐
│ 1. Upload de Pitch Deck              │
│ 2. Extração automática (LLM)         │
│ 3. Checklist básico (30 itens)       │
│ 4. Score simples (estrutura)         │
│ 5. Relatório 1-page com findings     │
│ 6. Chat de Q&A (Claude/GPT)          │
└─────────────────────────────────────┘

Tech Stack:
- Next.js/React (frontend)
- Node.js/FastAPI (backend)
- Claude API / GPT-4V (LLM)
- pdfplumber + pytesseract (parsing)
- Vercel/AWS (hosting)
```

### Roadmap 12 meses
```
MESES 1-2 (MVP):
- Extrator básico
- Scoring estrutural
- Relatório 1-page
- Chat interativo

MESES 3-4 (V1.0):
- Métrica extrator inteligente
- Scoring por setor
- Relatório 15-page
- Comparativo com benchmarks

MESES 5-6 (V1.5):
- Suggestor de melhorias (rewrite slides)
- Integração Bubble.io
- Dashboard de análises
- API para integração partners

MESES 7-9 (V2.0):
- Análise de equipe (LinkedIn scraping)
- Validação externa (dados pública)
- Pitch deck generator (reverso)
- Integração com platforms VC

MESES 10-12 (V2.5):
- Agentes IA autonomos
- Análise contínua (updates)
- Marketplace de feedback VCs
- Monetização + tração inicial
```

---

## 📖 Referências & Recursos

### Frameworks Padrão:
- **Y Combinator Pitch Deck Guide**: https://www.ycombinator.com/
- **Sequoia Capital Pitch Deck Template**: Sequoia.com
- **a16z Pitch Deck Breakdown**: https://a16z.com/

### Ferramentas Similares (Análise):
- Pitchbase.com
- Angellist.com
- Crunchbase
- PitchBook

### APIs & Libs Úteis:
- OpenAI/Anthropic (LLM)
- Replicate (Vision models)
- Supabase (database)
- LangChain (agent orchestration)

---

## Conclusão

Este framework fornece:

✅ Análise estruturada em 7 categorias
✅ Métricas específicas por setor
✅ Sistema de scoring 0-100
✅ Arquitetura escalável com IA
✅ Checklist completo de validação
✅ Roadmap claro para MVP → Produto final

**Próximo passo para você:** Escolher 2-3 setores (ex: fintech + healthtech) e testar o framework com 5-10 pitch decks reais para calibrar weights e thresholds antes de automatizar com IA.