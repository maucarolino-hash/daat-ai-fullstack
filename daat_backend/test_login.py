
import requests
import json

def test_login():
    url = "http://localhost:8000/api/auth/login/"
    
    # Try with correct payload for 'email' auth method
    payload = {
        "email": "admin@daatai.com",
        "password": "admin123"
    }

    try:
        print(f"Sending POST to {url} with payload:", payload)
        response = requests.post(url, json=payload)
        
        print("Status Code:", response.status_code)
        print("Response Body:", response.text)
        
        if response.status_code == 200:
            print("SUCCESS! Login working.")
        else:
            print("FAILURE. Check error above.")

    except Exception as e:
        print("Exception:", e)

if __name__ == "__main__":
    test_login()
