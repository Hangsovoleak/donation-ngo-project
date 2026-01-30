import requests
import json

url = "http://localhost:8000/api/auth/login"
payload = {
    "email": "panha@gmail.com",
    "password": "panha123"
}
headers = {
    "Content-Type": "application/json"
}

print(f"Sending POST to {url}...")
print(f"Payload: {json.dumps(payload)}")

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
