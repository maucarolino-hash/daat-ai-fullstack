
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()

from django.contrib.auth.models import User
from diagnostic.models import Diagnostic

print("--- USERS ---")
for u in User.objects.all():
    print(f"ID: {u.id} | User: {u.username} | Email: {u.email}")

print("\n--- DIAGNOSTICS ---")
for d in Diagnostic.objects.all():
    user_str = f"{d.user.username} (ID: {d.user.id})" if d.user else "None"
    print(f"ID: {d.id} | User: {user_str} | Segment: {d.customer_segment} | Score: {d.score}")
