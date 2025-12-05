import json
from ..utils.openai_client import DaatOpenAIClient
from ..utils.tavily_client import TavilySearchClient
from .market_research import Phase1MarketResearch
from .critical_analysis import Phase2CriticalAnalysis
from .scoring import Phase3Scoring
from .strategic_advice import Phase4StrategicAdvice
from .prompts import PROMPT_FINAL_COMPILATION

class DaatAnalysisEngine:
    def __init__(self):
        self.openai_client = DaatOpenAIClient()
        self.tavily_client = TavilySearchClient()
        
        # Initialize Phase Handlers
        self.phase1 = Phase1MarketResearch(self.openai_client, self.tavily_client)
        self.phase2 = Phase2CriticalAnalysis(self.openai_client)
        self.phase3 = Phase3Scoring(self.openai_client)
        self.phase4 = Phase4StrategicAdvice(self.openai_client)

    def generate_complete_analysis(self, startup_data):
        if not self.openai_client.client:
             return {
                "score": 0,
                "feedback": "⚠️ **Modo Offline**: A chave da API OpenAI não foi encontrada."
            }

        try:
            # FASE 1: Pesquisa de Mercado
            print("🔍 Fase 1: Pesquisando mercado...")
            market_research = self.phase1.execute(startup_data)
            
            # FASE 2: Análise Crítica
            print("🎯 Fase 2: Análise crítica...")
            critical_analysis = self.phase2.execute(startup_data, market_research)
            
            # FASE 3: Scoring
            print("📊 Fase 3: Calculando score...")
            scoring = self.phase3.execute(market_research, critical_analysis)
            
            # FASE 4: Conselho Estratégico
            print("💡 Fase 4: Gerando conselhos...")
            strategic_advice = self.phase4.execute(scoring, market_research, critical_analysis)
            
            # FASE 5: Compilação Final (Incorporada aqui ou separada)
            print("📄 Fase 5: Compilando relatório...")
            compilation_result = self._phase_5_compile(
                scoring,
                market_research,
                critical_analysis,
                strategic_advice
            )
            
            return {
                "score": scoring.get('final_score', 0),
                "feedback": compilation_result.get('feedback_text', '')
            }
            
        except Exception as e:
            print(f"❌ Erro na análise: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                "score": 0,
                "feedback": f"### ⚠️ Erro na Análise\n\nOcorreu um problema técnico durante o processamento do seu diagnóstico.\n\n**Detalhes do erro:** {str(e)}"
            }

    def _phase_5_compile(self, scoring, market_research, critical_analysis, strategic_advice):
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
        
        from django.conf import settings
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        model = ai_config.get('model', 'gpt-4o-mini')
        # Fase 5 não tinha temperatura específica, vamos usar a de strategic ou um padrão 0.3
        temp = 0.3
        
        response = self.openai_client.client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": "Compile o relatório final com base nos dados fornecidos."}
            ],
            temperature=temp
        )
        
        return {
            'feedback_text': response.choices[0].message.content
        }

# Wrapper function
def analyze_idea(segment, problem, proposition):
    engine = DaatAnalysisEngine()
    startup_data = {
        "sector": segment,
        "problem": problem,
        "proposition": proposition
    }
    return engine.generate_complete_analysis(startup_data)
