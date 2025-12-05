import json
import logging
from ..utils.tavily_client import TavilySearchClient
from ..utils.query_generator import SearchQueryGenerator
from ..utils.openai_client import DaatOpenAIClient
from django.conf import settings

logger = logging.getLogger(__name__)

class Phase1MarketResearch:
    """
    Serviço completo de pesquisa de mercado (Fase 1)
    """
    
    def __init__(self, openai_client: DaatOpenAIClient, tavily_client: TavilySearchClient):
        self.tavily = tavily_client
        self.openai = openai_client
        self.query_gen = SearchQueryGenerator()
    
    def execute(self, startup_data):
        """
        Executa pesquisa completa de mercado
        
        Args:
            startup_data (dict): Dados da startup do formulário
            
        Returns:
            dict: Relatório estruturado de pesquisa de mercado
        """
        logger.info("🚀 Iniciando Fase 1: Pesquisa de Mercado")
        
        # Mapeamento de campos para compatibilidade com o gerador
        # O formulário envia 'proposition', mas o gerador espera 'solution_type'
        # O formulário envia 'segment', mas o gerador espera 'sector'
        mapped_data = {
            'sector': startup_data.get('sector', '') or startup_data.get('segment', ''),
            'solution_type': startup_data.get('proposition', '') or startup_data.get('solution_type', ''),
            'target_audience': startup_data.get('target_audience', ''),
            'problem': startup_data.get('problem', ''),
            'geography': 'Brazil'
        }
        
        try:
            # Etapa 1: Gerar queries otimizadas
            logger.info("📝 Gerando queries de pesquisa...")
            queries = self.query_gen.generate_all_queries(mapped_data)
            
            # Etapa 2: Executar pesquisas
            logger.info("🔍 Executando pesquisas na web...")
            search_results = self._execute_searches(queries)
            
            # Etapa 3: Processar com GPT
            logger.info("🤖 Processando resultados com GPT...")
            processed_data = self._process_with_gpt(mapped_data, search_results)
            
            # Etapa 4: Validar qualidade
            quality_score = self._assess_data_quality(processed_data)
            processed_data['data_quality_score'] = quality_score
            
            logger.info(f"✅ Fase 1 concluída (qualidade: {quality_score}/10)")
            return processed_data
            
        except Exception as e:
            logger.error(f"❌ Erro na Fase 1: {str(e)}")
            return self._generate_fallback_report(mapped_data, str(e))
    
    def _execute_searches(self, queries):
        """
        Executa todas as pesquisas
        """
        all_results = {
            'competitors': [],
            'market_size': [],
            'trends': []
        }
        
        for category, query_list in queries.items():
            if query_list:
                logger.info(f"  Pesquisando {category}: {len(query_list)} queries")
                # Limite de resultados por query
                results = self.tavily.search_multiple(query_list, max_results=5)
                all_results[category] = results
        
        return all_results
    
    def _process_with_gpt(self, startup_data, search_results):
        """
        Processa resultados de pesquisa com GPT para extrair insights
        """
        # Extrair fatos-chave de todos os resultados usando método do cliente Tavily
        competitor_facts = self.tavily.extract_key_facts(search_results['competitors'])
        market_facts = self.tavily.extract_key_facts(search_results['market_size'])
        trend_facts = self.tavily.extract_key_facts(search_results['trends'])
        
        # Construir contexto para GPT
        context = f"""
DADOS DA STARTUP:
{json.dumps(startup_data, indent=2, ensure_ascii=False)}

RESULTADOS DA PESQUISA WEB:

=== CONCORRENTES ===
Total de fontes: {competitor_facts['total_sources']}
Domínios únicos: {competitor_facts['unique_domains']}

Respostas principais:
{json.dumps(competitor_facts['answers'], indent=2, ensure_ascii=False)}

Conteúdo relevante:
{json.dumps(competitor_facts['top_content'][:5], indent=2, ensure_ascii=False)}

=== TAMANHO DE MERCADO ===
Total de fontes: {market_facts['total_sources']}

Respostas principais:
{json.dumps(market_facts['answers'], indent=2, ensure_ascii=False)}

Conteúdo relevante:
{json.dumps(market_facts['top_content'][:3], indent=2, ensure_ascii=False)}

=== TENDÊNCIAS ===
Total de fontes: {trend_facts['total_sources']}

Respostas principais:
{json.dumps(trend_facts['answers'], indent=2, ensure_ascii=False)}
"""
        
        # Prompt para análise
        analysis_prompt = """
Você é um analista de mercado expert. Analise os resultados de pesquisa web e extraia informações estruturadas.

TAREFA:
Com base nas pesquisas realizadas, identifique e estruture:

1. CONCORRENTES DIRETOS
Liste APENAS empresas que fazem algo realmente similar à startup analisada.
Para cada concorrente:
- Nome da empresa
- País/Região
- Breve descrição (1 linha)
- Status (ativa, funding conhecido, etc)
- URL da fonte

Se NÃO encontrar concorrentes diretos claros, diga explicitamente.

2. DADOS DE MERCADO
Extraia números concretos encontrados:
- Tamanho de mercado (com ano e fonte)
- Taxa de crescimento (com período e fonte)
- Número de potenciais clientes (se disponível)
- Investimentos recentes no setor

3. TENDÊNCIAS PRINCIPAIS
Liste 2-3 tendências principais do setor com evidências específicas.

4. GAPS DE INFORMAÇÃO
O que NÃO foi encontrado nas pesquisas que seria importante saber?

RETORNE JSON estruturado seguindo este formato:
{
  "competitors": [
    {
      "name": "Nome",
      "location": "País",
      "description": "O que fazem",
      "status": "Status conhecido",
      "source_url": "URL"
    }
  ],
  "market_data": {
    "market_size": {
      "value": "Valor numérico com unidade",
      "year": "Ano da informação",
      "source": "URL",
      "confidence": "alta/média/baixa"
    },
    "growth_rate": {
      "value": "% crescimento",
      "period": "Período",
      "source": "URL",
      "confidence": "alta/média/baixa"
    },
    "potential_customers": {
      "value": "Número estimado",
      "description": "Descrição do segmento",
      "source": "URL",
      "confidence": "alta/média/baixa"
    }
  },
  "trends": [
    {
      "trend": "Descrição da tendência",
      "evidence": "Evidência específica",
      "source": "URL"
    }
  ],
  "information_gaps": [
    "Gap 1",
    "Gap 2"
  ],
  "search_summary": {
    "total_sources_analyzed": 0,
    "competitor_sources": 0,
    "market_sources": 0,
    "data_availability": "alta/média/baixa"
  }
}

REGRAS CRÍTICAS:
- NUNCA invente dados
- Se não encontrou, diga "Não encontrado"
- SEMPRE inclua source_url quando citar dados
- Diferencie entre fatos confirmados e estimativas
"""
        
        # Configurar modelo
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        model = ai_config.get('model', 'gpt-4o-mini')
        temp = ai_config.get('temperature', {}).get('market_research', 0.3)

        # Chamar GPT via helper
        response_content = self.openai.create_completion(
            system_prompt=analysis_prompt,
            user_message=context,
            temperature=temp,
            response_format={"type": "json_object"},
            model=model
        )
        
        try:
            processed = json.loads(response_content)
            
            # Adicionar URLs completas dos resultados
            processed['raw_search_urls'] = {
                'competitors': competitor_facts['all_urls'],
                'market': market_facts['all_urls'],
                'trends': trend_facts['all_urls']
            }
            
            return processed
            
        except json.JSONDecodeError as e:
            logger.error(f"Erro ao parsear JSON do GPT: {e}")
            logger.error(f"Response: {response_content}")
            raise
    
    def _assess_data_quality(self, processed_data):
        """
        Avalia qualidade dos dados obtidos (0-10)
        """
        score = 0
        
        # +3 pontos se encontrou concorrentes
        if processed_data.get('competitors') and len(processed_data['competitors']) > 0:
            score += 3
        
        # +3 pontos se tem dados de mercado com fonte
        market_data = processed_data.get('market_data', {})
        if market_data.get('market_size', {}).get('value') and market_data['market_size'].get('source'):
            score += 3
        
        # +2 pontos se tem tendências documentadas
        if processed_data.get('trends') and len(processed_data['trends']) > 0:
            score += 2
        
        # +2 pontos pela quantidade de fontes
        search_summary = processed_data.get('search_summary', {})
        total_sources = search_summary.get('total_sources_analyzed', 0)
        if total_sources >= 10:
            score += 2
        elif total_sources >= 5:
            score += 1
        
        return min(score, 10)
    
    def _generate_fallback_report(self, startup_data, error_message):
        """
        Gera relatório mínimo caso pesquisa falhe completamente
        """
        logger.warning("⚠️ Gerando relatório fallback devido a falha na pesquisa")
        
        return {
            'competitors': [],
            'market_data': {
                'market_size': {
                    'value': 'Não disponível',
                    'confidence': 'baixa',
                    'source': None
                }
            },
            'trends': [],
            'information_gaps': ['Pesquisa web falhou - análise baseada apenas em conhecimento do modelo'],
            'search_summary': {
                'total_sources_analyzed': 0,
                'data_availability': 'baixa'
            },
            'data_quality_score': 0,
            'error': error_message,
            'fallback_mode': True
        }
