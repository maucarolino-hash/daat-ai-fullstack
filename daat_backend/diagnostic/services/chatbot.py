import json
from ..utils.openai_client import OpenAIClient

class ChatbotService:
    def __init__(self):
        self.openai_client = OpenAIClient()

    def answer_question(self, context_data, question):
        """
        Uses OpenAI to answer a question based on the provided JSON context.
        """
        try:
            # Format context for the prompt
            # We assume context_data is already a dict (the report)
            context_str = json.dumps(context_data, indent=2, ensure_ascii=False)
            
            system_prompt = f"""
            Você é um assistente especialista em Inteligência de Mercado e Estratégia de Negócios.
            Sua função é responder perguntas do usuário BASEADO EXCLUSIVAMENTE nos dados do relatório fornecido abaixo.
            
            Se a resposta não estiver no relatório, diga "Desculpe, não encontrei essa informação na análise realizada."
            Seja direto, profissional e use formatação Markdown (negrito, listas) para facilitar a leitura.
            
            DADOS DO RELATÓRIO:
            {context_str}
            """
            
            response = self.openai_client.create_completion(
                system_prompt=system_prompt,
                user_message=question,
                temperature=0.5
            )
            
            return response
            
        except Exception as e:
            print(f"Error in ChatbotService: {e}")
            return "Desculpe, ocorreu um erro ao processar sua pergunta."
