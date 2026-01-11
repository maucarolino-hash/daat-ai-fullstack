import logging
import json
from django.conf import settings
from ..utils.openai_client import OpenAIClient
from ..prompts import PROMPT_PITCH_GENERATOR

logger = logging.getLogger(__name__)

class DeckGenerator:
    def __init__(self):
        self.openai = OpenAIClient()
        
    def generate_deck(self, description, sector="Technology"):
        if not description:
            return {"error": "Description is required"}
            
        logger.info(f"🎨 Generating Pitch Deck for sector {sector}...")
        
        # Format Prompt
        prompt = PROMPT_PITCH_GENERATOR.format(
            startup_description=description,
            sector=sector
        )
        
        try:
            # AI Call
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Gere a estrutura do deck.",
                temperature=0.7, # Higher creativity for generative task
                response_format={"type": "json_object"}
            )
            
            return json.loads(response_content)
            
        except Exception as e:
            logger.error(f"Error generating deck: {e}")
            return {"error": str(e)}

    def generate_improved_deck(self, startup_info, current_score, score_breakdown, deck_summary, target_investor="VC Seed"):
        """
        Generates an improved deck structure based on analysis feedback.
        """
        from ..prompts import PROMPT_PITCH_GENERATOR_V2 # Lazy import
        
        # Serialize inputs
        startup_str = json.dumps(startup_info, ensure_ascii=False)
        breakdown_str = json.dumps(score_breakdown, ensure_ascii=False)
        
        prompt = PROMPT_PITCH_GENERATOR_V2.format(
            startup_info=startup_str,
            current_score=current_score,
            score_breakdown=breakdown_str,
            deck_summary=str(deck_summary),
            target_investor_profile=target_investor
        )

        try:
            response_content = self.openai.create_completion(
                system_prompt=prompt,
                user_message="Gere o deck otimizado.",
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            return json.loads(response_content)
        except Exception as e:
            logger.error(f"Error generating improved deck: {e}")
            return {"error": str(e)}
