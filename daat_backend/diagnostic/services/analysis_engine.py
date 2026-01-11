import json
from ..utils.openai_client import OpenAIClient
from ..utils.tavily_client import TavilySearchClient
from .market_research import Phase1MarketResearch
from .critical_analysis import Phase2CriticalAnalysis
from .scoring import Phase3Scoring
from .strategic_advice import Phase4StrategicAdvice
from .pitch_deck_analyzer import PitchDeckAnalyzer
from .prompts import PROMPT_FINAL_COMPILATION, PROMPT_VC_SCREENING_SINGLE
from django.conf import settings

class DaatAnalysisEngine:
    def __init__(self):
        self.openai_client = OpenAIClient()
        self.tavily_client = TavilySearchClient()
        
        # Initialize Phase Handlers
        self.deck_analyzer = PitchDeckAnalyzer(self.openai_client)
        self.phase1 = Phase1MarketResearch(self.openai_client, self.tavily_client)
        self.phase2 = Phase2CriticalAnalysis(self.openai_client)
        self.phase3 = Phase3Scoring(self.openai_client)
        self.phase4 = Phase4StrategicAdvice(self.openai_client)

    def generate_complete_analysis(self, startup_data):
        # We assume client is initialized; if not, wrapper handles error usually,
        # but let's check basic attr if we really want, or just rely on try/except block below.
        
        try:
            # FASE ESPECIAL: VC Batch Screening (Fast Lane)
            if startup_data.get('sector') == 'Batch Upload':
                return self.run_vc_batch_screening(startup_data)

            # FASE 0: Análise Estrutural do Pitch Deck (Se houver texto)
            deck_analysis = {}
            if startup_data.get('pitch_deck_text'):
                print("[INFO] Fase 0: Analisando estrutura do Pitch Deck...")
                deck_analysis = self.deck_analyzer.execute(startup_data['pitch_deck_text'])
                startup_data['deck_structure'] = deck_analysis
                
                print("[INFO] Fase 0.5: Extraindo métricas financeiras...")
                financial_analysis = self.deck_analyzer.analyze_financials(startup_data['pitch_deck_text'])
                startup_data['financial_analysis'] = financial_analysis

                print("[INFO] Fase 0.7: Extraindo tração...")
                traction_analysis = self.deck_analyzer.analyze_traction(startup_data['pitch_deck_text'])
                startup_data['traction_analysis'] = traction_analysis
                
                print("[INFO] Fase 0.9: Analisando TAM/SAM/SOM (Deck)...")
                # Sector might not be extracted yet if extraction happens later or comes from user input.
                # Assuming startup_data has sector or we pass a generic one.
                sector = startup_data.get('metrics', {}).get('sector', 'Tecnologia')
                market_sizing = self.deck_analyzer.analyze_market_sizing(startup_data['pitch_deck_text'], sector)
                startup_data['market_sizing_analysis'] = market_sizing

                print("[INFO] Fase 0.9.1: Analisando Problema...")
                problem_analysis = self.deck_analyzer.analyze_problem(startup_data['pitch_deck_text'])
                startup_data['problem_analysis'] = problem_analysis

                print("[INFO] Fase 0.9.2: Analisando Modelo de Negócio...")
                business_model = self.deck_analyzer.analyze_business_model(startup_data['pitch_deck_text'], sector)
                startup_data['business_model_analysis'] = business_model

                print("[INFO] Fase 0.9.3: Analisando Projeções Financeiras...")
                projections = self.deck_analyzer.analyze_financial_projections(startup_data['pitch_deck_text'])
                startup_data['financial_projections_analysis'] = projections

                print("[INFO] Fase 0.9.4: Crítica de Tração...")
                # Tentar inferir estágio ou usar padrão Seed
                estimated_stage = startup_data.get('metrics', {}).get('stage', 'Seed')
                traction_critique = self.deck_analyzer.analyze_traction_critique(startup_data['pitch_deck_text'], estimated_stage)
                startup_data['traction_critique'] = traction_critique

                print("[INFO] Fase 0.9.5: Analisando Crescimento...")
                growth_analysis = self.deck_analyzer.analyze_growth(startup_data['pitch_deck_text'], sector)
                startup_data['growth_analysis'] = growth_analysis

                print("[INFO] Fase 0.9.6: Analisando Equipe...")
                team_analysis = self.deck_analyzer.analyze_team(startup_data['pitch_deck_text'])
                startup_data['team_analysis'] = team_analysis

            # FASE 1: Pesquisa de Mercado
            print("[INFO] Fase 1: Pesquisando mercado...")
            market_research = self.phase1.execute(startup_data)
            
            # FASE 2: Análise Crítica
            print("[INFO] Fase 2: Analise critica...")
            critical_analysis = self.phase2.execute(startup_data, market_research)
            startup_data['critical_analysis'] = critical_analysis # Ensure it's in startup_data

            # FASE 2.1: Enrichment (Strengths, Weaknesses, Benchmarks) - Moved UP to feed Scoring
            sector_name = startup_data.get('sector', 'General') # Fallback
            if 'sector_adjustment' in startup_data:
                 sector_name = startup_data['sector_adjustment'].get('sector_detected', sector_name)
            
            print(f"[INFO] Fase 2.1: Sintetizando Pontos Fortes (Setor: {sector_name})...")
            strengths = self.deck_analyzer.analyze_strengths(startup_data['pitch_deck_text'], sector_name)
            startup_data['strengths_synthesis'] = strengths

            print(f"[INFO] Fase 2.2: Sintetizando Pontos Fracos...")
            weaknesses = self.deck_analyzer.analyze_weaknesses(startup_data['pitch_deck_text'], sector_name)
            startup_data['weaknesses_synthesis'] = weaknesses

            print(f"[INFO] Fase 2.3: Benchmarking Comparativo...")
            benchy = self.deck_analyzer.analyze_benchmarks(startup_data['pitch_deck_text'], sector_name)
            startup_data['benchmarking_analysis'] = benchy

            # FASE 3: Scoring (Explainable)
            print("[INFO] Fase 3: Calculando Score Final (Explainable)...")
            # Now Scoring has access to benchmarks and critical analysis in startup_data
            scoring = self.phase3.execute(startup_data, market_research, critical_analysis)
            startup_data['score_breakdown'] = scoring.get('score_breakdown', {})
            
            # FASE 3.1: Sector Adjustment (Optional/Legacy check)
            if 'score' in scoring:
                print(f"[INFO] Fase 3.1: Ajuste Setorial (Score Base: {scoring['score']})...")
                sector_adj = self.deck_analyzer.analyze_sector_adjustment(startup_data['pitch_deck_text'], scoring['score'])
                startup_data['sector_adjustment'] = sector_adj
                
                # Update final score if adjustment successful
                if sector_adj and 'adjusted_score' in sector_adj:
                     scoring['final_score_original'] = scoring['score'] # backup
                     scoring['score'] = sector_adj['adjusted_score'] 
                     scoring['classification'] = sector_adj['final_rating'] # Update classification

            # FASE 3.5: Gerando Executive Summary
            print(f"[INFO] Fase 3.5: Gerando Executive Summary...")
            exec_sum = self.deck_analyzer.generate_executive_summary(startup_data['pitch_deck_text'], sector_name)
            startup_data['executive_summary'] = exec_sum

            # Create context for Final Report
            context = {
                'executive_summary': startup_data.get('executive_summary'),
                'strengths_synthesis': startup_data.get('strengths_synthesis'),
                'weaknesses_synthesis': startup_data.get('weaknesses_synthesis'),
                'benchmarking_analysis': startup_data.get('benchmarking_analysis'),
                'score_breakdown': startup_data.get('score_breakdown')
            }
            
            print(f"[INFO] Fase 3.6: Gerando Relatório Estruturado Final...")
            struct_rep = self.deck_analyzer.generate_structured_report(startup_data['pitch_deck_text'], context)
            startup_data['structured_report'] = struct_rep

            # FASE 4: Conselho Estratégico
            print("[INFO] Fase 4: Gerando conselhos...")
            strategic_advice = self.phase4.execute(scoring, market_research, critical_analysis)
            
            # FASE 5: Compilação Final (Incorporada aqui ou separada)
            print("[INFO] Fase 5: Compilando relatorio...")
            compilation_result = self._phase_5_compile(
                scoring,
                market_research,
                critical_analysis,
                strategic_advice
            )
            
            # FASE 6: Derivação de VC Metrics (MVP Layer)
            final_score = scoring.get('final_score', 0)
            if final_score >= 80:
                recommendation = "Invest / Meeting"
            elif final_score >= 70:
                recommendation = "Watchlist"
            else:
                recommendation = "Pass"

            company_name = startup_data.get('deck_structure', {}).get('company_name', 'Unknown Startup')

            return {
                "score": final_score,
                "feedback": compilation_result.get('feedback_text', ''),
                "deck_analysis": startup_data.get('deck_structure', {}),
                "financial_analysis": startup_data.get('financial_analysis', {}),
                "traction_analysis": startup_data.get('traction_analysis', {}),
                "market_sizing_analysis": startup_data.get('market_sizing_analysis', {}),
                "problem_analysis": startup_data.get('problem_analysis', {}),
                "business_model_analysis": startup_data.get('business_model_analysis', {}),
                "financial_projections_analysis": startup_data.get('financial_projections_analysis', {}),
                "traction_critique": startup_data.get('traction_critique', {}),
                "growth_analysis": startup_data.get('growth_analysis', {}),
                "team_analysis": startup_data.get('team_analysis', {}),
                "sector_adjustment": startup_data.get('sector_adjustment', {}),
                "strengths_synthesis": startup_data.get('strengths_synthesis', {}),
                "weaknesses_synthesis": startup_data.get('weaknesses_synthesis', {}),
                "benchmarking_analysis": startup_data.get('benchmarking_analysis', {}),
                "executive_summary": startup_data.get('executive_summary', {}),
                "structured_report": startup_data.get('structured_report', {}),
                # VC MVP Fields
                "company_name": company_name,
                "recommendation": recommendation
            }
            
        except Exception as e:
            print(f"[ERROR] Erro na analise: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                "score": 0,
                "feedback": f"### Erro na Analise\n\nOcorreu um problema tecnico durante o processamento do seu diagnostico.\n\n**Detalhes do erro:** {str(e)}"
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
        
        # Using the wrapper method with JSON enforcement
        try:
            response_content = self.openai_client.create_completion(
                system_prompt=prompt,
                user_message="Compile o relatório final em JSON.",
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            
            # Parse JSON
            parsed_feedback = json.loads(response_content)
            
        except json.JSONDecodeError:
            # Fallback if AI fails to return valid JSON (rare with response_format)
            print("[ERROR] Erro ao decodificar JSON da IA. Usando RAW.")
            parsed_feedback = {
                 "sections": {
                     "mercado": response_content,
                     "forcas": [],
                     "riscos": [],
                     "conselho": "Erro ao formatar resposta."
                 },
                 "metrics": {}
            }
        except Exception as e:
            print(f"[ERROR] Erro na Fase 5: {e}")
            parsed_feedback = {}

        return {
            'feedback_text': parsed_feedback # Now returning a Dict, not String
        }

    def run_vc_batch_screening(self, startup_data):
        print("[INFO] 🚀 VC Batch Mode Activated (Fast Lane)")
        deck_text = startup_data.get('pitch_deck_text', '')[:15000] # Limit context
        
        # Extract basic info if possible
        # We can reuse deck analyzer partially if needed, but let's go purely prompt based for speed
        
        prompt = PROMPT_VC_SCREENING_SINGLE.format(
            startup_name="Startup no Deck",
            sector="General Tech",
            pitch_deck_text=deck_text
        )

        try:
            response_content = self.openai_client.create_completion(
                system_prompt=prompt,
                user_message="Gere o output JSON.",
                temperature=0.1, # Low temp for consistency
                response_format={"type": "json_object"}
            )
            data = json.loads(response_content)
        except Exception as e:
            print(f"[ERROR] Batch AI Failed: {e}")
            data = {
                "name": "Unknown",
                "score": 0,
                "recommendation": "ERROR",
                "short_rationale": "Falha no processamento.",
                "key_flags": []
            }

        # Map to standard output format expected by Frontend/DB
        return {
            "score": data.get('score', 0),
            "feedback": json.dumps(data, ensure_ascii=False), # Save full extraction as feedback
            "result": data, # Also save as JSON result
            "company_name": data.get('name'),
            "recommendation": data.get('recommendation'),
            # Fill other dicts empty to avoid frontend crash
            "deck_analysis": {}, "financial_analysis": {}, "traction_analysis": {},
            "market_sizing_analysis": {}, "problem_analysis": {}, "business_model_analysis": {},
            "financial_projections_analysis": {}, "traction_critique": {}, "growth_analysis": {},
            "team_analysis": {}, "sector_adjustment": {}, "strengths_synthesis": {},
            "weaknesses_synthesis": {}, "benchmarking_analysis": {}, "executive_summary": {},
            "structured_report": {}
        }

# Wrapper function
def analyze_idea(segment, problem, proposition, pitch_deck_text=None):
    engine = DaatAnalysisEngine()
    startup_data = {
        "sector": segment,
        "problem": problem,
        "proposition": proposition,
        "pitch_deck_text": pitch_deck_text
    }
    return engine.generate_complete_analysis(startup_data)
