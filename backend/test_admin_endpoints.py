import requests

def test_admin_api():
    try:
        login_data = {"username": "admin@agrolink.com", "password": "adminpassword"}
        r = requests.post("http://127.0.0.1:8000/api/v1/auth/login/access-token", data=login_data)
        if r.status_code != 200:
            print(f"Login failed: {r.text}")
            return
            
        token = r.json()["access_token"]
        print(f"Token obtained: {token[:20]}...")
        
        headers = {"Authorization": f"Bearer {token}"}
        
        print("Fetching unverified buyers...")
        r2 = requests.get("http://127.0.0.1:8000/api/v1/admin/unverified-buyers", headers=headers)
        print(f"Buyers response: {r2.status_code}")
        if r2.status_code == 200:
            print(f"Found {len(r2.json())} unverified buyers")
        else:
            print(r2.text)

        print("Fetching unverified farmers...")
        r3 = requests.get("http://127.0.0.1:8000/api/v1/admin/unverified-farmers", headers=headers)
        print(f"Farmers response: {r3.status_code}")
        if r3.status_code == 200:
            print(f"Found {len(r3.json())} unverified farmers")
        else:
            print(r3.text)

    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    test_admin_api()
