import os
import json
from openai import OpenAI
from django.conf import settings
from dotenv import load_dotenv

load_dotenv()

# Configuração do Cliente (ajuste conforme sua versão da lib)
# client = OpenAI(api_key=os.getenv('OPENAI_API_KEY')) # REMOVIDO DO ESCOPO GLOBAL

def analyze_idea(segment, problem, proposition):
    api_key = os.getenv('OPENAI_API_KEY')
    
    # Fallback se não houver chave
    if not api_key:
        print("AVISO: OPENAI_API_KEY não encontrada. Usando fallback.")
        return {
            "score": 0,
            "feedback": "⚠️ **Modo Offline**: A chave da API OpenAI não foi encontrada.\n\nPor favor, crie um arquivo `.env` na pasta `daat_backend` com `OPENAI_API_KEY=sk-...` ou configure a variável de ambiente."
        }

    client = OpenAI(api_key=api_key)
    # O NOVO CÉREBRO "ARQUITETO LIVRE"
    system_prompt = """
    Atue como um Arquiteto Sênior de IA e Validador de Negócios Cético.
    
    SEU OBJETIVO:
    Analisar a ideia com objetividade extrema. O score deve refletir a dificuldade de execução, não apenas a beleza da ideia.
    
    ALGORITMO DE PONTUAÇÃO (RIGOROSO):
    1. Base: Comece com 50 pontos.
    2. Problema/Solução (+0 a 20): A dor é real e aguda?
    3. Mercado (+0 a 10): O mercado está crescendo?
    4. Modelo de Negócio (+0 a 20): É escalável? (SaaS escala fácil = +20. Consultoria/Serviço = +5).
    
    PENALIDADES OBRIGATÓRIAS (O "Reality Check"):
    - Se envolver LOGÍSTICA FÍSICA ou ESTOQUE: Subtraia -15 pontos (Difícil escalar).
    - Se envolver PRODUTOS PERECÍVEIS (Comida): Subtraia -10 pontos (Risco sanitário/perda).
    - Se envolver HARDWARE: Subtraia -20 pontos (Custo inicial alto).
    - Se depender de PARCERIAS COMPLEXAS (Governo, Grandes Empresas): Subtraia -10 pontos.
    
    DIRETRIZES DE FEEDBACK:
    - Se o score for < 70, a "Crítica Brutal" deve ser o destaque.
    - Identifique gargalos operacionais (não apenas de marketing).
    
    SAÍDA OBRIGATÓRIA (JSON):
    Você NÃO deve responder com texto solto. Você deve responder APENAS com um JSON válido seguindo este esquema exato:
    {
        "score": <Inteiro calculado com base nas penalidades>,
        "feedback": "<Análise completa em Markdown>"
    }
    """

    user_message = f"""
    Segmento: {segment}
    Problema: {problem}
    Solução/Proposta: {proposition}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", 
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.3, 
        )

        content = response.choices[0].message.content
        
        # --- CORREÇÃO DE SEGURANÇA (SANITIZAÇÃO) ---
        # Às vezes o GPT envia ```json no começo. Vamos limpar.
        if content.startswith("```json"):
            content = content.replace("```json", "").replace("```", "")
        elif content.startswith("```"):
            content = content.replace("```", "")
        
        # Remove espaços em branco extras
        content = content.strip()
        # -------------------------------------------

        result = json.loads(content)
        return result

    except json.JSONDecodeError as e:
        print(f"Erro de JSON da IA: {e}")
        print(f"Conteúdo recebido: {content}") # Ajuda no debug
        return {
            "score": 50,
            "feedback": f"A IA gerou uma análise, mas houve um erro técnico na formatação. Tente novamente.\n\nConteúdo Bruto:\n{content}"
        }

    except Exception as e:
        print(f"Erro Geral no Cérebro: {e}")
        return {
            "score": 0,
            "feedback": f"Erro crítico no servidor. Detalhes: {str(e)}"
        }
