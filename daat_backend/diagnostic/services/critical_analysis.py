import json
from ..utils.openai_client import OpenAIClient
from .prompts import PROMPT_PHASE_2_CRITICAL_ANALYSIS
from django.conf import settings

class Phase2CriticalAnalysis:
    def __init__(self, openai_client: OpenAIClient):
        self.openai = openai_client

    def execute(self, startup_data, market_research):
        prompt = PROMPT_PHASE_2_CRITICAL_ANALYSIS.format(
            startup_data=json.dumps(startup_data, indent=2, ensure_ascii=False),
            market_research_results=json.dumps(market_research, indent=2, ensure_ascii=False),
            pitch_deck_text=startup_data.get('pitch_deck_text', 'Não fornecido.')
        )
        
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('critical_analysis', 0.4)

        response_content = self.openai.create_completion(
            system_prompt=prompt,
            user_message="Faça a análise crítica baseada nos dados fornecidos.",
            temperature=temp,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response_content)
