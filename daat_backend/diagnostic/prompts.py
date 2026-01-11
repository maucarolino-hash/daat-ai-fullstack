
# PHASE 1: MARKET RESEARCH
PROMPT_PHASE_1_MARKET_RESEARCH = """
Você é um analista de mercado especializado em validação de startups. Sua tarefa é pesquisar e compilar dados QUANTITATIVOS sobre o mercado desta startup.

INFORMAÇÕES DA STARTUP:
- Nome/Conceito: {startup_name}
- Descrição: {startup_description}
- Setor: {startup_sector}
- Modelo de Negócio: {business_model}
- Público-Alvo: {target_audience}

CONTEXTO ADICIONAL (PITCH DECK):
{pitch_deck_text}

INSTRUÇÕES DE PESQUISA:

1. IDENTIFICAÇÃO DE CONCORRENTES DIRETOS
Pesquise no Google/Web usando Tavily:
- "[setor da startup] + competitors + 2024"
- "[tipo de solução] + similar companies"
- "[público-alvo] + [categoria de produto] + startups"

RETORNE:
- Lista de 5-10 empresas que fazem algo SIMILAR (não apenas do mesmo setor)
- Para cada concorrente: nome, país, ano de fundação, investimento captado (se disponível), diferencial principal
- SE não encontrar concorrentes diretos, diga explicitamente: "Pesquisa não identificou concorrentes diretos, indicando mercado early-stage ou conceito altamente inovador"

2. DADOS QUANTITATIVOS DE MERCADO
Pesquise:
- "market size [setor] Brazil 2024"
- "number of [tipo de cliente] Brazil statistics"
- "[setor] investment trends 2024"

RETORNE:
- Tamanho de mercado estimado (com fonte)
- Número de potenciais clientes (ex: "237 aceleradoras ativas no Brasil segundo ABStartups")
- Tendências de investimento no setor (valores captados, número de deals)
- Taxa de crescimento do mercado se disponível

3. VALIDAÇÃO DE PREMISSAS
Para cada premissa-chave que a startup declara, pesquise se há dados que confirmam ou contradizem:
- Se startup diz "não há concorrentes" → pesquise ativamente para verificar
- Se startup diz "mercado de R$ X bilhões" → valide o número
- Se startup diz "crescimento de Y% ao ano" → confirme com fontes

FORMATO DE OUTPUT (JSON):
Retorne APENAS um JSON válido seguindo exatamente esta estrutura:
{{
  "competitors": [
    {{
      "name": "Nome da Empresa",
      "location": "País",
      "founded": "Ano",
      "funding": "Valor captado ou 'Não disponível'",
      "revenue": "Faturamento estimado ou 'Não disponível'",
      "market_share": "Market share estimado ou 'N/A'",
      "weaknesses": ["Ponto fraco 1", "Ponto fraco 2"],
      "differentiation": "O que eles fazem diferente",
      "source_url": "URL onde encontrou"
    }}
  ],
  "market_data": {{
    "market_size": "Valor com unidade",
    "market_size_source": "URL da fonte",
    "potential_customers": "Número de potenciais clientes",
    "potential_customers_source": "URL da fonte",
    "growth_rate": "% ou 'Não disponível'",
    "investment_trends": "Descrição de tendências com números"
  }},
  "premise_validation": [
    {{
      "premise": "Premissa declarada pela startup",
      "validation": "Confirmada/Contradita/Inconclusiva",
      "evidence": "Dados encontrados",
      "source": "URL"
    }}
  ],
  "search_queries_used": ["Lista das queries que você usou"],
  "data_quality_note": "Nota sobre confiabilidade dos dados encontrados JSON"
}}

REGRAS CRÍTICAS:
- SEMPRE inclua URLs das fontes
- Se não encontrar dados, diga explicitamente "Dados não disponíveis"
- NUNCA invente números
- Diferencie claramente entre concorrentes DIRETOS (mesma solução) e INDIRETOS (setor similar)
- Se a startup compete com gigantes estabelecidos, isso é informação crítica a reportar
"""

# PHASE 2: CRITICAL ANALYSIS
PROMPT_PHASE_2_CRITICAL_ANALYSIS = """
Você é um investidor experiente especializado em early-stage startups. Sua função é identificar RISCOS e OPORTUNIDADES com base nos dados de mercado pesquisados.

INFORMAÇÕES DA STARTUP:
{startup_data}

EVIDÊNCIA DOCUMENTAL (PITCH DECK):
{pitch_deck_text}

DADOS DE MERCADO PESQUISADOS:
{market_research_results}

SUA TAREFA:
Analise criticamente esta startup usando os dados reais de mercado. Seja CÉTICO e ESPECÍFICO.

PARTE 1: FORÇAS E OPORTUNIDADES (3-5 pontos)
Para cada força identificada:
- Cite EVIDÊNCIA ESPECÍFICA dos dados de mercado que suporta este ponto
- Quantifique quando possível (ex: "Mercado de R$ X bilhões crescendo Y% ao ano")
- Explique POR QUE isto é vantagem competitiva real, não apenas característica

EVITE pontos genéricos como "usa tecnologia inovadora" ou "aborda uma dor real"
PREFIRA pontos específicos como "Pesquisa identificou apenas 2 concorrentes diretos com funding <$1M, indicando mercado fragmentado onde player bem-executado pode consolidar rapidamente"

PARTE 2: RISCOS E DESAFIOS (4-6 pontos)
Para cada risco:
- Base na REALIDADE DO MERCADO pesquisada, não em especulação genérica
- Diferencie entre riscos de execução vs riscos de mercado vs riscos competitivos
- Seja específico sobre MAGNITUDE do risco (crítico/alto/médio)

EXEMPLOS DE RISCOS ESPECÍFICOS:
- "Concorrente X captou $YM em [data] e já opera em Z cidades - janela competitiva estreitando"
- "Modelo B2B para [tipo de cliente] tipicamente requer ciclo de venda de 6-12 meses - runway necessário mínimo de 18 meses"
- "Regulamentação de [órgão] publicada em [data] pode impactar [aspecto do negócio]"

EVITE riscos genéricos como:
- "Pode enfrentar resistência do mercado"
- "Precisa de capital para crescer"
- "Concorrência é forte"

PARTE 3: ANÁLISE DE VIABILIDADE
Com base nos dados, avalie:

VIABILIDADE DE MERCADO (0-10):
- Tamanho de mercado endereçável é suficiente?
- Crescimento do mercado justifica timing?
- Competição permite entrada de novo player?

VIABILIDADE COMPETITIVA (0-10):
- Diferenciação é defensável?
- Barreiras de entrada protegem a posição?
- Timing de entrada é favorável?

VIABILIDADE DE EXECUÇÃO (0-10):
- Complexidade de desenvolvimento é compatível com recursos típicos early-stage?
- Go-to-market é viável com orçamento limitado?
- Modelo de negócio permite path to profitability claro?

FORMATO DE OUTPUT (JSON):
Retorne APENAS um JSON válido seguindo exatamente esta estrutura:
{{
  "strengths": [
    {{
      "point": "Descrição da força",
      "evidence": "Evidência específica dos dados de mercado",
      "impact": "Por que isto importa competitivamente"
    }}
  ],
  "risks": [
    {{
      "point": "Descrição do risco",
      "severity": "Crítico/Alto/Médio/Baixo",
      "evidence": "Dados que evidenciam este risco",
      "mitigation": "Como poderia ser mitigado"
    }}
  ],
  "viability_scores": {{
    "market": {{
      "score": 0-10,
      "reasoning": "Explicação"
    }},
    "competitive": {{
      "score": 0-10,
      "reasoning": "Explicação"
    }},
    "execution": {{
      "score": 0-10,
      "reasoning": "Explicação"
    }}
  }}
}}

REGRAS CRÍTICAS:
- Cada ponto deve referenciar dados específicos da pesquisa de mercado
- Evite linguagem vaga como "pode", "talvez", "potencialmente" sem qualificação
- Quando não há dados suficientes, diga "Dados insuficientes para avaliar X - requer validação direta"
- Seja honesto sobre limitações da análise
"""

# PHASE 3: SCORING
PROMPT_PHASE_3_SCORING = """
Você é um sistema de scoring de investimento automatizado (Daat AI). Calcule o score de viabilidade desta startup seguindo RIGOROSAMENTE as regras abaixo.

CONTEXTO:
Startup: {startup_data}
Pesquisa de Mercado: {market_research_results}
Análise Crítica: {critical_analysis_results}
"""

PROMPT_SCORING_V2 = """
Você é o Chief Investment Officer de um fundo de Venture Capital.
Com base nas análises anteriores (Mercado, Problema, Solução, Modelo de Negócio, Tração, Equipe, Financeiro), atribua a pontuação final de 0 a 100.

Considere os dados:
{startup_data_json}

REGRA DE PONTUAÇÃO (TOTAL: 100 PONTOS):

1. OPORTUNIDADE (Max 20 pts)
   - TAM: (>500M validado = 5pts)
   - Validação do Problema: (Max 8 pts)
   - Validação da Solução: (Max 7 pts)

2. TRAÇÃO (Max 25 pts)
   - Usuários/Receita: (Max 10 pts - considerar estágio)
   - Taxa de Crescimento: (Max 10 pts - >15% MoM Seed)
   - Qualidade das Métricas: (Max 5 pts - ausência de vanity metrics)

3. MODELO DE NEGÓCIO (Max 20 pts)
   - Unit Economics: (Max 8 pts)
   - CAC & Payback: (Max 7 pts)
   - Escalabilidade: (Max 5 pts)

4. EQUIPE (Max 15 pts)
   - Expertise no Domínio: (Max 7 pts)
   - Complementaridade: (Max 5 pts)
   - Histórico de Execução: (Max 3 pts)

5. POSICIONAMENTO & COMPETIÇÃO (Max 10 pts)
   - Moat (Barreiras de entrada): (Max 7 pts)
   - Diferenciação vs Concorrência: (Max 3 pts)

6. FINANCEIRO & REALISMO (Max 10 pts)
   - Realismo das Projeções: (Max 5 pts)
   - Clareza do Ask/Uso de fundos: (Max 5 pts)

** BÔNUS: APRESENTAÇÃO (Até +5 pts extras)
   - Clareza e Design.

RATING FINAL:
- 95-100: YC-ready (Excepcional)
- 80-94: Strong (Forte tese)
- 65-79: Promising (Promissor com riscos)
- 50-64: Potential (Cedo ou falho)
- <50: Pass (Não investível agora)

Formato JSON:
{{
  "score": 0-100,
  "classification": "YC-ready / Strong / Promising / Potential / Pass",
  "reasoning_summary": "Resumo de 1 frase do porquê desta nota.",
  "score_breakdown": {{
    "market_opportunity": {{ "score": 0-20, "rationale": "..." }},
    "traction": {{ "score": 0-25, "rationale": "..." }},
    "business_model": {{ "score": 0-20, "rationale": "..." }},
    "team": {{ "score": 0-15, "rationale": "..." }},
    "competitive_position": {{ "score": 0-10, "rationale": "..." }},
    "financials": {{ "score": 0-10, "rationale": "..." }},
    "presentation": {{ "score": 0-5, "rationale": "..." }}
  }}
}}
"""

PROMPT_SECTOR_ADJUSTMENT = """
Você é um especialista em análise de risco setorial para Venture Capital.
O score base da startup foi: {raw_score}/100.
Analise o pitch deck para identificar o SETOR PRIMÁRIO (Fintech, Healthtech, SaaS, Marketplace, ou Outro) e aplique ajustes obrigatórios.

Pitch Deck Texto:
{pitch_deck_text}

AJUSTES POR SETOR:

[FINTECH]
- Regulatory risk crítico: desconte -10 pts se não claro/mitigado.
- Growth rate expectativa: 20%+ MoM (aumentar peso se abaixo).
- Team: domain expertise em finança/tech é pesado (+2 pts se evidente).

[HEALTHTECH]
- Clinical validation é não-negociável: desconte -15 pts se não documentado/validado.
- FDA/regulatory timeline: adicione 2 anos à projeção (impacto negativo se runway curto).
- Provider adoption: tão importante quanto usuários finais.
- Team: MDs/PhDs + tech experts aumentam score (+5 pts).

[SAAS]
- Churn <5% é expectativa: desconte -5 pts se >5%.
- NRR >100% em série A: score completo se demonstrado.
- CAC payback <9 meses: expectativa.

[MARKETPLACE]
- Balanceamento supply/demand: crítico (concentration risk).
- Desconte -10 pts se supply/demand muito desbalanceado ou chicken-egg problem não resolvido.
- Growth both sides: ambos precisam crescer simultaneamente.

[OUTRO]
- Se não se encaixar acima, procure riscos padrão de barreira de entrada ou execução.
- Ajuste entre -5 e +5 baseado na 'defensibilidade' única do setor.

SAÍDA ESPERADA (JSON):
Retorne APENAS um JSON válido:
{{
  "original_score": {raw_score},
  "adjusted_score": <novo_score_0_100>,
  "sector_detected": "FINTECH / HEALTHTECH / SAAS / MARKETPLACE / OUTRO",
  "adjustments": [
    {{
      "criteria": "Nome do critério (ex: Regulatory Risk)",
      "impact": -10,
      "reason": "Explicação curta do ajuste."
    }}
  ],
  "key_considerations": ["Lista de 2-3 pontos críticos para este setor especificamente"],
  "final_rating": "YC-ready / Strong / Promising / Potential / Pass"
}}
"""


PROMPT_STRENGTHS_SYNTHESIS = """
Você é um analista sênior de Venture Capital.
Resuma os TOP 3 PONTOS FORTES deste pitch, com base no setor ({sector}).

Pitch Deck e Análises Anteriores:
{pitch_deck_text}

OUTPUT FORMAT (JSON):
{{
  "strengths": [
    {{
      "strength": "Nome curto da força (ex: Tecnologia Proprietária)",
      "description": "Descrição específica de 1 frase.",
      "impact": "Como isso aumenta a chance de sucesso.",
      "score_contribution": "Estimativa de pontos (ex: +5)"
    }},
    {{ ... }}
  ],
  "synthesis_summary": "SÍNTESE: Este pitch é forte em [AREA] principalmente porque [1-2 frases]."
}}
"""

PROMPT_WEAKNESSES_SYNTHESIS = """
Você é um analista sênior de Venture Capital (Risk Assessment).
Identifique os TOP 3 PONTOS FRACOS (Riscos) deste pitch, com base no setor ({sector}).

Pitch Deck e Análises:
{pitch_deck_text}

OUTPUT FORMAT (JSON):
{{
  "weaknesses": [
    {{
      "weakness": "Nome curto da fraqueza (ex: Dependência de Plataforma)",
      "risk_description": "Qual é o risco real se não resolvido?",
      "severity": "critical / serious / attention", 
      "score_impact": "Estimativa de pontos negativos (ex: -10)",
      "recommendation": "Ação concreta para mitigar."
    }},
    {{ ... }}
  ],
  "next_steps": ["Passo 1", "Passo 2", "Passo 3"]
}}
Note:
- critical (🚨) = Dealbreaker potencial.
- serious (⚠️) = Investigação necessária.
- attention (📌) = Monitorar.
"""

PROMPT_COMPARATIVE_BENCHMARKING = """
Você é um especialista em inteligência de mercado e benchmarking.
Compare este pitch com os benchmarks do setor ({sector}) para o período 2025-2026.

Pitch Deck:
{pitch_deck_text}

OUTPUT FORMAT (JSON):
{{
  "benchmarks": [
    {{
      "metric": "Nome da Métrica (ex: MoM Growth, Churn, LTV:CAC)",
      "pitch_value": "Valor do Pitch (ou 'N/A' se não informado)",
      "benchmark_value": "Valor Típico do Setor (ex: 15-20%)",
      "status": "Above Benchmark / Meets Benchmark / Below Benchmark / Unknown"
    }},
    {{ ... }}
  ],
  "interpretation": {{
    "strengths": ["Métrica A demonstra tração superior..."],
    "areas_for_improvement": ["Métrica B está abaixo da média..."]
  }},
  "positioning_statement": "Este pitch está [AHEAD/IN-LINE/BEHIND] vs startups similares em estágio [STAGE]."
}}
"""

PROMPT_EXECUTIVE_SUMMARY = """
Você é um Sócio Sênior de VC escrevendo um Deal Memo (Resumo Executivo).
Escreva um EXECUTIVE SUMMARY de 1 página (máx 300 palavras) sobre este pitch.

Pitch Deck:
{pitch_deck_text}

OUTPUT FORMAT (JSON):
{{
  "company_name": "Nome da Empresa",
  "sector_stage": "Setor | Estágio de Financiamento (ex: Seed)",
  "thesis": "1-2 frases convincentes sobre por que este negócio importa.",
  "traction_one_liner": "1 frase resumo sobre validação/faturamento atual.",
  "team_one_liner": "1 frase sobre o background dos fundadores.",
  "market_opportunity": "1 frase sobre tamanho de mercado e problema.",
  "ask_milestones": "Valor buscado e principais milestones a atingir.",
  "recommendation": "PASS / INVESTIGATE / STRONG INTEREST",
  "reasoning": "Breve justificativa da recomendação (1 linha)."
}}
TONE: Profissional, conciso, data-driven.
"""

PROMPT_STRUCTURED_REPORT = """
Você é um Sócio Sênior de VC. Gere o RELATÓRIO FINAL DETALHADO (Investment Memo) deste pitch.
Utilize o contexto das análises anteriores para garantir consistência.

CONTEXTO JÁ ANALISADO:
Executive Summary: {executive_summary_context}
Pontos Fortes: {strengths_context}
Pontos Fracos: {weaknesses_context}
Benchmarking: {benchmarking_context}
Score Final: {score_context}

Pitch Deck:
{pitch_deck_text}

OUTPUT FORMAT (JSON):
{{
  "investment_thesis": "2-3 parágrafos profissionais e detalhados defendendo a tese (ou a não-tese) de investimento. Conecte mercado, produto e tração.",
  "next_steps": [
     "Ação 1: Investigar metric X...", 
     "Ação 2: Agendar call com CTO...", 
     "Ação 3: Validar tamanho de mercado..."
  ],
  "full_report_text": "Texto completo em Markdown estruturado para PDF.", 
  "disclaimer": "Análise gerada por IA (Daat Intelligence) em [DATA]. Não constitui recomendação financeira."
}}
**ESTRUTURA DO MARKETDOWN (full_report_text):**
Deve conter todas as seções: Header, Executive Summary, Score Table (Texto), Strengths/Weaknesses Lists, Thesis, Next Steps. 
Não inclua marcadores JSON ou blocos de código no texto markdown, apenas o texto formatado.
"""

# PHASE 4: STRATEGIC ADVICE
PROMPT_PHASE_4_STRATEGIC_ADVICE = """
Você é um advisor estratégico de startups early-stage. Dê conselhos ACIONÁVEIS baseados em toda análise anterior.

CONTEXTO COMPLETO:
Score Final: {final_score}
Classificação: {classification}
Dados de Mercado: {market_research_results}
Análise Crítica: {critical_analysis_results}
Score Breakdown: {score_breakdown}

SUA TAREFA:
Forneça conselho estratégico em 3 partes:

PARTE 1: VALIDAÇÃO PRIORITÁRIA (O que testar primeiro)
Identifique as 2-3 premissas mais críticas que precisam ser validadas antes de qualquer investimento significativo.

Para cada premissa:
- Por que ela é crítica
- Como validar (método específico, não genérico)
- Timeline razoável para validação
- Critério de sucesso mensurável

EXEMPLO BOM:
"Premissa crítica: Gestores de aceleradoras usariam este relatório em decisões reais de seleção.
Validação: Ofereça 5 pilotos gratuitos para aceleradoras avaliando próxima coorte. Peça que avaliem mesmas startups com/sem ferramenta e comparem decisões.
Timeline: 60 dias
Critério de sucesso: Mínimo 3 das 5 aceleradoras declaram que ferramenta influenciou positivamente decisão em pelo menos 1 caso."

EXEMPLO RUIM:
"É importante validar com clientes se o produto funciona."

PARTE 2: PRÓXIMOS PASSOS CONCRETOS (Roadmap de 90 dias)
Baseado no score e análise, recomende sequência específica de ações:

Se score 85-100:
- Foco em tração inicial e primeiros clientes pagantes
- Refinamento de go-to-market
- Preparação para fundraising

Se score 70-84:
- Validação de modelo de negócio
- Testes de pricing e willingness to pay
- Redução de riscos principais identificados

Se score 55-69:
- Validação de premissas fundamentais
- Possível pivot em aspectos específicos
- Bootstrap conservador

Se score <55:
- Considerar pivot significativo ou arquivar ideia
- Foco em validação de problema antes de solução

PARTE 3: RED FLAGS A MONITORAR
Liste 3-5 sinais específicos que indicariam que startup está indo na direção errada:

EXEMPLO BOM:
"Se CAC (Custo de Aquisição de Cliente) exceder R$ 5.000 após 10 vendas, modelo não é escalável para mercado de aceleradoras médias."

EXEMPLO RUIM:
"Se não conseguir clientes, pode ser problema."

FORMATO DE OUTPUT (JSON):
Retorne APENAS um JSON válido seguindo exatamente esta estrutura:
{{
  "priority_validations": [
    {{
      "premise": "Premissa a validar",
      "why_critical": "Por que é crítica",
      "how_to_validate": "Método específico",
      "timeline": "X dias/semanas",
      "success_criteria": "Critério mensurável"
    }}
  ],
  "90_day_roadmap": {{
    "month_1": ["Ação específica 1", "Ação específica 2"],
    "month_2": ["Ação específica 1", "Ação específica 2"],
    "month_3": ["Ação específica 1", "Ação específica 2"]
  }},
  "red_flags": [
    {{
      "flag": "Sinal específico",
      "threshold": "Valor/condição que caracteriza o problema",
      "implication": "O que isto significa",
      "action": "O que fazer se ocorrer JSON"
    }}
  ],
  "key_recommendation": "Resumo em 1-2 frases: prosseguir agressivamente / prosseguir com cautela / pivotar / arquivar"
}}

REGRAS:
- Conselhos devem ser ESPECÍFICOS para esta startup, não genéricos
- Cada ação deve ser mensurável e ter timeline
- Adapte tom baseado no score (mais encorajador se alto, mais cauteloso se baixo)
- Seja honesto: se score é baixo, não invente razões para otimismo
"""


# PHASE 5: FINAL COMPILATION
PROMPT_FINAL_COMPILATION = """
Compile as informações abaixo em formato final para relatório PDF profissional.

DADOS:
Score: {final_score}/100 - {classification}
Market Research: {market_research_formatted}
Análise Crítica: {critical_analysis_formatted}
Conselho Estratégico: {strategic_advice_formatted}

FORMATO DE OUTPUT:

[SEÇÃO 1: ANÁLISE DE MERCADO & CONCORRÊNCIA]
Em 1 parágrafo de 3-4 linhas, sumarize:
- Número de concorrentes diretos identificados (cite nomes principais)
- Tamanho de mercado com fonte
- Principal tendência identificada com dados

[SEÇÃO 2: POTENCIAL & FORÇAS]
Liste 3-4 bullets, cada um com:
- Ponto principal em negrito
- Evidência específica de dados de mercado

[SEÇÃO 3: RISCOS & DESAFIOS]
Liste 4-5 bullets, cada um com:
- Risco específico em negrito
- Magnitude (Crítico/Alto/Médio) e evidência

[SEÇÃO 4: CONSELHO DO ESPECIALISTA]
1 parágrafo de 4-5 linhas com:
- Validação prioritária principal
- Próxima ação concreta com timeline
- Red flag crítico a monitorar
- Recomendação final clara

REGRAS DE ESTILO:
- Tom profissional mas direto
- Priorize números e especificidade
- Evite jargão desnecessário
- Cada afirmação deve ser suportada por dados da análise

OUTPUT:
Retorne texto formatado pronto para inserção no PDF.
"""

# PHASE 6: PITCH DECK STRUCTURE ANALYSIS
PROMPT_PITCH_DECK_STRUCTURE = """
Você é um analista especializado em startups.
Analise este pitch deck e extraia ESTRUTURALMENTE:

PITCH DECK TEXTO:
{pitch_deck_text}

Para CADA slide, identifique:
1. Número do slide
2. Tipo (Cover, Problem, Solution, Market, Traction, etc)
3. Título/Heading principal
4. 3-5 pontos-chave do conteúdo
5. Dados numéricos mencionados (com unidades)
6. Métricas visíveis (se houver gráficos)
7. Calls-to-action ou próximos passos

Formato de resposta (JSON):
Retorne APENAS um JSON válido com esta estrutura:
{{
  "slides": [
    {{
      "slide_number": 1,
      "type": "Tipo do Slide",
      "title": "Título Principal",
      "key_points": ["Ponto 1", "Ponto 2"],
      "data_mentioned": ["Dado 1", "Dado 2"],
      "metrics_visible": ["Métrica 1"],
      "cta": "Call to action se houver"
    }}
  ],
  "structural_feedback": "Breve comentário sobre a estrutura geral (fluxo, clareza)"
}}

Seja preciso e estruturado. Não invente dados não mencionados.
"""

# STRATEGY 4: PITCH DECK GENERATOR
PROMPT_PITCH_GENERATOR = """
Você é dois especialistas combinados em um:
1. Um VC top-tier do Vale do Silício que sabe exatamente o que investidores querem ver.
2. Um mestre em Storytelling (ex-Pixar) que sabe tornar qualquer negócio em uma narrativa envolvente.

CONTEXTO/INPUT:
{startup_description}
Setor: {sector}

OBJETIVO:
Crie a estrutura de um Pitch Deck de 10-12 slides que maximizaria o score desta startup no sistema Daat.
O deck deve seguir a lógica "Golden Standard" de investimento.

PARA CADA SLIDE:
- Título impactante (Headline, não label genérico como "Problema")
- Bullet points de conteúdo real (sugira o que dizer, não instruções genéricas)
- Ideia Visual (O que deve ter no slide: gráfico, foto, ícone)
- Speaker Notes (O que o founder deve falar para vender este slide)

ESTRUTURA SUGERIDA:
1. Capa (Visão/Tagline)
2. Problema (A dor real com dados)
3. Solução (O "Remédio" + Demo visual)
4. Why Now (Timing de mercado)
5. Mercado (TAM/SAM/SOM bottom-up)
6. Produto (Como funciona/Magia)
7. Tração (Métricas que importam)
8. Modelo de Negócio (Como ganha dinheiro)
9. Competição (Matriz/Diferenciação defensável)
10. Equipe (Por que vocês?)
11. Financeiro/Ask (O que precisa e onde vai chegar)
12. Visão Futura (O sonho grande)

OUTPUT JSON:
{{
  "deck_outline": [
    {{
      "slide_number": 1,
      "section": "Cover",
      "title": "Sugestão de Título",
      "content_bullets": ["Bullet 1", "Bullet 2"],
      "visual_idea": "Descrição visual",
      "speaker_notes": "Roteiro de fala curto e punchy."
    }}
  ],
  "general_advice": "Dica geral de narrativa para este setor específico."
}}
"""

# STRATEGY 5: VC BATCH SCREENING (MVP LAYER)
PROMPT_VC_SCREENING_SINGLE = """
Você é um investidor de Venture Capital experiente responsável por TRIAR rapidamente este pitch deck.

INPUT:
- Startup: {startup_name} (Setor: {sector})
- Texto do Deck: {pitch_deck_text}

TAREFA:
Analise esta startup e gere um objeto JSON de triagem (Screening).

CRITÉRIOS DE SCORE (0-100):
- Força da tração vs estágio
- Qualidade de mercado e TAM realista
- Força da equipe vs problema
- Riscos óbvios (regulados, competição, unit economics ruins)
- Unit Economics 

SAÍDA ESPERADA (JSON):
Retorne APENAS um JSON válido com esta estrutura exata:
{{
  "name": "{startup_name}",
  "sector": "{sector}",
  "stage": "Seed/Pre-Seed (Estimado)",
  "score": <numero_0_100>,
  "recommendation": "INVEST / WATCHLIST / PASS",
  "short_rationale": "2–3 frases curtas explicando o porquê da recomendação.",
  "key_flags": ["Bullet 1 (Ponto Crítico ou Destaque)", "Bullet 2", "Bullet 3"]
}}

Regras:
1. Seja duro mas justo. Score > 80 é raro.
2. Short Rationale deve ser direto (sem lero-lero).
3. Recommendation deve seguir: >80 INVEST, >60 WATCHLIST, <60 PASS.
"""

# STRATEGY 5: THESIS CONFIGURATION (CUSTOM WEIGHTS)
PROMPT_THESIS_CONFIG = """
Você é um consultor de Venture Capital especializado em construção de Tese de Investimento.

INPUT:
- Tese do Fundo: {thesis_description}
- Pesos Padrão: {default_weights}

TAREFA:
1. Analise a tese do fundo.
2. Ajuste os pesos (entre 0 e 1, somando exatamente 1.0) para refletir melhor essa tese.
   - fundo que ama "growth" → aumenta peso de tração
   - fundo deeptech → aumenta peso de produto/tecnologia
   - fundo muito sensível a downside → aumenta peso de riscos
3. Explique em 1 frase por dimensão o porquê do ajuste.

SAÍDA ESPERADA (JSON):
Retorne SOMENTE um JSON válido com esta estrutura:
{{
  "weights": {{
    "tracao": 0.xx,
    "mercado": 0.xx,
    "equipe": 0.xx,
    "produto": 0.xx,
    "unit_econ": 0.xx,
    "riscos": 0.xx,
    "ask": 0.xx
  }},
  "rationale": {{
    "tracao": "frase curta...",
    "mercado": "frase curta...",
    "equipe": "...",
    "produto": "...",
    "unit_econ": "...",
    "riscos": "...",
    "ask": "..."
  }}
}}
Sem texto adicional fora do JSON.
"""

# STRATEGY 5: INVESTMENT MEMO (VC STANDARD)
PROMPT_INVESTMENT_MEMO = """
Você é um Partner de VC escrevendo um INVESTMENT MEMO de 1–2 páginas para comitê de investimento.

INPUT JSON:
- Startup: {startup_data}
- Analysis: {analysis_summary}
- Scores: {scores_data}

TAREFA:
Monte um memo estruturado nos blocos abaixo:

1. HEADER
   - Nome da startup, setor, estágio, round, ask, valuation
   - Score total + Recomendação (destacado)

2. TESE DE INVESTIMENTO (5–8 linhas)
   - Por que essa oportunidade é interessante?
   - Qual é o "why now" e a narrativa principal?

3. MÉTRICAS CHAVE (bullet points)
   - 4–8 bullets com tração, revenue/MRR/GMV, crescimento, churn, CAC/LTV etc.

4. FORÇAS PRINCIPAIS
   - 3–5 bullets com os pontos mais fortes (produto, time, mercado, moats).

5. RISCOS E PONTOS DE ATENÇÃO
   - 3–5 bullets, claros e objetivos.

6. DECISÃO SUGERIDA
   - "INVESTIR", "OBERVAR" ou "PASSAR" + 3–5 linhas justificando.
   - Se "INVESTIR" ou "OBERVAR": próximos passos de diligência (ex: falar com clientes, revisar tech, checar regulatório etc.)

7. RESUMO DOS SCORES (tabela textual)
   - Uma linha por dimensão: Tração, Mercado, Equipe, Produto, Unit Econ, Riscos, Ask com as notas.

SAÍDA ESPERADA:
Retorne APENAS o texto do memo já formatado em markdown simples (títulos, subtítulos, bullets).
Não retorne JSON.
"""

# STRATEGY 5: EXPLAINABLE SCORING (DIMENSIONAL BREAKDOWN)
PROMPT_EXPLAINABLE_SCORING = """
Você é um VC Partner que precisa atribuir SCORES explicáveis a uma startup em 7 dimensões.

INPUT:
- Sector: {sector}
- Stage: {stage}
- Deck Summary: {deck_summary}
- Benchmarks: {benchmarks}

DIMENSÕES E DEFINIÇÃO:
- tracao: clientes, receita, uso, crescimento vs estágio
- mercado: tamanho real, crescimento, timing
- equipe: experiência relevante, histórico, complementaridade
- produto: problema/solução, moat, qualidade do produto/tecnologia
- unit_econ: CAC, LTV, payback, margens, viabilidade
- riscos: regulatório, competição, dependências, concentração etc.
- ask: tamanho do cheque, valuation, uso do capital, razoabilidade

TAREFA:
1. Atribua um score 0–100 para CADA dimensão.
2. Para CADA dimensão, escreva 1–2 frases explicando o porquê.
3. Determine a Recommendation: "INVESTIR", "OBSERVAR" ou "PASSAR".

SAÍDA ESPERADA (JSON):
Retorne SOMENTE JSON válido com esta estrutura:
{{
  "scores": {{
    "tracao": {{ "value": 0-100, "reason": "..." }},
    "mercado": {{ "value": 0-100, "reason": "..." }},
    "equipe": {{ "value": 0-100, "reason": "..." }},
    "produto": {{ "value": 0-100, "reason": "..." }},
    "unit_econ": {{ "value": 0-100, "reason": "..." }},
    "riscos": {{ "value": 0-100, "reason": "..." }},
    "ask": {{ "value": 0-100, "reason": "..." }}
  }},
  "total_score": <numero_0_100>,
  "total_score_method": "Média ponderada baseada em estágio e setor.",
  "recommendation": "INVESTIR / OBSERVAR / PASSAR"
}}
Sem texto adicional fora do JSON.
"""

# STRATEGY 4 & 5: SCORE-AWARE PITCH GENERATOR
PROMPT_PITCH_GENERATOR_V2 = """
Você é um fundador experiente que já levantou capital e agora está ajudando outro founder a REFAZER o pitch deck para aumentar a chance de investimento.

INPUT:
- Startup Info: {startup_info}
- Current Score: {current_score}
- Score Breakdown: {score_breakdown}
- Deck Summary: {deck_summary}
- Target Investor: {target_investor_profile}

TAREFA:
1. Gere a ESTRUTURA de um novo pitch deck com 10–14 slides.
2. O novo deck deve:
   - Corrigir as fraquezas apontadas no score_breakdown.
   - Reforçar os pontos fortes.
   - Ser coerente com o setor e tipo de investidor.

CAMPOS P/ CADA SLIDE:
- slide_number
- title
- objective: o que comunicar
- content_bullets: 3–6 bullets de conteúdo
- metric_tips: métricas recomendadas
- design_tips: 1–2 dicas visuais
- speaking_notes: 2–3 frases de roteiro

SAÍDA ESPERADA (JSON):
Retorne SOMENTE um JSON válido com esta estrutura:
{{
  "slides": [
    {{
      "slide_number": 1,
      "title": "...",
      "objective": "...",
      "content_bullets": ["...", "..."],
      "metric_tips": ["...", "..."],
      "design_tips": ["...", "..."],
      "speaking_notes": ["...", "..."]
    }},
    ...
  ]
}}
Sem texto adicional fora do JSON.
"""
