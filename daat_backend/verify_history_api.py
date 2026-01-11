import requests
import json

def verify_history():
    login_url = "http://localhost:8000/api/auth/login/"
    history_url = "http://localhost:8000/api/history/"
    
    # 1. Login
    payload = {
        "email": "admin@daatai.com",
        "password": "admin123"
    }

    try:
        print(f"Logging in as {payload['email']}...")
        session = requests.Session()
        response = session.post(login_url, json=payload)
        
        if response.status_code != 200:
            print(f"Login Failed: {response.text}")
            return

        token = response.json().get('access_token') or response.json().get('key') or response.json().get('access')
        print(f"Login Success. Token: {token[:10]}...")
        
        # 2. Fetch History
        headers = {
            "Authorization": f"Bearer {token}"
        }
        print(f"Fetching History from {history_url}...")
        history_response = requests.get(history_url, headers=headers)
        
        if history_response.status_code == 200:
            data = history_response.json()
            print("History Response JSON:")
            print(json.dumps(data, indent=2))
            
            history_list = data.get('history', [])
            print(f"Found {len(history_list)} history items.")
            
            # Basic validation
            if len(history_list) > 0:
                item = history_list[0]
                required = ['id', 'customer_segment', 'created_at']
                missing = [f for f in required if f not in item]
                if missing:
                    print(f"WARNING: Missing fields in item: {missing}")
                else:
                    print("Structure looks correct.")
        else:
            print(f"History Fetch Failed: {history_response.status_code} - {history_response.text}")

    except Exception as e:
        print("Exception:", e)

if __name__ == "__main__":
    verify_history()
