import requests
import json
import sys

# Using the task ID from the previous public access test would be ideal, 
# but I'll use a fake one as the view handles DoesNotExist gracefully (returns data: error).
# The important thing is HTTP 200, not 406.

URL = "http://localhost:8000/api/stream/db_task_99999/"

def test_sse():
    print(f"--- Testing SSE Connection to {URL} ---")
    headers = {"Accept": "text/event-stream"}
    
    try:
        with requests.get(URL, headers=headers, stream=True) as response:
            print(f"Status Code: {response.status_code}")
            print(f"Content-Type: {response.headers.get('Content-Type')}")
            
            if response.status_code == 200:
                print("✅ SSE Connection Accepted!")
                # Read first chunk
                for line in response.iter_lines():
                    if line:
                        print(f"Received: {line.decode('utf-8')}")
                        break # Just one line is enough to prove connection
            elif response.status_code == 406:
                print("❌ Still Not Acceptable (406)")
            else:
                print(f"⚠️ Other Status: {response.status_code}")

    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    test_sse()
