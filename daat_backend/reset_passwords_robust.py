
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()
from django.contrib.auth.models import User

from django.contrib.auth.hashers import make_password

def reset_all():
    users = User.objects.all()
    count = users.count()
    print(f"Found {count} users. Resetting ALL passwords to 'password123' using bulk update...")
    
    # Bypass save() signals by using update()
    User.objects.all().update(password=make_password('password123'))
    
    print(f"✅ Successfully reset passwords for {count} users.")
    for u in users:
        print(f"   - {u.username} ({u.email})")

if __name__ == "__main__":
    reset_all()
