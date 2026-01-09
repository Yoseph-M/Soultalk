import os
import sys
import django
from django.db import connections
from django.db.utils import OperationalError

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soultalk_backend.settings')
django.setup()

def check_db():
    db_conn = connections['default']
    try:
        db_conn.cursor()
        print("✅ Database connection successful.")
        sys.exit(0)
    except OperationalError as e:
        print(f"❌ Database connection failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    check_db()
