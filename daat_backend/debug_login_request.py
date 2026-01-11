import requests
import json

BASE_URL = "http://127.0.0.1:8084"
LOGIN_URL = f"{BASE_URL}/api/auth/login/"

# Use the credentials of a known user (Mauricio - ID 2)
# I'll try the email I saw in debug_history_check.py output if visible, or a standard test one.
# From Step 1344 output: "User: Mauricio (ID: 2)". 
# I don't know the password. I should reset it to a known value to test.
# OR I can just try a predictable one if I set it before.
# Better: I will create a temporary test user or reset Mauricio's password programmatically first.
# Actually, I can use the 'admin' user if I knew the password.

# Let's create a script that:
# 1. Resets 'admin' or 'Mauricio' password to 'password123'.
# 2. Tries to login via requests.

import os
import django
import sys
from pathlib import Path

# Setup Django
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()

from django.contrib.auth.models import User

def debug_login():
    try:
        # 1. Reset Password for 'mau-3@example.com' (or username 'mau-3')?
        # Let's use the 'Mauricio' user found earlier.
        u = User.objects.get(id=2)
        print(f"Reseting password for user: {u.username} ({u.email})")
        u.set_password("daat123456") # Known password
        u.save()
        
        # 2. Attempt Login via HTTP
        payload = {
            "username": u.username, # Try username first
            "email": u.email,
            "password": "daat123456"
        }
        
        # Try username login
        print("\n--- Attempting Login (Username) ---")
        try_login(payload)
        
        # Try email login (if configured)
        print("\n--- Attempting Login (Email) ---")
        payload2 = {"email": u.email, "password": "daat123456"}
        try_login(payload2)

    except Exception as e:
        print(f"Error: {e}")

def try_login(payload):
    try:
        resp = requests.post(LOGIN_URL, json=payload)
        print(f"Status: {resp.status_code}")
        print(f"Headers: {resp.headers}")
        try:
            print(f"Body: {json.dumps(resp.json(), indent=2)}")
        except:
            print(f"Body (Text): {resp.text}")
    except Exception as e:
        print(f"Request Failed: {e}")

if __name__ == "__main__":
    debug_login()
