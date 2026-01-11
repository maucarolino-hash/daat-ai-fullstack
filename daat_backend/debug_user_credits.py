import os
import django
import sys
from pathlib import Path

# Setup Django Environment
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()

from django.contrib.auth.models import User
from diagnostic.models import UserProfile

def check_credits():
    users = User.objects.all()
    print("--- User Credits Report ---")
    for user in users:
        try:
            profile = user.profile
            print(f"User: {user.username} | Email: {user.email} | Credits: {profile.credits} | Premium: {profile.is_premium}")
        except Exception as e:
            print(f"User: {user.username} | Error accessing profile: {e}")

if __name__ == "__main__":
    check_credits()
