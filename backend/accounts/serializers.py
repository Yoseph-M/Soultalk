from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator

User = get_user_model()

from .models import ClientProfile, ProfessionalProfile, AdminProfile

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(write_only=True)

    # Profile fields (writable and readable)
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True, write_only=True)
    dob = serializers.DateField(required=False, allow_null=True, write_only=True)
    specialization = serializers.CharField(required=False, allow_blank=True, allow_null=True, write_only=True)
    bio = serializers.CharField(required=False, allow_blank=True, allow_null=True, write_only=True)
    location = serializers.CharField(required=False, allow_blank=True, allow_null=True, write_only=True)
    id_type = serializers.CharField(required=False, allow_blank=True, allow_null=True, write_only=True)
    
    # Files
    profile_photo = serializers.ImageField(required=False, allow_null=True, write_only=True)
    id_image = serializers.ImageField(required=False, allow_null=True, write_only=True)
    certificates = serializers.FileField(required=False, allow_null=True, write_only=True)

    # Read-only fields from professional profile
    rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    sessions_completed = serializers.SerializerMethodField()
    verified = serializers.BooleanField(required=False, write_only=True)
    languages = serializers.SerializerMethodField()
    is_online = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role', 'first_name', 'last_name', 
                  'phone', 'dob', 'specialization', 'bio', 'location', 'id_type',
                  'profile_photo', 'id_image', 'certificates',
                  'rating', 'review_count', 'sessions_completed', 'verified', 'languages', 'is_online')

    def get_rating(self, obj):
        try:
            return float(obj.professional_profile.rating)
        except:
            return 5.0

    def get_review_count(self, obj):
        try:
            return obj.professional_profile.review_count
        except:
            return 0

    def get_sessions_completed(self, obj):
        try:
            return obj.professional_profile.sessions_completed
        except:
            return 0

    def get_languages(self, obj):
        try:
            return obj.professional_profile.languages.split(',')
        except:
            return ['English']

    def get_is_online(self, obj):
        try:
            return obj.professional_profile.is_online
        except:
            return False

    def create(self, validated_data):
        print(f"Debug: Starting user creation for {validated_data.get('email')}")
        role = validated_data.pop('role', 'client')
        password = validated_data.pop('password')
        
        # Extract profile fields
        profile_fields = ['phone', 'dob', 'specialization', 'bio', 'location', 'id_type', 'profile_photo', 'id_image', 'certificates', 'verified']
        profile_data = {field: validated_data.pop(field, None) for field in profile_fields}
        
        try:
            # Create user
            user = User.objects.create_user(
                password=password,
                role=role,
                **validated_data
            )
            print(f"Debug: User created successfully with ID {user.id}")
            
            # Profile creation is handled by post_save signals, 
            # but we need to update with the extra fields provided during signup
            try:
                if role == 'client':
                    profile, _ = ClientProfile.objects.get_or_create(user=user)
                    if profile_data.get('phone'): profile.phone = profile_data['phone']
                    if profile_data.get('dob'): profile.dob = profile_data['dob']
                    profile.save()
                    print("Debug: Client profile saved")
                elif role == 'professional':
                    profile, _ = ProfessionalProfile.objects.get_or_create(user=user)
                    for attr, value in profile_data.items():
                        if value is not None:
                            setattr(profile, attr, value)
                    profile.save()
                    print("Debug: Professional profile saved with files")
                elif role == 'admin':
                    AdminProfile.objects.get_or_create(user=user)
                    print("Debug: Admin profile created")
            except Exception as e:
                print(f"Error saving profile details (likely file storage issue): {str(e)}")
                # Retry without files if professional
                if role == 'professional':
                    try:
                         # Refresh to get clean state
                         profile = ProfessionalProfile.objects.get(user=user)
                         file_fields = ['profile_photo', 'id_image', 'certificates']
                         for attr, value in profile_data.items():
                             if value is not None and attr not in file_fields:
                                 setattr(profile, attr, value)
                         profile.save()
                         print("Recovered: Saved professional profile without files.")
                    except Exception as e2:
                         print(f"Critical error saving profile retry: {str(e2)}")
                         # If we can't even save basic info, we should probably delete the user 
                         # to allow another attempt, but for now just raise
                         raise e2
                else:
                    raise e
                
            return user
        except Exception as e:
            print(f"FATAL Signup Error: {str(e)}")
            import traceback
            traceback.print_exc()
            raise serializers.ValidationError({"detail": str(e)})

    def update(self, instance, validated_data):
        # Extract profile fields
        profile_fields = ['phone', 'dob', 'specialization', 'bio', 'location', 'id_type', 'profile_photo', 'id_image', 'certificates', 'verified']
        profile_data = {field: validated_data.pop(field) for field in profile_fields if field in validated_data}

        # Handle User fields
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                # Only set attributes that exist on the User model
                if hasattr(instance, attr):
                    setattr(instance, attr, value)
        instance.save()

        if instance.role == 'client':
            profile, _ = ClientProfile.objects.get_or_create(user=instance)
            if 'phone' in profile_data: profile.phone = profile_data['phone']
            if 'dob' in profile_data: profile.dob = profile_data['dob']
            profile.save()
        elif instance.role == 'professional':
            profile, _ = ProfessionalProfile.objects.get_or_create(user=instance)
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()
            
        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Populate profile fields in response if they were not already populated
        try:
            if instance.role == 'client':
                data['phone'] = instance.client_profile.phone
                data['dob'] = instance.client_profile.dob
            elif instance.role == 'professional':
                profile = instance.professional_profile
                data['phone'] = profile.phone
                data['dob'] = profile.dob
                data['specialization'] = profile.specialization
                data['bio'] = profile.bio
                data['location'] = profile.location
                data['id_type'] = profile.id_type
                data['profile_photo'] = profile.profile_photo.url if profile.profile_photo else None
                data['id_image'] = profile.id_image.url if profile.id_image else None
                data['certificates'] = profile.certificates.url if profile.certificates else None
                data['verified'] = profile.verified
        except:
            data['verified'] = False
        return data

class PublicUserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ('id', 'name', 'role')

    def get_name(self, obj):
        name = obj.get_full_name().strip()
        return name if name else obj.username

from .models import ChatSession, ChatMessage, Appointment, Notification, MoodUpdate, Payment, Withdrawal

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'role', 'content', 'timestamp']

class ChatSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSession
        fields = ['id', 'title', 'updated_at', 'created_at', 'is_pinned']

class AppointmentSerializer(serializers.ModelSerializer):
    client_name = serializers.SerializerMethodField()
    professional_name = serializers.SerializerMethodField()
    professional_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = ['id', 'client', 'professional', 'client_name', 'professional_name', 'professional_image', 'date', 'time', 'status', 'session_type', 'notes', 'created_at']

    def get_client_name(self, obj):
        name = obj.client.get_full_name().strip()
        return name if name else obj.client.username

    def get_professional_name(self, obj):
        name = obj.professional.get_full_name().strip()
        return name if name else obj.professional.username

    def get_professional_image(self, obj):
        try:
            if hasattr(obj.professional, 'professional_profile') and obj.professional.professional_profile.profile_photo:
                return obj.professional.professional_profile.profile_photo.url
        except:
            pass
        return None

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'title', 'message', 'type', 'link', 'is_read', 'created_at']

class MoodUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodUpdate
        fields = ['id', 'user', 'mood_score', 'note', 'created_at']
        read_only_fields = ['user']

from .models import Connection

class ConnectionSerializer(serializers.ModelSerializer):
    client_name = serializers.SerializerMethodField()
    professional_name = serializers.SerializerMethodField()

    class Meta:
        model = Connection
        fields = ['id', 'client', 'professional', 'client_name', 'professional_name', 'status', 'created_at']
        read_only_fields = ['client']

    def get_client_name(self, obj):
        name = obj.client.get_full_name().strip()
        return name if name else obj.client.username

    def get_professional_name(self, obj):
        name = obj.professional.get_full_name().strip()
        return name if name else obj.professional.username

from .models import DirectMessage

class DirectMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()

    class Meta:
        model = DirectMessage
        fields = ['id', 'sender', 'sender_name', 'receiver', 'content', 'is_read', 'created_at']
        read_only_fields = ['sender', 'is_read', 'created_at']

    def get_sender_name(self, obj):
        return obj.sender.get_full_name().strip() or obj.sender.username

class PaymentSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    class Meta:
        model = Payment
        fields = ['id', 'user', 'username', 'amount', 'currency', 'status', 'tx_ref', 'created_at']
        
    def get_username(self, obj):
        return obj.user.username

from .models import JournalEntry

class JournalEntrySerializer(serializers.ModelSerializer):
    client_name = serializers.SerializerMethodField()
    
    class Meta:
        model = JournalEntry
        fields = ['id', 'professional', 'client', 'client_name', 'title', 'content', 'media_file', 'entry_type', 'created_at']
        read_only_fields = ['professional']

    def get_client_name(self, obj):
        if obj.client:
            return obj.client.get_full_name().strip() or obj.client.username
class WithdrawalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Withdrawal
        fields = '__all__'
        read_only_fields = ['user', 'status', 'reference', 'created_at', 'updated_at']
