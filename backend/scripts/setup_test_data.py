import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soultalk_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import ProfessionalProfile, ClientProfile, Connection

User = get_user_model()

def setup_test_users():
    # 1. Create/Update Professional
    pro_user, created = User.objects.get_or_create(
        username='dr_test',
        defaults={
            'email': 'dr_test@example.com',
            'first_name': 'Sarah',
            'last_name': 'Bennett',
            'role': 'professional'
        }
    )
    if created:
        pro_user.set_password('password123')
        pro_user.save()
        print(f"Created Professional: {pro_user.username}")
    
    # Ensure Professional Profile exists and is ONLINE
    pro_profile, _ = ProfessionalProfile.objects.get_or_create(user=pro_user)
    pro_profile.is_online = True
    pro_profile.specialization = "Anxiety & Stress"
    pro_profile.bio = "Expert in cognitive behavioral therapy and stress management."
    pro_profile.verified = True
    pro_profile.save()
    print(f"✅ Set {pro_user.username} to ONLINE")

    # 2. Create/Update Client
    client_user, created = User.objects.get_or_create(
        username='client_test',
        defaults={
            'email': 'client_test@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'role': 'client'
        }
    )
    if created:
        client_user.set_password('password123')
        client_user.save()
        print(f"Created Client: {client_user.username}")

    ClientProfile.objects.get_or_create(user=client_user)

    # 3. Create Connection
    connection, created = Connection.objects.get_or_create(
        client=client_user,
        professional=pro_user,
        defaults={'status': 'accepted'}
    )
    if not created and connection.status != 'accepted':
        connection.status = 'accepted'
        connection.save()
        print(f"Updated connection to ACCEPTED")
    else:
        print(f"Connection status: {connection.status}")

    print("\n" + "="*50)
    print("TEST DATA SETUP COMPLETE")
    print("="*50)
    print("Professional Login:")
    print(f"Username: {pro_user.username}")
    print("Password: password123")
    print("Status: ONLINE")
    print("-" * 30)
    print("Client Login:")
    print(f"Username: {client_user.username}")
    print("Password: password123")
    print("Status: Connected to Dr. Bennett")
    print("="*50)

if __name__ == '__main__':
    setup_test_users()
