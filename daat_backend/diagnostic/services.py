import os
import json
import openai
from dotenv import load_dotenv

load_dotenv()

def analyze_idea(segment, problem, proposition):
    api_key = os.getenv("OPENAI_API_KEY")
    
    if not api_key:
        return _fallback_logic(segment, problem, proposition)

    try:
        client = openai.OpenAI(api_key=api_key)
        
        system_prompt = """
Tu és o Daat, um Venture Capitalist que odeia perder dinheiro. 
A tua premissa base é: "Esta startup vai falhar, a menos que me provem o contrário".

ALGORITMO DE PONTUAÇÃO (Rigoroso):
1. Ideia vaga (uma frase) = Max 30/100.
2. Ideia clara mas sem dados de mercado = Max 60/100.
3. Só podes dar >80/100 se o utilizador mencionar métricas reais (Receita, CAC, LTV) ou Mínimo Produto Viável (MVP) já lançado.
4. Se a ideia parecer "genérica" (ex: Uber para X, Tinder para Y), penaliza em -20 pontos.

O teu output tem de ser APENAS o JSON: {"score": <int>, "feedback": "<string bruta>"}
"""
        
        user_content = f"Segmento: {segment}\nProblema: {problem}\nProposta de Valor: {proposition}"

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            temperature=0.2,
        )

        content = response.choices[0].message.content.strip()
        
        # Remove markdown code blocks if present
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
            
        return json.loads(content.strip())

    except Exception as e:
        print(f"Erro na OpenAI API: {e}")
        return _fallback_logic(segment, problem, proposition)

def _fallback_logic(segment, problem, proposition):
    # Lógica simples de simulação
    total_len = len(segment) + len(problem) + len(proposition)
    score = min(100, max(10, int(total_len / 2))) # Score baseado no tamanho, capped 100
    
    return {
        "score": score,
        "feedback": "Modo de Simulação: Adicione uma OPENAI_API_KEY para análise real com IA."
    }
