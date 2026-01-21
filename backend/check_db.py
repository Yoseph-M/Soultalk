import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'soultalk_backend.settings')
django.setup()

from accounts.models import User, ProfessionalProfile

latest_prof = User.objects.filter(role='professional').order_by('-id').first()
if latest_prof:
    print(f"User: {latest_prof.username} (ID: {latest_prof.id})")
    try:
        profile = latest_prof.professional_profile
        print(f"Profile ID: {profile.id}")
        print(f"ID image: {profile.id_image}")
        print(f"ID image back: {profile.id_image_back}")
        print(f"Certificates: {profile.certificates}")
        print(f"Profile photo: {profile.profile_photo}")
    except ProfessionalProfile.DoesNotExist:
        print("Profile does not exist!")
else:
    print("No professional user found.")
