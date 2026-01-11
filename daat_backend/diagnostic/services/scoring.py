import json
from ..utils.openai_client import OpenAIClient
from .prompts import PROMPT_PHASE_3_SCORING, PROMPT_EXPLAINABLE_SCORING
from django.conf import settings

class Phase3Scoring:
    def __init__(self, openai_client: OpenAIClient):
        self.openai = openai_client

    def execute(self, startup_data, market_research, critical_analysis):
        # Fallback extraction or passed in startup_data
        sector = startup_data.get('sector', 'Technology')
        stage = startup_data.get('metrics', {}).get('stage', 'Seed (Estimated)')
        
        # Construct Deck Summary from previous phases
        deck_structure = startup_data.get('deck_structure', {})
        deck_summary = json.dumps(deck_structure.get('slides', []), ensure_ascii=False)
        if not deck_structure: 
             # Fallback if Phase 0 didn't run or failed
             deck_summary = startup_data.get('pitch_deck_text', '')[:5000]

        # Benchmarks from Phase 3.4
        benchmarks = json.dumps(startup_data.get('benchmarking_analysis', {}), ensure_ascii=False)

        prompt = PROMPT_EXPLAINABLE_SCORING.format(
            sector=sector,
            stage=stage,
            deck_summary=deck_summary,
            benchmarks=benchmarks
        )
        
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('scoring', 0.2)
        
        try:
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Calcule os scores detalhados.",
                temperature=temp,
                response_format={"type": "json_object"}
            )
            data = json.loads(response_content)
            
            # Normalize keys to match system expectations
            # The prompt returns 'scores' dict and 'total_score'
            # We map this to the structure expected by analysis_engine
            return {
                "score": data.get('total_score', 0),
                "classification": data.get('recommendation', 'PASS'),
                "score_breakdown": data.get('scores', {}),
                "reasoning": data.get('total_score_method', '')
            }

        except Exception as e:
            print(f"[ERROR] Scoring Phase Failed: {e}")
            return {"score": 0, "classification": "ERROR", "score_breakdown": {}}
