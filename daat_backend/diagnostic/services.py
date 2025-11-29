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
    Atue como um Arquiteto Sênior de IA e Validador de Negócios.
    
    PROTOCOLO DE SEGURANÇA (LEIA ISTO PRIMEIRO):
    Antes de analisar, verifique a qualidade do input.
    SE o usuário digitou texto aleatório (ex: "asdf", "123", "teste"), letras soltas ou frases sem sentido semântico:
    -> RETORNE IMEDIATAMENTE UM SCORE DE 0 A 10.
    -> O Feedback deve ser: "Não foi possível identificar um modelo de negócio coerente. Por favor, descreva o problema e a solução com mais detalhes."
    -> NÃO tente inventar ou alucinar uma análise para dados ruins.
    
    SE (e somente se) os dados forem coerentes, siga o protocolo padrão:
    
    SEU OBJETIVO:
    Analisar a ideia de negócio do usuário com objetividade extrema.
    Não elogie. Seja técnico, direto e brutalmente honesto.
    
    DIRETRIZES DE ARQUITETURA (LIVRE ESCOLHA):
    - Você tem TOTAL LIBERDADE para recomendar a stack técnica ideal para este caso específico (No-Code, Low-Code, Code-Based, Mobile Nativo, etc.).
    - Não force o uso de Bubble se não for a melhor opção.
    - Se a ideia exigir alta performance/escala, sugira código (React/Python/Go).
    - Se a ideia for um MVP simples, sugira ferramentas rápidas (Glide/Softr/Bubble).
    - Mantenha o foco no cenário Brasil (custos em Real, latência, APIs acessíveis).
    
    FORMATO DA ANÁLISE (O Texto do Feedback deve seguir esta estrutura):
    1. Resumo Executivo (Curto e grosso)
    2. Arquitetura Recomendada (A melhor stack para ESTE problema específico e porquê)
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
