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

    def create_completion(self, system_prompt, user_message, temperature=0.3, response_format=None, model="gpt-4o-mini"):
        """
        Helper para criar chat completions de forma simplificada
        """
        if not self.client:
            raise Exception("OpenAI client not initialized")
            
        kwargs = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            "temperature": temperature
        }
        
        if response_format:
            kwargs["response_format"] = response_format
            
        response = self.client.chat.completions.create(**kwargs)
        return response.choices[0].message.content
