import os
import django
import sys
from pathlib import Path

# Setup Django Environment
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()

from diagnostic.services.market_research import Phase1MarketResearch
from diagnostic.utils.tavily_client import TavilySearchClient
from diagnostic.utils.openai_client import OpenAIClient
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('diagnostic')
logger.setLevel(logging.INFO)

def test_analysis():
    print("--- Testing Phase 1 Market Research ---")
    try:
        tavily = TavilySearchClient()
        openai = OpenAIClient()
        agent = Phase1MarketResearch(openai_client=openai, tavily_client=tavily)
        
        # Simple test query
        data = {
            'segment': "Padaria Gourmet",
            'proposition': "Pão artesanal de fermentação natural",
            'target_audience': "Amantes de gastronomia",
            'problem': "Falta de pão de qualidade na região"
        }
        
        print("Executing analysis (this may take 10-20 seconds)...")
        result = agent.execute(data)
        
        if result and not result.get('fallback_mode'):
            print("✅ Analysis Successful!")
            print(f"Quality Score: {result.get('data_quality_score')}")
            print(f"Competitors Found: {len(result.get('competitors', []))}")
        else:
            print("⚠️ Analysis returned fallback or empty.")
            if result:
                print(f"Error Reason: {result.get('error')}")
                print(f"Full Result Keys: {result.keys()}")
    except Exception as e:
        print(f"❌ Analysis Failed with Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_analysis()
