import os
import requests
import uuid
from dotenv import load_dotenv

load_dotenv('backend/.env')

key = os.getenv('CHAPA_SECRET_KEY', '').strip().strip('"').strip("'")
print(f"Using Key Prefix: {key[:8]}...")

tx_ref = f"test-{uuid.uuid4()}"
payload = {
    "amount": "100",
    "currency": "ETB",
    "email": "test@soultalk.com",
    "first_name": "Test",
    "last_name": "User",
    "tx_ref": tx_ref,
    # Intentionally OMIT phone_number to test full checkout
    "return_url": "https://google.com", 
    "customization": {
        "title": "SoulTalk Diagnostics",
        "description": "Testing Checkout Options"
    }
}

headers = {
    'Authorization': f'Bearer {key}',
    'Content-Type': 'application/json'
}

print("Initializing Payment...")
res = requests.post("https://api.chapa.co/v1/transaction/initialize", json=payload, headers=headers)
data = res.json()

if data.get('status') == 'success':
    print(f"SUCCESS: Checkout URL generated.")
    print(f"URL: {data['data']['checkout_url']}")
else:
    print(f"FAILED: {data}")
