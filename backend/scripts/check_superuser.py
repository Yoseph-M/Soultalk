import os
import sys
import django

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soultalk_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("--- User Accounts ---")
users = User.objects.all()
if not users.exists():
    print("No users found in database.")
else:
    for u in users:
        print(f"Username: {u.username}, Email: {u.email}, Staff: {u.is_staff}, Superuser: {u.is_superuser}, Active: {u.is_active}")

print("---------------------")
