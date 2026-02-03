from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
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
        ('Verification & Approval', {'fields': ('verification_status', 'rejection_reason_type')}),
        ('Essential Documents', {'fields': ('profile_photo', 'id_type', 'id_image', 'certificates')}),
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
            return format_html('<img src="{}" style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover; border: 2px solid #25A8A0;" />', obj.professional_profile.profile_photo.url)
        return format_html('<div style="width: 45px; height: 45px; border-radius: 50%; background: #eee; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #25A8A0;">{}</div>', (obj.first_name[0] if obj.first_name else obj.username[0]).upper())
    profile_photo_preview.short_description = 'Photo'
    
    def refresh_column(self, obj):
        return ""
    refresh_column.short_description = mark_safe('<a href="javascript:location.reload();" style="color: black;"><i class="fas fa-sync"></i></a>')

    list_display = ('profile_photo_preview', 'get_full_name', 'email', 'is_active', 'refresh_column')
    list_filter = ('is_active', 'date_joined')
    search_fields = ('first_name', 'last_name', 'email', 'username')
    ordering = ('-date_joined',)
    
    fieldsets = (
        ('General', {'fields': ('username', 'password')}),
        ('Personal Identity', {'fields': ('first_name', 'last_name', 'email')}),
        ('Access Control & Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Timeline', {'fields': ('last_login', 'date_joined')}),
    )

# Professional-specific admin
class ProfessionalAdmin(BaseUserAdmin):
    inlines = (ProfessionalProfileInline,)
    
    def manage_button(self, obj):
        return format_html(
            '<a class="btn btn-xs btn-info" style="border-radius: 4px;" href="/admin/accounts/professional/{}/change/">'
            '<i class="fas fa-edit"></i> Manage'
            '</a>',
            obj.id
        )
    manage_button.short_description = 'Actions'

    def get_queryset(self, request):
        return super().get_queryset(request).filter(role='professional')
    
    def verification_status_view(self, obj):
        if not hasattr(obj, 'professional_profile'):
            return "-"
        status = obj.professional_profile.verification_status
        badges = {
            'verified': 'success',
            'pending': 'warning',
            'rejected': 'danger'
        }
        badge_type = badges.get(status, 'secondary')
        return format_html('<span class="badge badge-{}">{}</span>', badge_type, status.capitalize())
    verification_status_view.short_description = 'Status'

    list_display = ('profile_photo_preview', 'get_full_name', 'email', 'verification_status_view', 'manage_button', 'refresh_column')

# Client-specific admin
class ClientAdmin(BaseUserAdmin):
    inlines = (ClientProfileInline,)
    
    def manage_button(self, obj):
        return format_html(
            '<a class="btn btn-xs btn-info" style="border-radius: 4px;" href="/admin/accounts/client/{}/change/">'
            '<i class="fas fa-edit"></i> Manage'
            '</a>',
            obj.id
        )
    manage_button.short_description = 'Actions'

    def get_queryset(self, request):
        return super().get_queryset(request).filter(role='client')
    
    list_display = ('profile_photo_preview', 'get_full_name', 'email', 'is_active', 'manage_button', 'refresh_column')

# Admin-specific admin
class AdminUserAdmin(BaseUserAdmin):
    def manage_button(self, obj):
        return format_html(
            '<a class="btn btn-xs btn-info" style="border-radius: 4px;" href="/admin/accounts/adminuser/{}/change/">'
            '<i class="fas fa-edit"></i> Manage'
            '</a>',
            obj.id
        )
    manage_button.short_description = 'Actions'

    def get_queryset(self, request):
        return super().get_queryset(request).filter(role='admin')
    
    list_display = ('profile_photo_preview', 'get_full_name', 'email', 'is_active', 'manage_button', 'refresh_column')

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

# Profiles are only accessible via User Inlines now
# Removed direct @admin.register(ProfessionalProfile) and @admin.register(ClientProfile)
