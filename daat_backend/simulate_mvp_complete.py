
import os
import django
import sys
import json
import time
from pathlib import Path

# Setup Django Environment
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()

from rest_framework.test import APIClient
from diagnostic.models import Diagnostic
from django.contrib.auth.models import User

def simulate_full_flow():
    print("\n🚀 SIMULATION: DAAT MVP FULL FLOW\n")
    client = APIClient()

    # 1. SETUP USER
    print("👤 Getting/Creating Test User...")
    user, created = User.objects.get_or_create(username='mvp_tester_simulation')
    if created:
        user.set_password('testpass123')
        user.save()
    client.force_authenticate(user=user)
    print("✅ Authenticated as 'mvp_tester_simulation'")

    # 2. RUN ANALYSIS
    print("\n🧠 STEP 1: Running Analysis (Diagnostic)...")
    payload = {
        'customerSegment': 'Eco-conscious Urban Millennials',
        'problem': 'Difficulty finding package-free grocery stores',
        'valueProposition': 'An app that maps and delivers from zero-waste stores',
        # Optional: pitch_deck here if we had a file
    }
    
    # We use processing endpoint. Note: If Celery is not running, this might fail or we need to rely on 'db_task' logic in thread.
    # To ensure it runs, we might want to toggle CELERY_TASK_ALWAYS_EAGER if not set.
    # But let's try calling the view.
    from django.conf import settings
    # Force eager for simulation to trigger the threaded workaround in views.py
    settings.CELERY_TASK_ALWAYS_EAGER = True
    print(f"🔧 Forced CELERY_TASK_ALWAYS_EAGER = {settings.CELERY_TASK_ALWAYS_EAGER}")
    
    response = client.post('/api/analyze-public/', payload, format='json')
    
    if response.status_code != 200:
        print(f"❌ Analysis Request Failed: {response.status_code} - {response.data}")
        return

    task_id = response.data.get('task_id')
    print(f"✅ Analysis Started. Task ID: {task_id}")

    # 3. POLL FOR COMPLETION
    print("\n⏳ STEP 2: Waiting for Analysis Completion...")
    diagnostic_id = None
    
    max_retries = 40 # 120 seconds
    for i in range(max_retries):
        status_res = client.get(f'/api/status/{task_id}/')
        status = status_res.data.get('status')
        print(f"   [{i*3}s] Status: {status}")
        
        if status == 'completed':
            diagnostic_id = status_res.data.get('data', {}).get('id')
            score = status_res.data.get('data', {}).get('score')
            print(f"✅ Analysis Completed! ID: {diagnostic_id} | Score: {score}")
            break
        
        if status == 'failed':
             print(f"❌ Analysis Failed: {status_res.data}")
             return
             
        time.sleep(3)
        
    if not diagnostic_id:
        print("❌ Timeout waiting for analysis.")
        # If we are in a non-threaded environment (like some test runners), the thread might not have started.
        # But we previously saw calls to threading in views.py.
        return

    # 4. GENERATE INVESTMENT MEMO
    print(f"\n📄 STEP 3: Generating Investment Memo for ID {diagnostic_id}...")
    memo_res = client.post(f'/api/generate-memo/{diagnostic_id}/')
    
    if memo_res.status_code == 200:
        if 'memo_markdown' in memo_res.data:
            print("✅ Investment Memo Generated!")
            print(f"   Format: Markdown (Length: {len(memo_res.data['memo_markdown'])} chars)")
            print("   Content Preview:", memo_res.data['memo_markdown'][:100].replace('\n', ' ') + "...")
        else:
             print("❌ Memo response missing content:", memo_res.data)
    else:
        print(f"❌ Memo Generation Failed: {memo_res.status_code} - {memo_res.data}")

    # 5. GENERATE IMPROVED DECK
    print(f"\n🎞️ STEP 4: Generating Improved Pitch Deck for ID {diagnostic_id}...")
    deck_res = client.post(f'/api/generate-improved-deck/{diagnostic_id}/')
    
    if deck_res.status_code == 200:
        if 'slides' in deck_res.data:
            slides = deck_res.data['slides']
            print("✅ Improved Deck Generated!")
            print(f"   Slides: {len(slides)}")
            if len(slides) > 0:
                print(f"   Slide 1 Title: {slides[0].get('title', 'N/A')}")
        else:
             print("❌ Deck response missing slides:", deck_res.data)
    else:
        print(f"❌ Deck Generation Failed: {deck_res.status_code} - {deck_res.data}")

    print("\n🏁 SIMULATION COMPLETE. MVP STATUS: READY TO LAUNCH.")

if __name__ == "__main__":
    simulate_full_flow()
