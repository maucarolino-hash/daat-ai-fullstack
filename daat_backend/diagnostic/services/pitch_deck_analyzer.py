import json
from ..utils.openai_client import OpenAIClient
from ..prompts import PROMPT_PITCH_DECK_STRUCTURE
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class PitchDeckAnalyzer:
    def __init__(self, openai_client: OpenAIClient):
        self.openai = openai_client

    def execute(self, pitch_deck_text):
        if not pitch_deck_text or len(pitch_deck_text.strip()) < 50:
            logger.warning("Texto do pitch deck insuficiente para análise estrutural.")
            return {"slides": [], "structural_feedback": "Texto do pitch deck não fornecido ou insuficiente."}

        logger.info("📄 Analisando estrutura do Pitch Deck...")
        
        prompt = PROMPT_PITCH_DECK_STRUCTURE.format(
            pitch_deck_text=pitch_deck_text
        )
        
        # Use a slightly lower temperature for structural extraction
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('market_research', 0.2) # Use low temp like market research

        try:
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Extraia a estrutura do pitch deck.",
                temperature=temp,
                response_format={"type": "json_object"}
            )
            
            return json.loads(response_content)
        except Exception as e:
            logger.error(f"Erro na análise do pitch deck: {e}")
            return {"slides": [], "structural_feedback": f"Erro ao analisar pitch deck: {str(e)}"}

    def analyze_financials(self, pitch_deck_text):
        from ..prompts import PROMPT_FINANCIAL_METRICS
        if not pitch_deck_text or len(pitch_deck_text.strip()) < 50:
            return {"metrics": [], "financial_summary": "Texto insuficiente."}
            
        logger.info("💰 Extraindo métricas financeiras...")
        prompt = PROMPT_FINANCIAL_METRICS.format(pitch_deck_text=pitch_deck_text)
        
        # Low temp for precise extraction
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('market_research', 0.1)

        try:
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Extraia métricas financeiras.",
                temperature=temp,
                response_format={"type": "json_object"}
            )
            return json.loads(response_content)
        except Exception as e:
            logger.error(f"Erro na extração financeira: {e}")
            return {"metrics": [], "financial_summary": "Erro na extração."}

    def analyze_traction(self, pitch_deck_text):
        from ..prompts import PROMPT_TRACTION_EXTRACTION
        if not pitch_deck_text or len(pitch_deck_text.strip()) < 50:
            return {"quantitative_traction": [], "qualitative_traction": [], "timeline_events": [], "traction_summary": "Texto insuficiente."}
            
        logger.info("🚀 Extraindo tração e validação...")
        prompt = PROMPT_TRACTION_EXTRACTION.format(pitch_deck_text=pitch_deck_text)
        
        # Slightly higher temp for qualitative inference
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('market_research', 0.2)

        try:
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Extraia evidências de tração.",
                temperature=temp,
                response_format={"type": "json_object"}
            )
            return json.loads(response_content)
        except Exception as e:
            logger.error(f"Erro na extração de tração: {e}")
            return {"quantitative_traction": [], "qualitative_traction": [], "timeline_events": [], "traction_summary": "Erro na extração."}

    def analyze_market_sizing(self, pitch_deck_text, sector="Startup Geral"):
        from ..prompts import PROMPT_TAM_SAM_SOM_ANALYSIS
        if not pitch_deck_text or len(pitch_deck_text.strip()) < 50:
            return None
            
        logger.info("📐 Analisando TAM/SAM/SOM...")
        prompt = PROMPT_TAM_SAM_SOM_ANALYSIS.format(pitch_deck_text=pitch_deck_text, sector=sector)
        
        # Analytic temp
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('critical_analysis', 0.3)

        try:
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Critique o tamanho de mercado.",
                temperature=temp,
                response_format={"type": "json_object"}
            )
            return json.loads(response_content)
        except Exception as e:
            logger.error(f"Erro na análise de mercado: {e}")
            return None

    def analyze_problem(self, pitch_deck_text):
        from ..prompts import PROMPT_PROBLEM_ANALYSIS
        if not pitch_deck_text or len(pitch_deck_text.strip()) < 50:
            return None
            
        logger.info("🧩 Analisando Problema (Problem-Solution Fit)...")
        prompt = PROMPT_PROBLEM_ANALYSIS.format(pitch_deck_text=pitch_deck_text)
        
        # Analytic temp
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('critical_analysis', 0.3)

        try:
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Avalie o problema.",
                temperature=temp,
                response_format={"type": "json_object"}
            )
            return json.loads(response_content)
        except Exception as e:
            logger.error(f"Erro na análise do problema: {e}")
            return None

    def analyze_business_model(self, pitch_deck_text, sector="Startup Geral"):
        from ..prompts import PROMPT_BUSINESS_MODEL_ANALYSIS
        if not pitch_deck_text or len(pitch_deck_text.strip()) < 50:
            return None
            
        logger.info("💰 Analisando Modelo de Negócio (Unit Economics)...")
        prompt = PROMPT_BUSINESS_MODEL_ANALYSIS.format(pitch_deck_text=pitch_deck_text, sector=sector)
        
        # Analytic temp
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('critical_analysis', 0.2) # Lower temp for numbers

        try:
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Avalie o modelo de negócio.",
                temperature=temp,
                response_format={"type": "json_object"}
            )
            return json.loads(response_content)
        except Exception as e:
            logger.error(f"Erro na análise de business model: {e}")
            return None

    def analyze_financial_projections(self, pitch_deck_text):
        from ..prompts import PROMPT_FINANCIAL_PROJECTION_ANALYSIS
        if not pitch_deck_text or len(pitch_deck_text.strip()) < 50:
            return None
            
        logger.info("📈 Analisando Projeções Financeiras...")
        prompt = PROMPT_FINANCIAL_PROJECTION_ANALYSIS.format(pitch_deck_text=pitch_deck_text)
        
        # Analytic temp
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('critical_analysis', 0.2)

        try:
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Avalie as projeções.",
                temperature=temp,
                response_format={"type": "json_object"}
            )
            return json.loads(response_content)
        except Exception as e:
            logger.error(f"Erro na análise de projeções: {e}")
            return None

    def analyze_traction_critique(self, pitch_deck_text, stage="Seed"):
        from ..prompts import PROMPT_TRACTION_CRITIQUE
        if not pitch_deck_text or len(pitch_deck_text.strip()) < 50:
            return None
            
        logger.info(f"🚀 Criticando Tração (Stage: {stage})...")
        prompt = PROMPT_TRACTION_CRITIQUE.format(pitch_deck_text=pitch_deck_text, stage=stage)
        
        # Analytic temp
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('critical_analysis', 0.2)

        try:
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Avalie a tração.",
                temperature=temp,
                response_format={"type": "json_object"}
            )
            return json.loads(response_content)
        except Exception as e:
            logger.error(f"Erro na crítica de tração: {e}")
            return None

    def analyze_growth(self, pitch_deck_text, sector="Tecnologia"):
        from ..prompts import PROMPT_GROWTH_ANALYSIS
        if not pitch_deck_text or len(pitch_deck_text.strip()) < 50:
            return None
            
        logger.info(f"📈 Analisando Crescimento (MoM)...")
        prompt = PROMPT_GROWTH_ANALYSIS.format(pitch_deck_text=pitch_deck_text, sector=sector)
        
        # Analytic temp
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('critical_analysis', 0.2)

        try:
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Calcule o crescimento.",
                temperature=temp,
                response_format={"type": "json_object"}
            )
            return json.loads(response_content)
        except Exception as e:
            logger.error(f"Erro na análise de crescimento: {e}")
            return None

    def analyze_team(self, pitch_deck_text):
        from ..prompts import PROMPT_TEAM_ANALYSIS
        if not pitch_deck_text or len(pitch_deck_text.strip()) < 50:
            return None
            
        logger.info(f"👥 Analisando Equipe...")
        prompt = PROMPT_TEAM_ANALYSIS.format(pitch_deck_text=pitch_deck_text)
        
        # Analytic temp
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('critical_analysis', 0.2)

        try:
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Avalie a equipe.",
                temperature=temp,
                response_format={"type": "json_object"}
            )
            return json.loads(response_content)
        except Exception as e:
            logger.error(f"Erro na análise de equipe: {e}")
            return None

    def analyze_sector_adjustment(self, pitch_deck_text, raw_score):
        from ..prompts import PROMPT_SECTOR_ADJUSTMENT
        if not pitch_deck_text:
            return None
            
        logger.info(f"⚖️ Calculando Ajuste Setorial (Score Base: {raw_score})...")
        prompt = PROMPT_SECTOR_ADJUSTMENT.format(pitch_deck_text=pitch_deck_text, raw_score=raw_score)
        
        # Analytic temp
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('critical_analysis', 0.2)

        try:
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Ajuste o score pelo setor.",
                temperature=temp,
                response_format={"type": "json_object"}
            )
            return json.loads(response_content)
        except Exception as e:
            logger.error(f"Erro no ajuste setorial: {e}")
            return None

    def analyze_strengths(self, pitch_deck_text, sector="General"):
        from ..prompts import PROMPT_STRENGTHS_SYNTHESIS
        if not pitch_deck_text:
            return None
            
        logger.info(f"💪 Analisando Pontos Fortes (Setor: {sector})...")
        prompt = PROMPT_STRENGTHS_SYNTHESIS.format(pitch_deck_text=pitch_deck_text, sector=sector)
        
        # Analytic temp
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('critical_analysis', 0.2)

        try:
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Identifique os top 3 pontos fortes.",
                temperature=temp,
                response_format={"type": "json_object"}
            )
            return json.loads(response_content)
        except Exception as e:
            logger.error(f"Erro na análise de forças: {e}")
            return None

    def analyze_weaknesses(self, pitch_deck_text, sector="General"):
        from ..prompts import PROMPT_WEAKNESSES_SYNTHESIS
        if not pitch_deck_text:
            return None
            
        logger.info(f"⚠️ Analisando Pontos Fracos (Setor: {sector})...")
        prompt = PROMPT_WEAKNESSES_SYNTHESIS.format(pitch_deck_text=pitch_deck_text, sector=sector)
        
        # Analytic temp
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('critical_analysis', 0.2)

        try:
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Identifique os top 3 pontos fracos.",
                temperature=temp,
                response_format={"type": "json_object"}
            )
            return json.loads(response_content)
        except Exception as e:
            logger.error(f"Erro na análise de fraquezas: {e}")
            return None

    def analyze_benchmarks(self, pitch_deck_text, sector="General"):
        from ..prompts import PROMPT_COMPARATIVE_BENCHMARKING
        if not pitch_deck_text:
            return None
            
        logger.info(f"📊 Executando Benchmarking Comparativo (Setor: {sector})...")
        prompt = PROMPT_COMPARATIVE_BENCHMARKING.format(pitch_deck_text=pitch_deck_text, sector=sector)
        
        # Analytic temp
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('market_research', 0.1) 

        try:
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Compare com benchmarks 2025-2026.",
                temperature=temp,
                response_format={"type": "json_object"}
            )
            return json.loads(response_content)
        except Exception as e:
            logger.error(f"Erro no benchmarking: {e}")
            return None

    def generate_executive_summary(self, pitch_deck_text, sector="General"):
        from ..prompts import PROMPT_EXECUTIVE_SUMMARY
        if not pitch_deck_text:
            return None
            
        logger.info(f"📑 Gerando Executive Summary (Setor: {sector})...")
        prompt = PROMPT_EXECUTIVE_SUMMARY.format(pitch_deck_text=pitch_deck_text)
        
        # Analytic temp
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('critical_analysis', 0.2) 

        try:
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Gere o Executive Summary.",
                temperature=temp,
                response_format={"type": "json_object"}
            )
            return json.loads(response_content)
        except Exception as e:
            logger.error(f"Erro no executive summary: {e}")
            return None

    def generate_structured_report(self, pitch_deck_text, analysis_context={}):
        from ..prompts import PROMPT_STRUCTURED_REPORT
        if not pitch_deck_text:
            return None
            
        logger.info(f"📑 Gerando Relatório Detalhado Compilado...")
        
        # Flatten context for prompt
        prompt = PROMPT_STRUCTURED_REPORT.format(
            pitch_deck_text=pitch_deck_text,
            executive_summary_context=json.dumps(analysis_context.get('executive_summary', {})),
            strengths_context=json.dumps(analysis_context.get('strengths_synthesis', {})),
            weaknesses_context=json.dumps(analysis_context.get('weaknesses_synthesis', {})),
            benchmarking_context=json.dumps(analysis_context.get('benchmarking_analysis', {})),
            score_context=json.dumps(analysis_context.get('score_breakdown', {}))
        )
        
        # Analytic temp
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('synthesis', 0.1) 

        try:
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Gere o Relatório Estruturado Final.",
                temperature=temp,
                response_format={"type": "json_object"}
            )
            return json.loads(response_content)
        except Exception as e:
            logger.error(f"Erro no relatório estruturado: {e}")
            return None
