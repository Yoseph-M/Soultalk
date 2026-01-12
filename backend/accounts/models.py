from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('client', 'Client'),
        ('professional', 'Professional'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')

    def __str__(self):
        if self.first_name or self.last_name:
            return f"{self.first_name} {self.last_name}".strip()
        return self.username

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.role == 'client':
            ClientProfile.objects.get_or_create(user=instance)
        elif instance.role == 'professional':
            ProfessionalProfile.objects.get_or_create(user=instance)
        elif instance.role == 'admin':
            AdminProfile.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if instance.role == 'client' and hasattr(instance, 'client_profile'):
        instance.client_profile.save()
    elif instance.role == 'professional' and hasattr(instance, 'professional_profile'):
        instance.professional_profile.save()
    elif instance.role == 'admin' and hasattr(instance, 'admin_profile'):
        instance.admin_profile.save()

class ClientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    phone = models.CharField(max_length=20, blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    
    def __str__(self):
        return f"Client: {self.user.username}"

class ProfessionalProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='professional_profile')
    phone = models.CharField(max_length=20, blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    specialization = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    ID_TYPE_CHOICES = (
        ('passport', 'International Passport'),
        ('national_id', 'National ID Card'),
        ('driver_license', 'Driver\'s License'),
        ('professional_id', 'Professional ID / License'),
    )
    profile_photo = models.ImageField(upload_to='profiles/', blank=True, null=True)
    id_type = models.CharField(max_length=50, choices=ID_TYPE_CHOICES, blank=True, null=True)
    id_image = models.ImageField(upload_to='ids/', blank=True, null=True)
    id_image_back = models.ImageField(upload_to='ids/', blank=True, null=True)
    certificates = models.FileField(upload_to='certificates/', blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    review_count = models.IntegerField(default=0)
    sessions_completed = models.IntegerField(default=0)
    location = models.CharField(max_length=100, default='Global')
    VERIFICATION_CHOICES = (
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    )
    REJECTION_REASON_CHOICES = (
        ('invalid_id', 'Invalid or Expired ID'),
        ('unclear_certificates', 'Unclear or Missing Certificates'),
        ('fake_profile', 'Potential Fake Profile / Identity Issue'),
        ('insufficient_bio', 'Incomplete or Low Quality Bio'),
        ('other', 'Other (View/Edit Below)'),
    )
    verification_status = models.CharField(max_length=20, choices=VERIFICATION_CHOICES, default='pending')
    rejection_reason_type = models.CharField(max_length=50, choices=REJECTION_REASON_CHOICES, blank=True, null=True, verbose_name="Reason Category")
    rejection_reason = models.TextField(blank=True, null=True, verbose_name="Detailed Feedback")
    verified = models.BooleanField(default=False)
    languages = models.CharField(max_length=255, default='English') # Comma separated
    is_online = models.BooleanField(default=False)
    id_number = models.CharField(max_length=50, blank=True, null=True)
    issuing_authority = models.CharField(max_length=100, blank=True, null=True)
    has_documents = models.BooleanField(default=False)
    
    # Financials
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    def save(self, *args, **kwargs):
        # Sync verified boolean with status
        self.verified = (self.verification_status == 'verified')
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Professional: {self.user.username}"

class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='admin_profile')
    department = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return f"Admin: {self.user.username}"

class ChatSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_sessions')
    title = models.CharField(max_length=255, default="New Chat")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_pinned = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.title}"

    class Meta:
        ordering = ['-is_pinned', '-updated_at']

class ChatMessage(models.Model):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('assistant', 'Assistant'),
    )
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.role} message in {self.session.title}"

    class Meta:
        ordering = ['timestamp']
class Appointment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('upcoming', 'Upcoming'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    SESSION_TYPE_CHOICES = (
        ('video', 'Video Call'),
        ('audio', 'Audio Call'),
        ('chat', 'Chat'),
    )
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client_appointments')
    professional = models.ForeignKey(User, on_delete=models.CASCADE, related_name='professional_appointments')
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    session_type = models.CharField(max_length=10, choices=SESSION_TYPE_CHOICES, default='video')
    created_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.client.username} with {self.professional.username} on {self.date}"

    class Meta:
        ordering = ['date', 'time']

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=50, default='general') # 'general', 'live_request', etc.
    link = models.CharField(max_length=255, blank=True, null=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"

    class Meta:
        ordering = ['-created_at']

class MoodUpdate(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mood_updates')
    mood_score = models.IntegerField()  # 1-5
    note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.mood_score} on {self.created_at.date()}"

    class Meta:
        ordering = ['-created_at']

class Connection(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    )
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='professional_connections')
    professional = models.ForeignKey(User, on_delete=models.CASCADE, related_name='client_connections')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.client.username} to {self.professional.username} ({self.status})"

    class Meta:
        unique_together = ('client', 'professional')
        ordering = ['-created_at']

class DirectMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"From {self.sender.username} to {self.receiver.username}"

    class Meta:
        ordering = ['created_at']

class Payment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='ETB')
    email = models.EmailField()
    tx_ref = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.amount} {self.currency} - {self.status}"

class Withdrawal(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='withdrawals')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='ETB')
    bank_name = models.CharField(max_length=100)
    bank_code = models.CharField(max_length=20)
    account_number = models.CharField(max_length=50)
    account_name = models.CharField(max_length=100)
    reference = models.CharField(max_length=100, unique=True, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Withdrawal: {self.user.username} - {self.amount} {self.currency}"

class JournalEntry(models.Model):
    ENTRY_TYPE_CHOICES = (
        ('text', 'Text'),
        ('audio', 'Audio'),
        ('video', 'Video'),
    )
    professional = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journal_entries_authored')
    client = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='journal_entries_about')
    
    title = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    media_file = models.FileField(upload_to='journal_media/', blank=True, null=True)
    entry_type = models.CharField(max_length=10, choices=ENTRY_TYPE_CHOICES, default='text')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.professional.username} - {self.entry_type} - {self.created_at}"
    
    class Meta:
        ordering = ['-created_at']
