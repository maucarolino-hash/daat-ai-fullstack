
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()
from django.contrib.auth.models import User
import requests
import json

BASE_URL = "http://localhost:8000"

def test_flow():
    # 0. Force Reset Password for 'Mauricio' to ensure we can test
    try:
        u = User.objects.get(email='maucarolino@gmail.com')
        u.set_password('password123')
        u.save()
        print(f"Reset password for {u.username} (ID: {u.id}) to 'password123'")
    except Exception as e:
        print(f"Could not reset password: {e}")

    # 1. Login
    login_url = f"{BASE_URL}/api/auth/login/"
    creds = {"username": "Mauricio", "password": "password123"} # Correct username from DB
    
    print(f"Attempting login to {login_url} with {creds['username']}...")
    try:
        resp = requests.post(login_url, json=creds)
        print(f"Login Status: {resp.status_code}")
        if resp.status_code != 200:
            # Try email login if username fails (dj-rest-auth might expect email?)
            creds = {"username": "maucarolino@gmail.com", "password": "password123"} # sometimes 'username' field accepts email
            print(f"Retrying with email in username field: {creds['username']}...")
            resp = requests.post(login_url, json=creds)
            print(f"Retry Login Status: {resp.status_code}")
            
        if resp.status_code != 200:
            print("Login failed. Response:", resp.text)
            return

        data = resp.json()
        token = data.get('access') # JWT uses 'access'
        print(f"Token obtained: {token[:10]}..." if token else "No token found in response keys: " + str(data.keys()))
        
        if not token:
            print("Cannot proceed without token.")
            return

        # 2. Get History
        history_url = f"{BASE_URL}/api/history/"
        
        # JWT requires Bearer
        headers_bearer = {"Authorization": f"Bearer {token}"}
        
        print("\nRequesting History with Bearer...")
        hist_resp = requests.get(history_url, headers=headers_bearer)
        print(f"History Status (Bearer): {hist_resp.status_code}")
        
        if hist_resp.status_code == 401:
             print("Trying 'Token' prefix...")
             headers_token = {"Authorization": f"Token {token}"}
             hist_resp = requests.get(history_url, headers=headers_token)
             print(f"History Status (Token): {hist_resp.status_code}")

        if hist_resp.status_code == 200:
            history_data = hist_resp.json()
            items = history_data.get('history', [])
            print(f"\nFound {len(items)} items in history:")
            for item in items:
                print(f" - ID: {item.get('id')} | Title: {item.get('customer_segment')}")
        else:
            print("Failed to fetch history:", hist_resp.text)

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_flow()
