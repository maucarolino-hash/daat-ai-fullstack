import json
from ..utils.openai_client import OpenAIClient
from .prompts import PROMPT_PHASE_3_SCORING
from django.conf import settings

class Phase3Scoring:
    def __init__(self, openai_client: OpenAIClient):
        self.openai = openai_client

    def execute(self, market_research, critical_analysis):
        prompt = PROMPT_PHASE_3_SCORING.format(
            market_research_results=json.dumps(market_research, indent=2, ensure_ascii=False),
            critical_analysis_results=json.dumps(critical_analysis, indent=2, ensure_ascii=False)
        )
        
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('scoring', 0.2)
        
        response_content = self.openai.create_completion(
            system_prompt=prompt,
            user_message="Calcule o score final.",
            temperature=temp,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response_content)
