import json
from ..utils.openai_client import OpenAIClient
from .prompts import PROMPT_PHASE_4_STRATEGIC_ADVICE
from django.conf import settings

class Phase4StrategicAdvice:
    def __init__(self, openai_client: OpenAIClient):
        self.openai = openai_client

    def execute(self, scoring, market_research, critical_analysis):
        prompt = PROMPT_PHASE_4_STRATEGIC_ADVICE.format(
            final_score=scoring.get('final_score', 0),
            classification=scoring.get('classification', 'N/A'),
            market_research_results=json.dumps(market_research, indent=2, ensure_ascii=False),
            critical_analysis_results=json.dumps(critical_analysis, indent=2, ensure_ascii=False),
            score_breakdown=json.dumps(scoring.get('score_breakdown', {}), indent=2, ensure_ascii=False)
        )
        
        ai_config = getattr(settings, 'AI_SETTINGS', {})
        temp = ai_config.get('temperature', {}).get('strategic_advice', 0.5)

        response_content = self.openai.create_completion(
            system_prompt=prompt,
            user_message="Forneça conselhos estratégicos.",
            temperature=temp,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response_content)
