import os
import json
from openai import OpenAI
from tavily import TavilyClient
from django.conf import settings
from dotenv import load_dotenv
from .prompts import (
    PROMPT_PHASE_1_MARKET_RESEARCH,
    PROMPT_PHASE_2_CRITICAL_ANALYSIS,
    PROMPT_PHASE_3_SCORING,
    PROMPT_PHASE_4_STRATEGIC_ADVICE,
    PROMPT_FINAL_COMPILATION
)

load_dotenv()

class DaatAnalysisEngine:
    def __init__(self):
        api_key = os.getenv('OPENAI_API_KEY')
        tavily_key = os.getenv('TAVILY_API_KEY')
        self.openai_client = OpenAI(api_key=api_key) if api_key else None
        self.tavily_client = TavilyClient(api_key=tavily_key) if tavily_key else None

    def generate_complete_analysis(self, startup_data):
        """
        Orquestra a geração completa do relatório em múltiplas fases
        """
        if not self.openai_client:
             return {
                "score": 0,
                "feedback": "⚠️ **Modo Offline**: A chave da API OpenAI não foi encontrada."
            }

        try:
            # FASE 1: Pesquisa de Mercado com Tavily
            print("🔍 Fase 1: Pesquisando mercado...")
            market_research = self.phase_1_market_research(startup_data)
            
            # FASE 2: Análise Crítica
            print("🎯 Fase 2: Análise crítica...")
            critical_analysis = self.phase_2_critical_analysis(
                startup_data, 
                market_research
            )
            
            # FASE 3: Scoring
            print("📊 Fase 3: Calculando score...")
            scoring = self.phase_3_scoring(
                market_research,
                critical_analysis
            )
            
            # FASE 4: Conselho Estratégico
            print("💡 Fase 4: Gerando conselhos...")
            strategic_advice = self.phase_4_strategic_advice(
                scoring, # Passando scoring primeiro conforme metodo, mas vou ajustar para assinatura correta
                market_research,
                critical_analysis
            )
            
            # FASE 5: Compilação Final
            print("📄 Fase 5: Compilando relatório...")
            compilation_result = self.phase_5_compile(
                scoring,
                market_research,
                critical_analysis,
                strategic_advice
            )

            # Formatar retorno para compatibilidade com Frontend
            # O frontend espera: { "score": number, "feedback": markdown_string }
            
            return {
                "score": scoring.get('final_score', 0),
                "feedback": compilation_result.get('feedback_text', '')
            }
            
        except Exception as e:
            print(f"❌ Erro na análise: {str(e)}")
            # Fallback gracioso para erro geral
            return {
                "score": 0,
                "feedback": f"### ⚠️ Erro na Análise\n\nOcorreu um problema técnico durante o processamento do seu diagnóstico. Nossa equipe foi notificada.\n\n**Detalhes do erro:** {str(e)}"
            }
    
    def _execute_tavily_searches(self, search_queries):
        """Helper para executar buscas no Tavily com tratamento de erro"""
        if not self.tavily_client:
            raise Exception("Tavily API key not configured")
            
        search_results_list = []
        for query in search_queries:
            try:
                result = self.tavily_client.search(
                    query=query,
                    search_depth="basic", 
                    max_results=3
                )
                search_results_list.append({
                    'query': query,
                    'results': result.get('results', [])
                })
            except Exception as e:
                print(f"⚠️ Erro pontual na pesquisa '{query}': {str(e)}")
                # Continua para as próximas queries mesmo se uma falhar
        
        if not search_results_list:
            raise Exception("Nenhuma pesquisa retornou resultados")
            
        return search_results_list

    def phase_1_market_research(self, startup_data):
        """
        Fase 1: Pesquisa de mercado usando Tavily com Fallback
        """
        sector = startup_data.get('sector', '')
        solution_type = startup_data.get('proposition', '')
        
        search_results_list = []
        used_web_search = False

        try:
            # Construir queries de pesquisa
            search_queries = [
                f"{sector} competitors Brazil 2024",
                f"{solution_type} similar companies",
                f"{sector} market size Brazil",
                f"{solution_type} startups funding"
            ]
            
            search_results_list = self._execute_tavily_searches(search_queries)
            used_web_search = True
            
        except Exception as e:
            print(f"⚠️ Tavily falhou ou não configurado: {str(e)}")
            # Fallback: segue sem dados de web
            search_results_list = [{"query": "fallback", "results": "Pesquisa web indisponível. Utilize conhecimento interno do modelo."}]
        
        # Processar resultados com GPT
        prompt = PROMPT_PHASE_1_MARKET_RESEARCH.format(
            startup_name="Startup em Análise",
            startup_description=f"Problema: {startup_data.get('problem')}. Solução: {startup_data.get('proposition')}",
            startup_sector=sector,
            business_model="Não especificado", 
            target_audience="Não especificado"
        )
        
        input_content = f"Resultados das pesquisas web:\n\n{json.dumps(search_results_list, indent=2, ensure_ascii=False)}"
        if not used_web_search:
            input_content = "⚠️ AVISO: Pesquisa web falhou. Gere estimativas baseadas em seu conhecimento de treinamento (cutoff date). Indique claramente que são estimativas."

        response = self.openai_client.chat.completions.create(
            model="gpt-4o-mini", 
            messages=[
                {
                    "role": "system",
                    "content": prompt
                },
                {
                    "role": "user",
                    "content": input_content
                }
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        result['used_web_search'] = used_web_search
        return result
    
    def phase_2_critical_analysis(self, startup_data, market_research):
        """
        Fase 2: Análise crítica baseada em dados de mercado
        """
        prompt = PROMPT_PHASE_2_CRITICAL_ANALYSIS.format(
            startup_data=json.dumps(startup_data, indent=2, ensure_ascii=False),
            market_research_results=json.dumps(market_research, indent=2, ensure_ascii=False)
        )
        
        response = self.openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": "Faça a análise crítica baseada nos dados fornecidos."}
            ],
            temperature=0.4,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
    
    def phase_3_scoring(self, market_research, critical_analysis):
        """
        Fase 3: Cálculo do score final
        """
        prompt = PROMPT_PHASE_3_SCORING.format(
            market_research_results=json.dumps(market_research, indent=2, ensure_ascii=False),
            critical_analysis_results=json.dumps(critical_analysis, indent=2, ensure_ascii=False)
        )
        
        response = self.openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": "Calcule o score final."}
            ],
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
    
    def phase_4_strategic_advice(self, scoring, market_research, critical_analysis):
        """
        Fase 4: Conselho estratégico
        """
        prompt = PROMPT_PHASE_4_STRATEGIC_ADVICE.format(
            final_score=scoring.get('final_score', 0),
            classification=scoring.get('classification', 'N/A'),
            market_research_results=json.dumps(market_research, indent=2, ensure_ascii=False),
            critical_analysis_results=json.dumps(critical_analysis, indent=2, ensure_ascii=False),
            score_breakdown=json.dumps(scoring.get('score_breakdown', {}), indent=2, ensure_ascii=False)
        )
        
        response = self.openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": "Forneça conselhos estratégicos."}
            ],
            temperature=0.5,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
    
    def phase_5_compile(self, scoring, market_research, critical_analysis, strategic_advice):
        """
        Fase 5: Compilação final em formato de relatório
        """
        # Formatação básica dos dados para injeção no prompt (pode ser refinada)
        market_fmt = json.dumps(market_research, indent=2, ensure_ascii=False)
        critical_fmt = json.dumps(critical_analysis, indent=2, ensure_ascii=False)
        strategic_fmt = json.dumps(strategic_advice, indent=2, ensure_ascii=False)

        prompt = PROMPT_FINAL_COMPILATION.format(
            final_score=scoring.get('final_score', 0),
            classification=scoring.get('classification', 'N/A'),
            market_research_formatted=market_fmt,
            critical_analysis_formatted=critical_fmt,
            strategic_advice_formatted=strategic_fmt
        )
        
        response = self.openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": "Compile o relatório final."}
            ],
            temperature=0.3
        )
        
        # O prompt pede texto formatado.
        compiled_text = response.choices[0].message.content
        
        return {
            'feedback_text': compiled_text
        }

# Wrapper function to maintain compatibility with existing calls
def analyze_idea(segment, problem, proposition):
    engine = DaatAnalysisEngine()
    startup_data = {
        "sector": segment,
        "problem": problem,
        "proposition": proposition
    }
    return engine.generate_complete_analysis(startup_data)
