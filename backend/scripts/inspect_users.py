import os
import sys
import django

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soultalk_backend.settings')
django.setup()

from django.conf import settings
from django.db import connection

print(f"Checking database configuration...")
db_settings = settings.DATABASES['default']
print(f"Engine: {db_settings.get('ENGINE')}")
print(f"Name: {db_settings.get('NAME')}")
print(f"Host: {db_settings.get('HOST')}")
print(f"Port: {db_settings.get('PORT')}")

from django.contrib.auth import get_user_model
User = get_user_model()

print(f"\nUser Model: {User._meta.label}")
print(f"Database Table: {User._meta.db_table}")

print("\n--- User Accounts in DB ---")
with connection.cursor() as cursor:
    cursor.execute(f"SELECT username, email, is_staff, is_superuser, is_active FROM {User._meta.db_table}")
    rows = cursor.fetchall()
    if not rows:
        print("No users found in the table.")
    else:
        for row in rows:
            print(f"Username: {row[0]}, Email: {row[1]}, Staff: {row[2]}, Superuser: {row[3]}, Active: {row[4]}")
print("---------------------------")
