import os
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

class DaatTavilyClient:
    def __init__(self):
        tavily_key = os.getenv('TAVILY_API_KEY')
        self.client = TavilyClient(api_key=tavily_key) if tavily_key else None

    def search(self, query, max_results=3, search_depth="basic"):
        if not self.client:
            raise Exception("Tavily API key not configured")
        
        try:
            return self.client.search(
                query=query,
                search_depth=search_depth,
                max_results=max_results
            )
        except Exception as e:
            # Re-raise or handle as needed, but for now we just pass it up
            raise e
