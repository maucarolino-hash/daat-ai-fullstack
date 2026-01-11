
import requests
import random
import string

def test_registration():
    url = "http://localhost:8000/api/auth/registration/"
    
    # Generate random email to avoid "already exists" error
    rand_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    email = f"user_{rand_suffix}@example.com"
    password = "password123"
    
    payload = {
        "email": email,
        "password": password,
        "password1": password, # Backend pediu explicitamente
        "password2": password, # Confirmação
        "username": email.split('@')[0], 
        "first_name": "Test User"
    }

    print(f"Attempting registration for {email}...")
    
    try:
        response = requests.post(url, json=payload)
        
        print("Status Code:", response.status_code)
        print("Response Body:", response.text)
        
        if response.status_code == 201 or response.status_code == 200:
            print("SUCCESS! User created.")
            
            # Now try to login with this new user
            login_url = "http://localhost:8000/api/auth/login/"
            login_payload = {
                "email": email,
                "password": password,
                "username": email, # Tentativa: enviar email como username também
            }
            print("Attempting login...")
            login_resp = requests.post(login_url, json=login_payload)
            print("Login Status:", login_resp.status_code)
            print("Login Body:", login_resp.text)
            
        else:
            print("FAILURE. Registration rejected.")

    except Exception as e:
        print("Exception:", e)

if __name__ == "__main__":
    test_registration()
