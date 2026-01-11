import requests
import os

def test_pdf_generation():
    # Use the admin credentials to get a token, although the view allows Any currently (as per code).
    # But let's be safe and auth.
    
    login_url = "http://localhost:8000/api/auth/login/"
    
    # 1. Login
    payload = {
        "email": "admin@daatai.com",
        "password": "admin123"
    }
    
    try:
        session = requests.Session()
        resp = session.post(login_url, json=payload)
        token = resp.json().get('access')
        
        # 2. Get a valid ID from history
        history_url = "http://localhost:8000/api/history/"
        headers = {"Authorization": f"Bearer {token}"}
        hist_resp = requests.get(history_url, headers=headers)
        data = hist_resp.json()
        
        if not data.get('history'):
            print("No history found to generate PDF from.")
            return

        # Pick the first one
        report_id = data['history'][0]['id']
        print(f"Testing PDF generation for Report ID: {report_id}")
        
        # 3. Request PDF
        # The URL in urls.py is: path('status/<str:report_id>/pdf/', views_pdf.generate_pdf_report)
        # Note: report_id might need 'db_task_' prefix based on view logic: clean_id = report_id.replace("db_task_", "")
        # So it accepts both.
        
        pdf_url = f"http://localhost:8000/api/status/db_task_{report_id}/pdf/"
        print(f"Downloading PDF from {pdf_url}...")
        
        pdf_resp = requests.get(pdf_url, headers=headers)
        
        if pdf_resp.status_code == 200:
            if pdf_resp.headers.get('Content-Type') == 'application/pdf':
                filename = f"test_report_{report_id}.pdf"
                with open(filename, 'wb') as f:
                    f.write(pdf_resp.content)
                print(f"SUCCESS: PDF saved to {filename} ({len(pdf_resp.content)} bytes)")
            else:
                print(f"FAILURE: Content-Type is {pdf_resp.headers.get('Content-Type')}")
                print(pdf_resp.text[:500])
        else:
            print(f"FAILURE: Status {pdf_resp.status_code}")
            print(pdf_resp.text)

    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_pdf_generation()
