import requests
import json

url = "http://127.0.0.1:8000/api/analyze-public/"
payload = {
    "customerSegment": "Test Segment",
    "problem": "Test Problem",
    "valueProposition": "Test Value Prop"
}
headers = {
    "Content-Type": "application/json"
}

try:
    print(f"Testing POST to {url} ...")
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text[:200]}")
    
    if response.status_code in [200, 201]:
        print("SUCCESS: Endpoint accepts trailing slash!")
    else:
        print("FAILURE: Endpoint returned unexpected status.")

except Exception as e:
    print(f"ERROR: {e}")
