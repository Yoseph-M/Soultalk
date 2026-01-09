import os
import sys
import django

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soultalk_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

try:
    admin_user = User.objects.get(username='admin')
    print(f"Current role for 'admin': {admin_user.role}")
    
    if admin_user.role != 'admin':
        admin_user.role = 'admin'
        admin_user.save()
        print(f"✅ Updated role for 'admin' to: {admin_user.role}")
    else:
        print("Role is already correct.")

except User.DoesNotExist:
    print("❌ User 'admin' not found.")
