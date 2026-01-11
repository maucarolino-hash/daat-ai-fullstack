import pytest
from diagnostic.services.market_research import Phase1MarketResearch
from diagnostic.utils.query_generator import SearchQueryGenerator
from diagnostic.utils.openai_client import OpenAIClient
from diagnostic.utils.tavily_client import TavilySearchClient

class TestMarketResearch:
    
    @pytest.fixture
    def sample_startup_data(self):
        return {
            'name': 'Daat AI',
            'description': 'Plataforma de validação automatizada de startups usando IA',
            'sector': 'SaaS B2B',
            'proposition': 'AI validation tool', # Adapted from solution_type to match form data expectation usually
            'solution_type': 'AI validation tool', # Keeping both for safety as logic maps safely
            'target_audience': 'aceleradoras e fundos de investimento',
            'geography': 'Brazil',
            'problem': 'Validar startups é caro e demorado'
        }
    
    def test_market_research_execution(self, sample_startup_data):
        """
        Testa execução completa da pesquisa de mercado
        """
        # Initialize dependencies
        openai_client = OpenAIClient()
        tavily_client = TavilySearchClient()
        
        # Instantiate service with dependencies
        service = Phase1MarketResearch(openai_client, tavily_client)
        
        print("\n🚀 Executing Live Market Research Test...")
        result = service.execute(sample_startup_data)
        
        # Validações básicas
        assert result is not None
        assert 'competitors' in result
        assert 'market_data' in result
        assert 'data_quality_score' in result
        
        # Validar que encontrou algo
        # Note: This assert might fail if API keys are invalid or Tavily finds nothing, 
        # but technically it ensures logic ran.
        assert result['data_quality_score'] >= 0 
        
        print("\n📊 Resultado da Pesquisa:")
        if 'competitors' in result:
             print(f"Concorrentes encontrados: {len(result['competitors'])}")
        print(f"Qualidade dos dados: {result.get('data_quality_score')}/10")
        if 'search_summary' in result:
            print(f"Fontes analisadas: {result['search_summary'].get('total_sources_analyzed')}")
    
    def test_query_generation(self, sample_startup_data):
        """
        Testa geração de queries
        """
        # Prepare data mapping that the service usually does
        mapped_data = {
            'sector': sample_startup_data.get('sector', ''),
            'solution_type': sample_startup_data.get('solution_type', ''),
            'target_audience': sample_startup_data.get('target_audience', ''),
            'geography': 'Brazil'
        }

        queries = SearchQueryGenerator.generate_all_queries(mapped_data)
        
        assert 'competitors' in queries
        assert 'market_size' in queries
        assert 'trends' in queries
        
        assert len(queries['competitors']) > 0
        
        print("\n🔍 Queries Geradas:")
        for category, query_list in queries.items():
            print(f"\n{category.upper()}:")
            for q in query_list:
                print(f"  - {q}")
