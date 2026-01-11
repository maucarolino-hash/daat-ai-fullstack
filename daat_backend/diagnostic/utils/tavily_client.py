from tavily import TavilyClient
from django.conf import settings
import time
import logging

logger = logging.getLogger(__name__)

class TavilySearchClient:
    """
    Wrapper robusto para Tavily API com retry logic e tratamento de erros
    """
    
    def __init__(self):
        self.client = TavilyClient(api_key=settings.TAVILY_API_KEY)
        self.max_retries = 3
        self.retry_delay = 2  # segundos
    
    def search(self, query, max_results=5, search_depth='advanced'):
        """
        Executa pesquisa com retry logic
        
        Args:
            query (str): Query de pesquisa
            max_results (int): Número máximo de resultados
            search_depth (str): 'basic' ou 'advanced'
            
        Returns:
            dict: Resultados da pesquisa ou None se falhar
        """
        for attempt in range(self.max_retries):
            try:
                # Limit query length to 390 to be safe (API max is 400)
                if len(query) > 390:
                    logger.warning(f"⚠️ Query truncada: {len(query)} chars -> 390 chars")
                    query = query[:390]
                
                logger.info(f"🔍 Pesquisando: '{query}' (tentativa {attempt + 1}/{self.max_retries})")
                
                result = self.client.search(
                    query=query,
                    search_depth=search_depth,
                    max_results=max_results,
                    include_domains=settings.SEARCH_SETTINGS.get('include_domains', []),
                    exclude_domains=settings.SEARCH_SETTINGS.get('exclude_domains', [])
                )
                
                logger.info(f"✅ Pesquisa concluída: {len(result.get('results', []))} resultados")
                return result
                
            except Exception as e:
                logger.error(f"❌ Erro na tentativa {attempt + 1}: {str(e)}")
                
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                else:
                    logger.error(f"🚫 Falha após {self.max_retries} tentativas")
                    return None
    
    def search_multiple(self, queries, max_results=5):
        """
        Executa múltiplas pesquisas e agrega resultados
        
        Args:
            queries (list): Lista de queries
            max_results (int): Resultados por query
            
        Returns:
            list: Lista de dicts com query e resultados
        """
        all_results = []
        
        for query in queries:
            result = self.search(query, max_results)
            
            if result:
                all_results.append({
                    'query': query,
                    'results': result.get('results', []),
                    'answer': result.get('answer', ''),  # Tavily retorna resumo
                    'images': result.get('images', [])
                })
            else:
                all_results.append({
                    'query': query,
                    'results': [],
                    'error': 'Pesquisa falhou'
                })
            
            # Rate limiting: pequena pausa entre queries
            time.sleep(0.5)
        
        return all_results
    
    def extract_key_facts(self, search_results):
        """
        Extrai fatos-chave dos resultados de pesquisa
        
        Args:
            search_results (list): Resultados de search_multiple
            
        Returns:
            dict: Fatos estruturados extraídos
        """
        all_urls = []
        all_content = []
        all_answers = []
        
        for search in search_results:
            if search.get('answer'):
                all_answers.append({
                    'query': search['query'],
                    'answer': search['answer']
                })
            
            for result in search.get('results', []):
                all_urls.append(result.get('url'))
                all_content.append({
                    'title': result.get('title'),
                    'content': result.get('content'),
                    'url': result.get('url'),
                    'score': result.get('score', 0)
                })
        
        return {
            'total_sources': len(all_urls),
            'unique_domains': len(set([url.split('/')[2] for url in all_urls if url])),
            'answers': all_answers,
            'top_content': sorted(all_content, key=lambda x: x.get('score', 0), reverse=True)[:10],
            'all_urls': all_urls
        }
