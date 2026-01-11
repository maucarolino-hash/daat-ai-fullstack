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

def fix_profiles():
    users = User.objects.all()
    print(f"Checking profiles for {users.count()} users...")
    
    fixed_count = 0
    for user in users:
        try:
            profile = user.profile
            # Force update for everyone
            profile.credits = 9999
            profile.is_premium = True
            profile.save()
            print(f"✅ User '{user.username}' updated to UNLIMITED credits.")
            fixed_count += 1
        except UserProfile.DoesNotExist:
            print(f"⚠️ User '{user.username}' has NO profile. Creating one...")
            UserProfile.objects.create(user=user, credits=9999, is_premium=True)
            fixed_count += 1
        except Exception:
            # Handle reverse query generic exception
            if not hasattr(user, 'profile'):
                print(f"⚠️ User '{user.username}' has NO profile. Creating one...")
                UserProfile.objects.create(user=user, credits=10, is_premium=True)
                fixed_count += 1
    
    print(f"✅ Finished. Fixed {fixed_count} missing profiles.")

if __name__ == "__main__":
    fix_profiles()
