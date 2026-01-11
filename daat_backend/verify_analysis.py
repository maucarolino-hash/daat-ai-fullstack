import os
import django
import json
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()

from diagnostic.services import analyze_idea

def test_analysis():
    print("Running Analysis Test...")
    # Dummy data simulating a user request
    result = analyze_idea(
        segment="Delivery de Ração Pet",
        problem="Donos esquecem de comprar ração",
        proposition="Assinatura mensal com entrega automática"
    )
    
    print(f"Score: {result.get('score')}")
    
    feedback = result.get('feedback', {})
    if isinstance(feedback, str):
        print("Feedback is String (Error?):", feedback[:200])
    else:
        print("Feedback is JSON.")
        metrics = feedback.get('metrics', {})
        print(f"Market Size: {metrics.get('marketSize')}")
        print(f"Growth Rate: {metrics.get('growthRate')}")
        
        comps = metrics.get('competitors', [])
        print(f"Competitors count: {len(comps)}")
        if comps:
            print("First Competitor:", comps[0].get('name'))

if __name__ == "__main__":
    test_analysis()
