import os
import django
import json
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()

from diagnostic.models import Diagnostic

def check_latest():
    try:
        latest = Diagnostic.objects.latest('created_at')
        print(f"ID: {latest.id}")
        print(f"Score: {latest.score}")
        print(f"Created At: {latest.created_at}")
        
        print("\n--- RESULT JSON ---")
        if latest.result:
            print(json.dumps(latest.result, indent=2, ensure_ascii=False))
        else:
            print("No Result JSON stored.")
            
        print("\n--- FEEDBACK TEXT ---")
        print(latest.feedback[:1000]) # First 1000 chars
        
    except Diagnostic.DoesNotExist:
        print("No diagnostics found.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_latest()
