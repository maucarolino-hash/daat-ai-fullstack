import os
import django
import sys
from pathlib import Path

# Setup Django Environment
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()

from django.contrib.auth.models import User
from diagnostic.models import Diagnostic

def check_history():
    print("--- Diagnostic History Report ---")
    diagnostics = Diagnostic.objects.all()
    print(f"Total Diagnostics Found: {diagnostics.count()}")
    
    for diag in diagnostics:
        user_str = f"{diag.user.id} ({diag.user.username})" if diag.user else "None"
        print(f"ID: {diag.id} | User: {user_str} | Segment: {diag.customer_segment} | Date: {diag.created_at}")

    print("\n--- Users Report ---")
    for user in User.objects.all():
        count = Diagnostic.objects.filter(user=user).count()
        print(f"User: {user.username} (ID: {user.id}) | Diagnostics: {count}")

if __name__ == "__main__":
    check_history()
