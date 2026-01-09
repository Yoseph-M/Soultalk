
from google import genai
import os
import sys
import django
from django.conf import settings

sys.path.append('/Users/zube/Downloads/soultalk /backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soultalk_backend.settings')
django.setup()

try:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    print("Listing available models...")
    for m in client.models.list():
        print(m.name)
except Exception as e:
    print(f"Error: {e}")
