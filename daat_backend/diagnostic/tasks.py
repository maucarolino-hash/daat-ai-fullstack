from celery import shared_task
from openai import OpenAI
from tavily import TavilyClient
import os
import json
from django.conf import settings
from django.contrib.auth.models import User
from .models import Diagnostic

@shared_task
def analyze_startup_task(segment, problem, proposition, user_id):
    # Clientes
    api_key = os.getenv('OPENAI_API_KEY')
    tavily_key = os.getenv('TAVILY_API_KEY')
    
    client = OpenAI(api_key=api_key)
    tavily = TavilyClient(api_key=tavily_key) if tavily_key else None

    # 1. Busca Web (Tavily)
    import time
    start_time = time.time()
    print("DEBUG: Iniciando Tavily...")
    
    web_context_str = ""
    if tavily:
        try:
            query = f"market size competitors trends for {segment} {proposition} startup brazil"
            search = tavily.search(query=query, search_depth="basic", max_results=3)
            web_context = []
            for result in search.get('results', []):
                web_context.append(f"- {result['title']}: {result['content']}")
            web_context_str = "\n".join(web_context)
            print(f"DEBUG: Tavily concluiu em {time.time() - start_time:.2f}s")
        except Exception as e:
            print(f"Erro Tavily: {e}")
            web_context_str = "Sem dados de web."
    else:
        web_context_str = "Modo Offline (Sem Tavily)."
        print("DEBUG: Tavily pulado (Sem chave).")

    # 2. Prompt (O mesmo de antes - Robusto)
    system_prompt = f"""
    Você é um Investidor de Risco Sênior e Especialista em Produto.
    
    CONTEXTO DE MERCADO ATUAL (FONTE REAL):
    {web_context_str}
    
    INSTRUÇÕES:
    Analise a startup abaixo. Use os dados de mercado acima para citar concorrentes REAIS e tendências ATUAIS se aplicável.
    Seja brutalmente honesto. Se a ideia já existe (ex: Uber, iFood), diga claramente.
    
    FORMATO DE SAÍDA (JSON estrito):
    {{
        "score": (inteiro 0-100),
        "risco_nivel": ("Baixo", "Médio", "Alto", "Crítico"),
        "analise_mercado": "Texto curto citando dados reais ou concorrentes encontrados.",
        "pontos_fortes": ["ponto 1", "ponto 2", "ponto 3"],
        "pontos_fracos": ["ponto 1", "ponto 2", "ponto 3"],
        "veredito": "Texto final direto ao fundador."
    }}
    """

    user_prompt = f"""
    Segmento: {segment}
    Problema: {problem}
    Solução: {proposition}
    """

    # 3. OpenAI
    try:
        openai_start = time.time()
        print("DEBUG: Iniciando OpenAI...")
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        print(f"DEBUG: OpenAI concluiu em {time.time() - openai_start:.2f}s")
        
        analysis_json = json.loads(response.choices[0].message.content)
        
        # Formatar para o padrão que o Frontend espera (Markdown)
        feedback_markdown = f"""
### 📊 Análise de Mercado (Baseada em Dados Reais)
{analysis_json.get('analise_mercado', 'N/A')}

### 🛡️ Nível de Risco: **{analysis_json.get('risco_nivel', 'N/A')}**

### ✅ Pontos Fortes
{chr(10).join([f'- {p}' for p in analysis_json.get('pontos_fortes', [])])}

### ⚠️ Pontos Fracos
{chr(10).join([f'- {p}' for p in analysis_json.get('pontos_fracos', [])])}

### 🎯 Veredito Final
{analysis_json.get('veredito', 'N/A')}
        """
        
        # Salvar no Banco de Dados (Histórico)
        try:
            user = User.objects.get(id=user_id)
            Diagnostic.objects.create(
                user=user,
                customer_segment=segment,
                problem=problem,
                value_proposition=proposition,
                score=analysis_json.get('score', 0),
                feedback=feedback_markdown.strip()
            )
        except Exception as db_err:
            print(f"Erro ao salvar histórico: {db_err}")

        return {
            "score": analysis_json.get('score', 0),
            "feedback": feedback_markdown.strip()
        }

    except Exception as e:
        return {
            "score": 0,
            "feedback": f"Erro na IA: {str(e)}"
        }
