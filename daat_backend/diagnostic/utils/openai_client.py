from openai import OpenAI
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class OpenAIClient:
    """
    Wrapper para OpenAI com configuração consistente
    """
    
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.default_model = settings.AI_SETTINGS['model']
    
    def create_completion(self, system_prompt, user_message, temperature=0.3, 
                         model=None, response_format=None, max_tokens=4000):
        """
        Cria completion com configuração padrão
        
        Args:
            system_prompt (str): Prompt do sistema
            user_message (str): Mensagem do usuário
            temperature (float): Temperatura (0-1)
            model (str): Modelo a usar
            response_format (dict): Formato de resposta
            max_tokens (int): Máximo de tokens
            
        Returns:
            str: Conteúdo da resposta
        """
        try:
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
            
            params = {
                "model": model or self.default_model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens
            }
            
            if response_format:
                params["response_format"] = response_format
            
            logger.info(f"🤖 Chamando OpenAI ({params['model']}, temp={temperature})")
            
            response = self.client.chat.completions.create(**params)
            
            content = response.choices[0].message.content
            
            logger.info(f"✅ OpenAI respondeu ({len(content)} chars)")
            
            return content
            
        except Exception as e:
            logger.error(f"❌ Erro na chamada OpenAI: {str(e)}")
            raise
