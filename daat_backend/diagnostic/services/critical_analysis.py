import json
from ..utils.openai_client import DaatOpenAIClient
from .prompts import PROMPT_PHASE_2_CRITICAL_ANALYSIS

class Phase2CriticalAnalysis:
    def __init__(self, openai_client: DaatOpenAIClient):
        self.openai = openai_client.get_client()

    def execute(self, startup_data, market_research):
        prompt = PROMPT_PHASE_2_CRITICAL_ANALYSIS.format(
            startup_data=json.dumps(startup_data, indent=2, ensure_ascii=False),
            market_research_results=json.dumps(market_research, indent=2, ensure_ascii=False)
        )
        
        if not self.openai:
            return {"error": "OpenAI client not initialized"}

        response = self.openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": "Faça a análise crítica baseada nos dados fornecidos."}
            ],
            temperature=0.4,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
