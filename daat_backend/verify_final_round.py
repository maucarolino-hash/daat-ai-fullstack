import os
import django
import sys
from django.urls import resolve
from django.conf import settings

# Setup Django Environment
# Add current directory to path so daat_backend can be found
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()

def verify_strategies():
    results = []
    
    print("🚀 Starting Final Verification Round...\n")

    # 1. VERIFY STRATEGY 3: FEEDBACK LOOP
    print("🔎 Checking Strategy 3: Feedback Loop...")
    try:
        from diagnostic.models import AnalysisFeedback
        print("✅ Model `AnalysisFeedback` found.")
        results.append("Strategy 3 (Model): PASS")
    except ImportError:
        print("❌ Model `AnalysisFeedback` NOT found.")
        results.append("Strategy 3 (Model): FAIL")

    try:
        resolve('/api/feedback/')
        print("✅ URL `/api/feedback/` resolves correctly.")
        results.append("Strategy 3 (URL): PASS")
    except Exception as e:
        print(f"❌ URL `/api/feedback/` failed to resolve: {e}")
        results.append("Strategy 3 (URL): FAIL")
        
    # 2. VERIFY STRATEGY 4: PITCH DECK GENERATOR
    print("\n🔎 Checking Strategy 4: Pitch Deck Generator...")
    try:
        from diagnostic.services.deck_generator import DeckGenerator
        print("✅ Service `DeckGenerator` found.")
        results.append("Strategy 4 (Service): PASS")
    except ImportError:
        print("❌ Service `DeckGenerator` NOT found.")
        results.append("Strategy 4 (Service): FAIL")

    try:
        from diagnostic.prompts import PROMPT_PITCH_GENERATOR
        if "{startup_description}" in PROMPT_PITCH_GENERATOR:
            print("✅ `PROMPT_PITCH_GENERATOR` found and looks valid.")
            results.append("Strategy 4 (Prompt): PASS")
        else:
            print("⚠️ `PROMPT_PITCH_GENERATOR` found but formatting tags missing?")
            results.append("Strategy 4 (Prompt): WARN")
    except ImportError:
        print("❌ `PROMPT_PITCH_GENERATOR` NOT found in prompts.py.")
        results.append("Strategy 4 (Prompt): FAIL")

    try:
        resolve('/api/generate-deck/')
        print("✅ URL `/api/generate-deck/` resolves correctly.")
        results.append("Strategy 4 (URL): PASS")
    except Exception as e:
        print(f"❌ URL `/api/generate-deck/` failed to resolve: {e}")
        results.append("Strategy 4 (URL): FAIL")

    print("\n📝 Final Verification Report:")
    for res in results:
        print(f"- {res}")

if __name__ == "__main__":
    verify_strategies()
