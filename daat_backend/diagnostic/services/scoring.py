import json
from ..utils.openai_client import DaatOpenAIClient
from .prompts import PROMPT_PHASE_3_SCORING

class Phase3Scoring:
    def __init__(self, openai_client: DaatOpenAIClient):
        self.openai = openai_client.get_client()

    def execute(self, market_research, critical_analysis):
        prompt = PROMPT_PHASE_3_SCORING.format(
            market_research_results=json.dumps(market_research, indent=2, ensure_ascii=False),
            critical_analysis_results=json.dumps(critical_analysis, indent=2, ensure_ascii=False)
        )
        
        if not self.openai:
            return {"error": "OpenAI client not initialized"}

        response = self.openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": "Calcule o score final."}
            ],
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
