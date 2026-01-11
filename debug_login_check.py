import requests
import json

BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/api/auth/login/"
EMAIL = "maucarolino@gmail.com"
PASSWORD = "password123"

def test_login(payload, name):
    print(f"\n--- Testing {name} ---")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    try:
        response = requests.post(LOGIN_URL, json=payload)
        print(f"Status Code: {response.status_code}")
        try:
            print(f"Response: {json.dumps(response.json(), indent=2)}")
        except:
            print(f"Response (text): {response.text}")
            
        if response.status_code == 200:
            print(">>> SUCCESS! <<<")
            return True
        else:
            print(">>> FAILED <<<")
            return False
    except Exception as e:
        print(f"Error: {e}")
        return False

# Test Case 1: Standard dj-rest-auth with email config
payload1 = {
    "email": EMAIL,
    "password": PASSWORD
}

# Test Case 2: Frontend simulation (sending username as email)
payload2 = {
    "username": EMAIL,
    "email": EMAIL,
    "password": PASSWORD
}

# Test Case 3: Only username as email
payload3 = {
    "username": EMAIL,
    "password": PASSWORD
}

print("Checking connectivity...")
try:
    requests.get(BASE_URL, timeout=2)
    print("Server is reachable.")
except:
    print("!!! Server not reachable at localhost:8000. Is it running?")

test_login(payload1, "Email + Password")
test_login(payload2, "Frontend Payload (Username=Email + Email)")
test_login(payload3, "Username=Email + Password")
