import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soultalk_backend.settings')
django.setup()

from accounts.models import User, ProfessionalProfile

print("Checking User and ProfessionalProfile data...")
for user in User.objects.filter(role='professional'):
    print(f"\nUser: {user.email} (ID: {user.id})")
    try:
        profile = user.professional_profile
        print(f"  Profile ID: {profile.id}")
        print(f"  Phone: '{profile.phone}'")
        print(f"  DOB: '{profile.dob}'")
        print(f"  Specialization: '{profile.specialization}'")
        print(f"  ID Type: '{profile.id_type}'")
        print(f"  Bio: '{profile.bio[:30]}...' if profile.bio else 'None'")
    except ProfessionalProfile.DoesNotExist:
        print("  NO PROFESSIONAL PROFILE FOUND!")
