import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class DaatOpenAIClient:
    def __init__(self):
        api_key = os.getenv('OPENAI_API_KEY')
        self.client = OpenAI(api_key=api_key) if api_key else None
    
    def get_client(self):
        return self.client
