import json
from ..prompts import PROMPT_THESIS_CONFIG
from ..utils.openai_client import OpenAIClient

class ThesisService:
    def __init__(self):
        self.openai_client = OpenAIClient()
        self.default_weights = {
            "tracao": 0.25,
            "mercado": 0.20,
            "equipe": 0.15,
            "produto": 0.15,
            "unit_econ": 0.10,
            "riscos": 0.10,
            "ask": 0.05
        }

    def generate_custom_weights(self, thesis_description):
        """
        Generates custom weights based on the fund's thesis description.
        """
        try:
            prompt = PROMPT_THESIS_CONFIG.format(
                thesis_description=thesis_description,
                default_weights=json.dumps(self.default_weights, indent=2)
            )

            response_content = self.openai_client.create_completion(
                system_prompt=prompt,
                user_message="Gere a configuração de pesos JSON.",
                temperature=0.4,
                response_format={"type": "json_object"}
            )

            data = json.loads(response_content)
            
            # Validate weights sum to approx 1.0 (margin of error)
            weights = data.get('weights', {})
            total_weight = sum(weights.values())
            
            if not (0.95 <= total_weight <= 1.05):
                # Auto-normalize if AI drifted
                print(f"[WARN] Weights sum to {total_weight}, normalizing...")
                factor = 1.0 / total_weight
                for k in weights:
                    weights[k] = round(weights[k] * factor, 2)
                data['weights'] = weights

            return data

        except Exception as e:
            print(f"[ERROR] Thesis Config Failed: {e}")
            return {
                "error": str(e),
                "weights": self.default_weights,
                "rationale": {"general": "Fallback to defaults due to error."}
            }
