import requests
import json

BASE_URL = "http://localhost:8000"
# Based on previous seed output, admin ID=1 -> diag=41, Mauricio ID=2 -> diag=42
# We want to check for Mauricio's diagnostic.
TASK_ID = "db_task_42" 
URL = f"{BASE_URL}/api/status/{TASK_ID}/"

print(f"--- Fetching {URL} ---")
try:
    response = requests.get(URL)
    print(f"Status: {response.status_code}")
    try:
        data = response.json()
        print(json.dumps(data, indent=2))
        
        if 'data' in data and 'result' in data['data']:
            res = data['data']['result']
            print(f"\nType of 'result': {type(res)}")
            if isinstance(res, str):
                print("WARNING: 'result' is a STRING. Needs parsing.")
            elif isinstance(res, dict):
                print("OK: 'result' is a DICT.")
            elif res is None:
                print("ERROR: 'result' is NONE.")
                
    except Exception as e:
        print(f"Failed to parse JSON: {e}")
        print(response.text)
except Exception as e:
    print(f"Request failed: {e}")
