import sys
import os
import django
import json

# Setup Django
# Adiciona o diretório raiz do projeto ao path (dois níveis acima de scripts/test_phase1.py)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()

from diagnostic.services.market_research import Phase1MarketResearch
from diagnostic.utils.openai_client import OpenAIClient
from diagnostic.utils.tavily_client import TavilySearchClient

def test_daat_ai_analysis():
    """
    Testa análise do próprio Daat AI
    """
    startup_data = {
        'name': 'Daat AI',
        'description': '''
        Plataforma SaaS que automatiza validação de startups para aceleradoras.
        Combina análise de IA com pesquisa real de mercado para gerar relatórios
        estruturados em 30 segundos. Diferencial: scoring padronizado e capacidade
        preditiva através de tracking de resultados.
        ''',
        'sector': 'SaaS B2B - Startup Tools',
        'proposition': 'AI-powered startup validation platform', # Adapted key
        'solution_type': 'AI-powered startup validation platform',
        'target_audience': 'Gestores de aceleradoras, fundos early-stage, programas de inovação',
        'business_model': 'Assinatura anual por instituição (R$ 20-150K/ano)',
        'geography': 'Brazil'
    }
    
    print("=" * 80)
    print("🧪 TESTANDO FASE 1: PESQUISA DE MERCADO")
    print("=" * 80)
    print(f"\nStartup: {startup_data['name']}")
    print(f"Setor: {startup_data['sector']}")
    print("\n" + "=" * 80)
    
    # Instanciando dependências
    try:
        openai_client = OpenAIClient()
        tavily_client = TavilySearchClient()
        service = Phase1MarketResearch(openai_client=openai_client, tavily_client=tavily_client)
        
        result = service.execute(startup_data)
        
        print("\n📊 RESULTADOS:\n")
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
        print("\n" + "=" * 80)
        print(f"✅ Qualidade dos Dados: {result.get('data_quality_score', 0)}/10")
        print(f"📚 Fontes Analisadas: {result.get('search_summary', {}).get('total_sources_analyzed', 0)}")
        if 'competitors' in result:
            print(f"🏢 Concorrentes Encontrados: {len(result['competitors'])}")
        print("=" * 80)
        
    except Exception as e:
        print(f"\n❌ ERRO FATAL: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_daat_ai_analysis()
