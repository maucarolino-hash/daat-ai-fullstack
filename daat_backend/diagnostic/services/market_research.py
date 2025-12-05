import json
from ..utils.tavily_client import TavilySearchClient
from ..utils.query_generator import SearchQueryGenerator
from ..utils.openai_client import DaatOpenAIClient
from .prompts import PROMPT_PHASE_1_MARKET_RESEARCH

class Phase1MarketResearch:
    def __init__(self, openai_client: DaatOpenAIClient, tavily_client: TavilySearchClient):
        self.openai = openai_client.get_client()
        self.tavily = tavily_client

    def execute(self, startup_data):
        sector = startup_data.get('sector', '')
        solution_type = startup_data.get('proposition', '')
        problem = startup_data.get('problem', '')
        
        search_results_list = []
        used_web_search = False

        try:
            # 1. Preparar dados para o gerador de queries
            query_data = {
                'sector': sector,
                'solution_type': solution_type,
                'target_audience': sector, # Fallback, já que o form não tem campo específico
                'geography': 'Brazil'
            }
            
            # 2. Gerar Smart Queries
            generated_queries = SearchQueryGenerator.generate_all_queries(query_data)
            
            # 3. Flatten queries (Prioridade: Concorrentes > Mercado > Trends)
            search_queries = []
            search_queries.extend(generated_queries.get('competitors', [])[:3])
            search_queries.extend(generated_queries.get('market_size', [])[:2])
            
            
            # Usando o novo search_multiple do cliente robusto
            search_results_list = self.tavily.search_multiple(search_queries)
            used_web_search = True
            
        except Exception as e:
            print(f"⚠️ Tavily falhou ou não configurado na Fase 1: {str(e)}")
            # Fallback
            search_results_list = [{"query": "fallback", "results": "Pesquisa web indisponível."}]
        
        if not search_results_list: # Garantir que não está vazio
             search_results_list = [{"query": "fallback", "results": "Pesquisa web indisponível."}]

        # Processar com GPT
        prompt = PROMPT_PHASE_1_MARKET_RESEARCH.format(
            startup_name="Startup em Análise",
            startup_description=f"Problema: {problem}. Solução: {solution_type}",
            startup_sector=sector,
            business_model="Não especificado", 
            target_audience="Não especificado"
        )
        
        input_content = f"Resultados das pesquisas web:\n\n{json.dumps(search_results_list, indent=2, ensure_ascii=False)}"
        if not used_web_search:
            input_content = "⚠️ AVISO: Pesquisa web falhou. Gere estimativas baseadas em seu conhecimento."

        if not self.openai:
             return {"error": "OpenAI client not initialized"}
        
        from django.conf import settings
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        model = ai_config.get('model', 'gpt-4o-mini')
        temp = ai_config.get('temperature', {}).get('market_research', 0.3)

        response = self.openai.chat.completions.create(
            model=model, 
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": input_content}
            ],
            temperature=temp,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        result['used_web_search'] = used_web_search
        return result
