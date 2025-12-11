import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("\n--- Creating Debug User ---")
email = 'debug_user@test.com'
password = 'DebugPassword123!'

try:
    user = User.objects.get(email=email)
    print(f"User {email} already exists. Deleting...")
    user.delete()
except User.DoesNotExist:
    pass

print(f"Creating {email}...")
user = User.objects.create_user(username='debug_user', email=email, password=password)
user.is_active = True
user.save()
print("Debug user created.")

print("\n--- Verification ---")
check = user.check_password(password)
print(f"Password check for {email}: {check}")
