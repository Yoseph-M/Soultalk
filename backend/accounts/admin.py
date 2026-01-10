from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from .models import User, ClientProfile, ProfessionalProfile, AdminProfile

# Inlines for Profiles
class ClientProfileInline(admin.StackedInline):
    model = ClientProfile
    can_delete = False
    verbose_name_plural = 'Client Profile'

class ProfessionalProfileInline(admin.StackedInline):
    model = ProfessionalProfile
    can_delete = False
    verbose_name_plural = 'Professional Profile'
    fieldsets = (
        (None, {'fields': ('specialization', 'bio', 'location', 'languages', 'is_online')}),
        ('Verification Status', {'fields': ('verification_status', 'rejection_reason', 'verified')}),
        ('Documents', {'fields': ('profile_photo', 'id_type', 'id_number', 'id_image', 'certificates')}),
        ('Stats', {'fields': ('rating', 'review_count', 'sessions_completed')}),
    )

# Base admin class with common configurations
class BaseUserAdmin(UserAdmin):
    def get_full_name(self, obj):
        if obj.first_name and obj.last_name:
            return f"{obj.first_name} {obj.last_name}"
        return obj.first_name or obj.username
    get_full_name.short_description = 'Full Name'

    def profile_photo_preview(self, obj):
        if hasattr(obj, 'professional_profile') and obj.professional_profile.profile_photo:
            return format_html('<img src="{}" style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover;" />', obj.professional_profile.profile_photo.url)
        return "-"
    profile_photo_preview.short_description = 'Photo'
    
    list_display = ('profile_photo_preview', 'get_full_name', 'email', 'role', 'date_joined', 'is_active')
    list_filter = ('role', 'is_active', 'date_joined')
    search_fields = ('first_name', 'last_name', 'email', 'username')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Role & Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

# Professional-specific admin
class ProfessionalAdmin(BaseUserAdmin):
    inlines = (ProfessionalProfileInline,)
    
    def manage_button(self, obj):
        return format_html('<a class="button btn btn-xs btn-info" href="{}">Verify & Edit</a>', obj.id)
    manage_button.short_description = 'Actions'

    def get_queryset(self, request):
        return super().get_queryset(request).filter(role='professional')
    
    def specialization_view(self, obj):
        return obj.professional_profile.specialization if hasattr(obj, 'professional_profile') else "-"
    specialization_view.short_description = 'Specialization'

    def verification_status_view(self, obj):
        if not hasattr(obj, 'professional_profile'):
            return "-"
        status = obj.professional_profile.verification_status
        colors = {
            'verified': 'green',
            'pending': 'orange',
            'rejected': 'red'
        }
        color = colors.get(status, 'black')
        return format_html('<span style="color: {}; font-weight: bold;">{}</span>', color, status.capitalize())
    verification_status_view.short_description = 'Status'

    list_display = ('profile_photo_preview', 'get_full_name', 'email', 'verification_status_view', 'manage_button')

# Client-specific admin
class ClientAdmin(BaseUserAdmin):
    inlines = (ClientProfileInline,)
    
    def manage_button(self, obj):
        return format_html('<a class="button btn btn-xs btn-info" href="{}">Edit Details</a>', obj.id)
    manage_button.short_description = 'Actions'

    def get_queryset(self, request):
        return super().get_queryset(request).filter(role='client')
    
    list_display = ('get_full_name', 'email', 'date_joined', 'manage_button')

# Admin-specific admin
class AdminUserAdmin(BaseUserAdmin):
    def get_queryset(self, request):
        return super().get_queryset(request).filter(role='admin')
    list_display = ('get_full_name', 'email', 'is_staff', 'is_superuser')

# Proxy models for separate admin sections
class Client(User):
    class Meta:
        proxy = True
        verbose_name = 'Client'
        verbose_name_plural = 'Clients'

class Professional(User):
    class Meta:
        proxy = True
        verbose_name = 'Professional'
        verbose_name_plural = 'Professionals'

class AdminUser(User):
    class Meta:
        proxy = True
        verbose_name = 'Admin User'
        verbose_name_plural = 'Admin Users'

# Unregister and Register
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

admin.site.register(User, BaseUserAdmin)
admin.site.register(Client, ClientAdmin)
admin.site.register(Professional, ProfessionalAdmin)
admin.site.register(AdminUser, AdminUserAdmin)

# Profiles are only accessible via User Inlines now
# Removed direct @admin.register(ProfessionalProfile) and @admin.register(ClientProfile)
