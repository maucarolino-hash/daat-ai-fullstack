import os
from django.conf import settings
from openai import OpenAI

class DaatOpenAIClient:
    def __init__(self):
        # Prefer settings, fallback to env (though settings should have it)
        api_key = getattr(settings, 'OPENAI_API_KEY', os.getenv('OPENAI_API_KEY'))
        self.client = OpenAI(api_key=api_key) if api_key else None
    
    def get_client(self):
        return self.client
