from ..prompts import PROMPT_INVESTMENT_MEMO
from ..utils.openai_client import OpenAIClient
import json

class InvestmentMemoService:
    def __init__(self):
        self.openai_client = OpenAIClient()

    def generate_memo(self, startup_data, analysis_summary, scores_data):
        """
        Generates a 1-2 page Investment Memo in Markdown format.
        """
        try:
            # Format inputs as strings if they are dicts
            startup_str = json.dumps(startup_data, indent=2, ensure_ascii=False) if isinstance(startup_data, dict) else str(startup_data)
            analysis_str = json.dumps(analysis_summary, indent=2, ensure_ascii=False) if isinstance(analysis_summary, dict) else str(analysis_summary)
            scores_str = json.dumps(scores_data, indent=2, ensure_ascii=False) if isinstance(scores_data, dict) else str(scores_data)

            prompt = PROMPT_INVESTMENT_MEMO.format(
                startup_data=startup_str,
                analysis_summary=analysis_str,
                scores_data=scores_str
            )

            # High temperature for creativity in writing the thesis part, 
            # but constrained structure by the prompt instructions.
            memo_markdown = self.openai_client.create_completion(
                system_prompt=prompt,
                user_message="Gere o Investment Memo.",
                temperature=0.5,
                max_tokens=2000 
            )

            return memo_markdown

        except Exception as e:
            print(f"[ERROR] Investment Memo Generation Failed: {e}")
            return f"Error generating memo: {str(e)}"
