import os
from django.conf import settings
from tavily import TavilyClient

class DaatTavilyClient:
    def __init__(self):
        tavily_key = getattr(settings, 'TAVILY_API_KEY', os.getenv('TAVILY_API_KEY'))
        self.client = TavilyClient(api_key=tavily_key) if tavily_key else None
        self.search_settings = getattr(settings, 'SEARCH_SETTINGS', {})

    def search(self, query, max_results=None, search_depth=None):
        if not self.client:
            raise Exception("Tavily API key not configured")
        
        # Use args if provided, otherwise fallback to settings, then defaults
        limit = max_results or self.search_settings.get('max_results_per_query', 3)
        depth = search_depth or self.search_settings.get('search_depth', 'basic')
        exclude = self.search_settings.get('exclude_domains', [])
        
        try:
            return self.client.search(
                query=query,
                search_depth=depth,
                max_results=limit,
                exclude_domains=exclude
            )
        except Exception as e:
            # Re-raise or handle as needed, but for now we just pass it up
            raise e
