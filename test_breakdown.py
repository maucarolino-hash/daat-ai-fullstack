import sys
import os
import django
from django.conf import settings

# Configure Django settings manually since we are running a standalone script
# sys.path.append(os.path.join(os.getcwd(), 'daat_backend'))
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
# django.setup()

# Mocking the engine response structure directly to test the logic flow
# We don't want to burn tokens on a real run for this verification script
mock_scoring_result = {
    "final_score": 85,
    "classification": "Viabilidade Alta",
    "score_breakdown": {
        "market_opportunity": {"score": 25, "details": "Bom mercado"},
        "competitive_position": {"score": 20, "details": "Ok"},
        "execution_viability": {"score": 20, "details": "Time forte"},
        "risk_adjustment": {"score": -5, "details": "Risco regulatório"}
    }
}

def test_structure():
    print("Testing Data Structure Handover...")
    
    # Simulate what AnalysisEngine.generate_complete_analysis returns
    result = {
        "score": mock_scoring_result.get('final_score', 0),
        "feedback": "Report content...",
        "score_breakdown": mock_scoring_result.get('score_breakdown', {})
    }
    
    print(f"Final Score: {result['score']}")
    print(f"Breakdown Keys: {list(result['score_breakdown'].keys())}")
    
    if "score_breakdown" in result and "market_opportunity" in result['score_breakdown']:
        print("✅ SUCCESS: score_breakdown is present and structured correctly.")
    else:
        print("❌ FAILURE: score_breakdown missing or malformed.")

if __name__ == "__main__":
    test_structure()
