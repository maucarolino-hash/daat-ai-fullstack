import os
import json
from openai import OpenAI
from django.conf import settings

# Configuração do Cliente (ajuste conforme sua versão da lib)
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def analyze_idea(segment, problem, proposition):
    # O NOVO CÉREBRO "ALTA PERFORMANCE"
    system_prompt = """
    Atue como um Arquiteto Sênior de IA Aplicada a Produtos Digitais e Advogado do Diabo.
    
    SEU OBJETIVO:
    Analisar a ideia de negócio do usuário com objetividade extrema, identificando falhas, riscos técnicos e gaps de mercado.
    Não elogie. Seja técnico, direto e brutalmente honesto.
    
    RESTRIÇÕES REAIS:
    - Cenário: Brasil.
    - Orçamento: Quase zero (Bootstrapping).
    - Stack Sugerida: No-Code (Bubble), APIs baratas, LLMs acessíveis.
    
    FORMATO DA ANÁLISE (O Texto do Feedback deve seguir esta estrutura):
    1. Resumo Executivo (Curto e grosso)
    2. Arquitetura Recomendada (Stack técnica realista)
    3. Plano de Validação (4 semanas)
    4. Crítica Brutal (Onde isso vai falhar?)
    
    SAÍDA OBRIGATÓRIA (JSON):
    Você NÃO deve responder com texto solto. Você deve responder APENAS com um JSON válido seguindo este esquema exato:
    {
        "score": <Inteiro de 0 a 100 baseado na viabilidade técnica e clareza>,
        "feedback": "<A análise completa formatada em Markdown (use quebras de linha \\n)>"
    }
    """

    user_message = f"""
    Segmento: {segment}
    Problema: {problem}
    Solução/Proposta: {proposition}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", # Ou gpt-4o-mini para ser mais inteligente
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.3, # Baixa criatividade para manter o rigor técnico
            # response_format={"type": "json_object"} # Descomente se usar modelo gpt-4o ou gpt-3.5-turbo-1106+
        )

        content = response.choices[0].message.content
        
        # Parse do JSON para garantir que o Python entende
        result = json.loads(content)
        
        return result

    except Exception as e:
        print(f"Erro no Cérebro: {e}")
        # Fallback de emergência se a IA falhar
        return {
            "score": 0,
            "feedback": f"Erro ao processar análise avançada. Detalhes: {str(e)}. Tente novamente."
        }
