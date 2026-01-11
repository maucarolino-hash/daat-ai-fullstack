import json
import logging
from ..utils.tavily_client import TavilySearchClient
from ..utils.query_generator import SearchQueryGenerator
from ..utils.openai_client import OpenAIClient
from django.conf import settings

logger = logging.getLogger(__name__)

class Phase1MarketResearch:
    """
    Serviço completo de pesquisa de mercado (Fase 1)
    """
    
    def __init__(self, openai_client: OpenAIClient, tavily_client: TavilySearchClient):
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
            
            # Etapa 3: Processar com GPT (Passo 1 - Identificação)
            logger.info("🤖 Processando resultados iniciais com GPT...")
            initial_data = self._process_with_gpt(mapped_data, search_results)
            
            # Etapa 4: Deep Dive (Se houver concorrentes)
            competitors = initial_data.get('competitors', [])
            if competitors:
                logger.info(f"🕵️ Deep dive em {len(competitors)} concorrentes identificados...")
                # Pega top 3 para não estourar tempo/custo
                top_competitors = competitors[:3] 
                deep_dive_results = self._execute_deep_dive(top_competitors, mapped_data['sector'])
                
                # Adiciona ao contexto original
                if deep_dive_results:
                    search_results['deep_dive'] = deep_dive_results
                    
                    # Reprocessa para enriquecer o relatório
                    logger.info("🤖 Refinando análise com dados do Deep Dive...")
                    # Pequeno hack: avisar o prompt que agora temos dados detalhados
                    mapped_data['pitch_deck_text'] += "\n\n[SISTEMA: DADOS DETALHADOS DE DEEP DIVE INCLUÍDOS. EXTRAIA FATURAMENTO, MARKET SHARE E PONTOS FRACOS ESPECÍFICOS DOS CONCORRENTES.]"
                    processed_data = self._process_with_gpt(mapped_data, search_results)
                else:
                    processed_data = initial_data
            else:
                processed_data = initial_data
            
            # Etapa 5: Validar qualidade
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

    def _execute_deep_dive(self, competitors, sector):
        """
        Executa pesquisa aprofundada para os top concorrentes
        """
        deep_dive_results = []
        
        for comp in competitors:
            name = comp.get('name')
            if not name: continue
            
            logger.info(f"  Investigando a fundo: {name}")
            # Gera queries específicas usando o método novo
            queries = self.query_gen.generate_deep_dive_queries(name, sector)
            
            # Executa pesquisa (menos results por query para ser rápido)
            results = self.tavily.search_multiple(queries, max_results=3)
            
            # Adiciona metadados para ajudar o GPT
            for res in results:
                res['context_type'] = f"deep_dive_{name}"
                
            deep_dive_results.extend(results)
            
        return deep_dive_results
    
    def _process_with_gpt(self, startup_data, search_results):
        """
        Processa resultados de pesquisa com GPT para extrair insights
        """
        # Formata resultados para o prompt
        search_context = json.dumps(search_results, indent=2, ensure_ascii=False)
        
        # Constrói o prompt com a template atualizada
        from .prompts import PROMPT_PHASE_1_MARKET_RESEARCH
        
        system_prompt = PROMPT_PHASE_1_MARKET_RESEARCH.format(
            startup_name=startup_data.get('startup_name', 'Startup em Análise'),
            startup_description=startup_data.get('solution_type', 'Solução Inovadora'),
            startup_sector=startup_data.get('sector', 'Tecnologia'),
            business_model=startup_data.get('business_model', 'SaaS/B2B'),
            target_audience=startup_data.get('target_audience', 'Empresas'),
            pitch_deck_text=startup_data.get('pitch_deck_text', 'Não fornecido.')
        )

        user_message = f"RESULTADOS DA PESQUISA TAVILY:\n{search_context}"
        
        # Configurar modelo
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        model = ai_config.get('model', 'gpt-4o-mini')
        temp = ai_config.get('temperature', {}).get('market_research', 0.2)

        # Chamar GPT via helper
        response_content = self.openai.create_completion(
            system_prompt=system_prompt,
            user_message=user_message,
            temperature=temp,
            response_format={"type": "json_object"},
            model=model
        )
        
        # Log (truncated) raw response for debug
        logger.info(f"GPT Response (first 100 chars): {response_content[:100]}...")

        # Sanitize Markdown if present
        cleaned_content = response_content.strip()
        if cleaned_content.startswith("```json"):
            cleaned_content = cleaned_content[7:]
        if cleaned_content.startswith("```"):
            cleaned_content = cleaned_content[3:]
        if cleaned_content.endswith("```"):
            cleaned_content = cleaned_content[:-3]
        cleaned_content = cleaned_content.strip()
        
        try:
            return json.loads(cleaned_content)
        except json.JSONDecodeError as e:
            logger.error(f"Erro ao parsear JSON do GPT: {e}")
            logger.error(f"Conteudo recebido: {response_content}")
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
