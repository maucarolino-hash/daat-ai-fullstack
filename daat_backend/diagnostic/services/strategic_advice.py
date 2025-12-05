import json
from ..utils.openai_client import DaatOpenAIClient
from .prompts import PROMPT_PHASE_4_STRATEGIC_ADVICE

class Phase4StrategicAdvice:
    def __init__(self, openai_client: DaatOpenAIClient):
        self.openai = openai_client.get_client()

    def execute(self, scoring, market_research, critical_analysis):
        prompt = PROMPT_PHASE_4_STRATEGIC_ADVICE.format(
            final_score=scoring.get('final_score', 0),
            classification=scoring.get('classification', 'N/A'),
            market_research_results=json.dumps(market_research, indent=2, ensure_ascii=False),
            critical_analysis_results=json.dumps(critical_analysis, indent=2, ensure_ascii=False),
            score_breakdown=json.dumps(scoring.get('score_breakdown', {}), indent=2, ensure_ascii=False)
        )
        
        if not self.openai:
            return {"error": "OpenAI client not initialized"}

        response = self.openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": "Forneça conselhos estratégicos."}
            ],
            temperature=0.5,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
