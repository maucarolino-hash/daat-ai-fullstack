import os
import django
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()

from django.contrib.auth.models import User
from diagnostic.models import UserProfile

def create_admin():
    try:
        username = "admin"
        email = "admin@daatai.com"
        password = "admin123"
        
        # Check if exists
        try:
            u = User.objects.get(username=username)
            print(f"User {username} exists. Updating password.")
            u.set_password(password)
            u.email = email
            u.is_staff = True
            u.is_superuser = True
            u.save()
        except User.DoesNotExist:
            print(f"Creating new user {username}.")
            u = User.objects.create_superuser(username, email, password)
            
        # Ensure Profile
        if not hasattr(u, 'profile'):
            UserProfile.objects.create(user=u, credits=9999, is_premium=True)
            print("Profile created.")
        else:
            u.profile.credits = 9999
            u.profile.is_premium = True
            u.profile.save()
            print("Profile updated.")
            
        print("\n--- CREDENTIALS ---")
        print(f"Username: {username}")
        print(f"Email:    {email}")
        print(f"Password: {password}")
        print("-------------------")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_admin()
