import os
import django
import sys
from pathlib import Path
import openai

# Setup Django Environment
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()

from django.conf import settings

def test_openai_simple():
    print("--- Testing OpenAI Connectivity ---")
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        print("❌ OPENAI_API_KEY is not set in environment.")
        return

    print(f"API Key present: {api_key[:5]}...{api_key[-4:]}")
    
    client = openai.OpenAI(api_key=api_key)
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "user", "content": "Hello, are you working?"}
            ],
            max_tokens=10
        )
        print("✅ OpenAI Request Successful!")
        print(f"Response: {response.choices[0].message.content}")
    except Exception as e:
        print(f"❌ OpenAI Request Failed: {e}")

if __name__ == "__main__":
    test_openai_simple()
