
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()
from django.contrib.auth.models import User

def reset_all():
    users = User.objects.all()
    print(f"Found {len(users)} users. Resetting passwords to 'password123'...")
    
    for u in users:
        u.set_password('password123')
        u.save()
        print(f"✅ Password reset for: {u.username} (Email: {u.email})")

if __name__ == "__main__":
    reset_all()
