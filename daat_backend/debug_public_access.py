import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_public_access():
    print("--- Testing Public Access to /analyze-public/ ---")
    
    payload = {
        "customerSegment": "Public Tester",
        "problem": "Testing 401 error",
        "valueProposition": "A fix works"
    }
    
    try:
        # No headers (Anonymous)
        response = requests.post(f"{BASE_URL}/analyze-public/", json=payload)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Public Access Successful!")
            print(f"Response: {response.json()}")
        elif response.status_code == 401:
            print("❌ Still Unauthorized (401)")
        else:
            print(f"⚠️ Other Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    test_public_access()
