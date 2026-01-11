import os
import django
import sys
from pathlib import Path

# Setup Django Environment
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()

from diagnostic.utils.tavily_client import TavilySearchClient

def test_tavily_truncation():
    print("--- Testing Tavily Client Truncation ---")
    client = TavilySearchClient()
    
    # Generate a massive query (600 chars)
    massive_query = "This is a massive query " * 30
    print(f"Original Query Length: {len(massive_query)}")
    
    result = client.search(massive_query)
    
    if result and 'results' in result:
        print("✅ Search Successful! (Truncation worked)")
        print(f"Results Count: {len(result['results'])}")
    else:
        print("❌ Search Failed!")
        print(f"Result: {result}")

if __name__ == "__main__":
    test_tavily_truncation()
