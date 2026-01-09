
from google import genai
import os
import sys
import django
from django.conf import settings

# Fix path for django setup
sys.path.append('/Users/zube/Downloads/soultalk /backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soultalk_backend.settings')
django.setup()

client = genai.Client(api_key=settings.GEMINI_API_KEY)

models_to_try = [
    'gemini-2.0-flash', 
    'gemini-1.5-pro-latest',
    'gemini-2.5-flash-lite'
]

for m_name in models_to_try:
    print(f"Testing {m_name}...")
    try:
        response = client.models.generate_content(model=m_name, contents="Hello")
        print(f"SUCCESS with {m_name}: {response.text}")
        break
    except Exception as e:
        print(f"FAILED {m_name}: {e}")
