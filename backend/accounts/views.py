from rest_framework import generics, permissions, views, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.conf import settings
from google import genai
from .serializers import (
    UserSerializer, ChatSessionSerializer, ChatMessageSerializer,
    AppointmentSerializer, NotificationSerializer, MoodUpdateSerializer, ConnectionSerializer,
    PaymentSerializer, JournalEntrySerializer, WithdrawalSerializer
)
from .models import User, ChatSession, ChatMessage, Appointment, Notification, MoodUpdate, Connection, ProfessionalProfile, Payment, JournalEntry, Withdrawal
import uuid
import requests
import json
from datetime import datetime

class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

class UserDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user

class ChatSessionListView(generics.ListAPIView):
    serializer_class = ChatSessionSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)

class ChatSessionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ChatSessionSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        messages = ChatMessage.objects.filter(session=instance)
        message_serializer = ChatMessageSerializer(messages, many=True)
        return Response({
            'session': serializer.data,
            'messages': message_serializer.data
        })

class AIChatView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        message_content = request.data.get('message')
        session_id = request.data.get('session_id')
        
        if not message_content:
            return Response({'error': 'Message is required'}, status=400)

        if session_id:
            session = get_object_or_404(ChatSession, id=session_id, user=request.user)
        else:
            title = message_content[:50] + "..." if len(message_content) > 50 else message_content
            session = ChatSession.objects.create(user=request.user, title=title)
            session_id = session.id

        ChatMessage.objects.create(
            session=session,
            role='user',
            content=message_content
        )

        try:
            print(f"Debug: Using Gemini Key: {settings.GEMINI_API_KEY[:5]}...")
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            
            history = []
            # Get last 10 messages for context (proper ordering)
            # We need them chronological for Gemini: Oldest -> Newest
            previous_messages = ChatMessage.objects.filter(session=session).order_by('-timestamp')[:10]
            # Reverse to get chronological order from the slice
            chronological_msgs = reversed(previous_messages)
            
            for msg in chronological_msgs:
                role = 'user' if msg.role == 'user' else 'model'
                # Gemini expects valid non-empty content
                if msg.content and msg.content.strip():
                     history.append({'role': role, 'parts': [{'text': msg.content}]})

            print(f"Debug: History length: {len(history)}")

            chat = client.chats.create(model='gemini-1.5-flash', history=history)
            
            prompt = f"""You are SoulTalk AI, a compassionate mental wellness companion.
User says: {message_content}"""
            response = chat.send_message(prompt)
            ai_reply = response.text
            
            print(f"Debug: AI Reply received: {ai_reply[:20]}...")

            ChatMessage.objects.create(
                session=session,
                role='assistant',
                content=ai_reply
            )
            
            session.save() 

            return Response({
                'reply': ai_reply,
                'session_id': session.id,
                'title': session.title
            })

        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"Gemini API Error Detail: {str(e)}")
            return Response({'error': f"AI Service Error: {str(e)}"}, status=500)

class UserListView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        users = User.objects.all()
        data = {
            'clients': UserSerializer(users.filter(role='client'), many=True).data,
            'professionals': UserSerializer(users.filter(role='professional'), many=True).data,
            'admins': UserSerializer(users.filter(role='admin'), many=True).data,
        }
        return Response(data)

    def patch(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        user_id = request.data.get('id')
        if not user_id:
            return Response({'error': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        user = get_object_or_404(User, id=user_id)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfessionalListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        # Clients should only see verified professionals
        if self.request.user.role == 'client':
            return User.objects.filter(role='professional', professional_profile__verified=True)
        # Admins or others can see all
        return User.objects.filter(role='professional')

class ClientListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'professional':
            connected_client_ids = Connection.objects.filter(
                professional=user, 
                status='accepted'
            ).values_list('client_id', flat=True)
            
            appointment_client_ids = Appointment.objects.filter(
                professional=user
            ).values_list('client_id', flat=True)
            
            client_ids = set(connected_client_ids) | set(appointment_client_ids)
            return User.objects.filter(id__in=client_ids)
        return User.objects.filter(role='client')

class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        from django.utils import timezone
        
        # Auto-cancel past appointments
        now = timezone.now()
        today = now.date()
        current_time = now.time()
        
        # Cancel appointments from previous days
        Appointment.objects.filter(
            status__in=['pending', 'upcoming'],
            date__lt=today
        ).update(status='cancelled')
        
        # Cancel appointments from today that have passed
        Appointment.objects.filter(
            status__in=['pending', 'upcoming'],
            date=today,
            time__lt=current_time
        ).update(status='cancelled')

        # Detect and fix double bookings (keep earliest, cancel others)
        from django.db.models import Count
        duplicates = Appointment.objects.filter(
            status__in=['pending', 'upcoming']
        ).values('client', 'professional').annotate(
            count=Count('id')
        ).filter(count__gt=1)

        for dup in duplicates:
            # Get all active appointments for this pair
            apps = Appointment.objects.filter(
                client_id=dup['client'],
                professional_id=dup['professional'],
                status__in=['pending', 'upcoming']
            ).order_by('created_at') # Keep earliest
            
            # Skip the first one, cancel the rest
            for app in apps[1:]:
                app.status = 'cancelled'
                app.save()

        user = self.request.user
        if user.role == 'client':
            return Appointment.objects.filter(client=user).order_by('date', 'time')
        elif user.role == 'professional':
            return Appointment.objects.filter(professional=user).order_by('date', 'time')
        return Appointment.objects.all().order_by('date', 'time')

    def perform_create(self, serializer):
        client = self.request.user
        professional = serializer.validated_data['professional']
        
        # Check for existing active appointment
        if Appointment.objects.filter(
            client=client, 
            professional=professional, 
            status__in=['pending', 'upcoming']
        ).exists():
             raise ValidationError("You already have an active appointment with this professional.")

        # Default status is 'pending' from model, but we can be explicit
        serializer.save(client=self.request.user)

class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'client':
            return Appointment.objects.filter(client=user)
        elif user.role == 'professional':
            return Appointment.objects.filter(professional=user)
        return Appointment.objects.all()

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

class NotificationMarkReadView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, pk):
        notification = get_object_or_404(Notification, id=pk, user=request.user)
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})

class MoodUpdateListCreateView(generics.ListCreateAPIView):
    serializer_class = MoodUpdateSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return MoodUpdate.objects.filter(user=self.request.user).order_by('created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ConnectionListCreateView(generics.ListCreateAPIView):
    serializer_class = ConnectionSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'client':
            return Connection.objects.filter(client=user)
        elif user.role == 'professional':
            return Connection.objects.filter(professional=user)
        return Connection.objects.all()

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

class ConnectionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ConnectionSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'client':
            return Connection.objects.filter(client=user)
        elif user.role == 'professional':
            return Connection.objects.filter(professional=user)
        return Connection.objects.all()
        return Connection.objects.all()

class UpdateOnlineStatusView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.user.role != 'professional':
            return Response({'error': 'Only professionals can set online status'}, status=status.HTTP_403_FORBIDDEN)
        
        is_online = request.data.get('is_online')
        if is_online is None:
            return Response({'error': 'is_online field is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get or create profile to be safe
        profile, created = ProfessionalProfile.objects.get_or_create(user=request.user)
        profile.is_online = bool(is_online)
        profile.save()
        
        profile.save()
        
        profile.save()
        
        return Response({'status': 'success', 'is_online': profile.is_online})

class ZegoTokenView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        room_id = request.query_params.get('room_id')
        if not room_id:
            return Response({'error': 'room_id required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # For ZegoUIKitPrebuilt, the "Kit Token" is usually generated on frontend for simplicity
        # but for security we provide the AppID and simulate the token or provide a server-generated one.
        # However, for the UIKit 'Kit Token', it is best to just provide the AppID and have the 
        # Server generate a standard RTC Token.
        # But to keep using the UIKit seamless logic, we will return the AppID 
        # and let the frontend use it.
        
        # Actually, let's return the APP_ID so the frontend knows it.
        # The true secure way is generating a full RTC token here.
        # For now, let's at least hide the SECRET by not having it on frontend.
        
        return Response({
            'app_id': settings.ZEGO_APP_ID,
            # We don't send the secret!
        })

from .serializers import DirectMessageSerializer, PublicUserSerializer

class PublicUserDetailView(generics.RetrieveAPIView):
    serializer_class = PublicUserSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        # If the requested user is a professional, only show if verified
        # This is simple: just filter the whole queryset for professionals
        # Non-professionals (clients) are always visible to authenticated users (e.g. for connection display)
        from django.db.models import Q
        return User.objects.filter(
            Q(role='client') | 
            (Q(role='professional') & Q(professional_profile__verified=True))
        )

class InitiateLiveSessionView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        professional_id = request.data.get('professional_id')
        session_type = request.data.get('type') # 'video', 'voice', 'chat'
        session_id = request.data.get('session_id')
        
        professional = get_object_or_404(
            User, 
            id=professional_id, 
            role='professional',
            professional_profile__verified=True
        )
        client_name = request.user.get_full_name() or request.user.username
        
        title = f"Incoming {session_type.capitalize()} Request"
        message = f"{client_name} wants to connect with you via {session_type}."
        
        # Determine link
        if session_type == 'chat':
            link = f"/chat/{session_id}"
        else:
            link = f"/live/{session_id}?mode={session_type}"
            
        Notification.objects.create(
            user=professional,
            title=title,
            message=message,
            type='live_request',
            link=link
        )
        
        return Response({'status': 'success'})

class DirectMessageView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        other_user_id = request.query_params.get('user_id')
        if not other_user_id:
            return Response({'error': 'user_id param required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get messages between current user and other user
        messages = DirectMessage.objects.filter(
            (Q(sender=request.user) & Q(receiver_id=other_user_id)) |
            (Q(sender_id=other_user_id) & Q(receiver=request.user))
        ).order_by('created_at')
        
        serializer = DirectMessageSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request):
        receiver_id = request.data.get('receiver')
        content = request.data.get('content')
        
        if not receiver_id or not content:
            return Response({'error': 'receiver and content required'}, status=status.HTTP_400_BAD_REQUEST)
            
        message = DirectMessage.objects.create(
            sender=request.user,
            receiver_id=receiver_id,
            content=content
        )
        
        serializer = DirectMessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class InitializePaymentView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        amount = request.data.get('amount')
        email = request.data.get('email')
        first_name = request.data.get('first_name', request.user.first_name)
        last_name = request.data.get('last_name', request.user.last_name)
        
        if not amount or not email:
            return Response({'error': 'Amount and email are required'}, status=status.HTTP_400_BAD_REQUEST)

        tx_ref = f"soultalk-{uuid.uuid4()}"
        
        # Save pending payment
        payment = Payment.objects.create(
            user=request.user,
            amount=amount,
            email=email,
            tx_ref=tx_ref,
            status='pending'
        )

        # Try to get phone from profile
        phone_number = None
        try:
            p = ""
            if request.user.role == 'client':
                p = request.user.client_profile.phone
            elif request.user.role == 'professional':
                p = request.user.professional_profile.phone
            
            if p:
                # Clean: keep only digits
                phone_number = "".join(filter(str.isdigit, str(p)))
        except:
            pass
            
        # Ensure names are not empty strings
        if not first_name or str(first_name).strip() == "":
            first_name = request.user.username
        if not last_name or str(last_name).strip() == "":
            last_name = "User"

        # Initialize with Chapa
        url = "https://api.chapa.co/v1/transaction/initialize"
        payload = {
            "amount": str(amount),
            "currency": "ETB",
            "email": email,
            "first_name": str(first_name).strip(),
            "last_name": str(last_name).strip(),
            "tx_ref": tx_ref,
            "return_url": f"{settings.FRONTEND_URL}/payment/success?tx_ref={tx_ref}",
            "customization": {
                "title": "SoulTalk Payment",
                "description": "Payment for SoulTalk Services"
            }
        }
        
        
        # REMOVED: Do not send phone_number to Chapa. 
        # Sending it (especially if it's the user's profile phone) can lock the checkout 
        # to a specific method or pre-fill it incorrectly.
        # Letting Chapa handle the input on their hosted page ensures the User sees the 
        # full "Select Payment Method" screen (Wallets, Cards, Banks).
        
        chapa_key = getattr(settings, 'CHAPA_SECRET_KEY', None)
        if not chapa_key:
             return Response({'error': 'Chapa Secret Key missing'}, status=500)
        
        chapa_key = chapa_key.strip().strip('"').strip("'")
        
        headers = {
            'Authorization': f'Bearer {chapa_key}', 
            'Content-Type': 'application/json'
        }

        try:
            
            print(f"Debug: Initializing Chapa for {email} with amount {amount}")
            response = requests.post(url, json=payload, headers=headers)
            try:
                data = response.json()
            except:
                data = {'message': response.text}
                
            print(f"Debug: Chapa Response: {data}")
            
            if data.get('status') == 'success':
                return Response({
                    'checkout_url': data['data']['checkout_url'],
                    'tx_ref': tx_ref
                })
            else:
                error_msg = f"Chapa Payment Error: {data.get('message', 'Unknown error')}"
                with open('payment_errors.log', 'a') as f:
                    f.write(f"{datetime.now()}: {error_msg} | Payload: {payload}\n")
                return Response({
                    'error': error_msg
                }, status=400)
                
        except Exception as e:
            error_msg = f"Chapa Exception: {str(e)}"
            with open('payment_errors.log', 'a') as f:
                f.write(f"{datetime.now()}: {error_msg}\n")
            print(error_msg)
            return Response({'error': error_msg}, status=500)


class VerifyPaymentView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, tx_ref):
        payment = get_object_or_404(Payment, tx_ref=tx_ref)
        
        # If already success, return immediately to avoid slow network calls
        if payment.status == 'success':
            return Response({
                'status': 'success', 
                'data': {
                    'amount': payment.amount, 
                    'currency': payment.currency,
                    'tx_ref': payment.tx_ref,
                    'status': 'success'
                }
            })

        url = f"https://api.chapa.co/v1/transaction/verify/{tx_ref}"
        chapa_key = getattr(settings, 'CHAPA_SECRET_KEY', None) or "CHASECK_TEST-valid-test-key"
        headers = {
            'Authorization': f'Bearer {chapa_key}'
        }

        try:
            # Mock verification for dev
            if chapa_key == "CHASECK_TEST-valid-test-key":
                 payment.status = 'success'
                 payment.save()
                 return Response({'status': 'success', 'data': {'amount': payment.amount, 'currency': 'ETB'}})

            # Added timeout to prevent long hangs
            response = requests.get(url, headers=headers, timeout=10)
            data = response.json()
            
            if data['status'] == 'success':
                payment.status = 'success'
                # Optionally save more details from Chapa if available
                payment.save()
                return Response({'status': 'success', 'data': data['data']})
            else:
                # Don't update to failed immediately if it's just 'pending' on Chapa's side
                if data.get('message') != 'Payment not found' and data.get('status') != 'pending':
                    payment.status = 'failed'
                    payment.save()
                return Response({'status': 'failed', 'message': data.get('message')}, status=400)
                
        except requests.exceptions.Timeout:
            return Response({'error': 'Verification timed out. Please refresh.'}, status=504)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class PaymentCallbackView(views.APIView):
    permission_classes = (AllowAny,) # Chapa hits this anonymously

    def post(self, request, tx_ref):
        # Chapa sends a POST to this URL
        payment = get_object_or_404(Payment, tx_ref=tx_ref)
        
        # In a real app, you should verify the Chapa signature here
        # for security, but for now we update based on the ref
        status = request.data.get('status')
        if status == 'success':
            payment.status = 'success'
            payment.save()
        
        return Response({'status': 'received'})

class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        # Optimization: select_related to prevent N+1 queries when serializer fetches username
        return Payment.objects.filter(user=self.request.user).select_related('user').order_by('-created_at')

class JournalEntryListCreateView(generics.ListCreateAPIView):
    serializer_class = JournalEntrySerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        client_id = self.request.query_params.get('client_id')
        personal = self.request.query_params.get('personal') == 'true'
        
        if user.role == 'professional':
            queryset = JournalEntry.objects.filter(professional=user)
            if personal:
                queryset = queryset.filter(client__isnull=True)
            elif client_id:
                queryset = queryset.filter(client_id=client_id)
            return queryset
        
        return JournalEntry.objects.none()

    def perform_create(self, serializer):
        serializer.save(professional=self.request.user)

class JournalEntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JournalEntrySerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return JournalEntry.objects.filter(professional=self.request.user)

class ProfessionalEarningsView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        if request.user.role != 'professional':
            return Response({'error': 'Only professionals can access dynamic earnings details.'}, status=403)
        
        profile = getattr(request.user, 'professional_profile', None)
        if not profile:
             return Response({'error': 'Profile not found'}, status=404)
             
        withdrawals = Withdrawal.objects.filter(user=request.user).order_by('-created_at')
        
        return Response({
            'available_balance': profile.balance,
            'total_earnings': profile.total_earnings,
            'withdrawals': WithdrawalSerializer(withdrawals, many=True).data
        })

class BankListView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        url = "https://api.chapa.co/v1/banks"
        chapa_key = getattr(settings, 'CHAPA_SECRET_KEY', None)
        if not chapa_key:
             return Response({'error': 'Chapa key missing'}, status=500)
             
        chapa_key = chapa_key.strip().strip('"').strip("'")
        headers = {'Authorization': f'Bearer {chapa_key}'}
        
        try:
            response = requests.get(url, headers=headers)
            return Response(response.json())
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class WithdrawalRequestView(views.APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.user.role != 'professional':
            return Response({'error': 'Only professionals can request withdrawals'}, status=403)
            
        amount = request.data.get('amount')
        bank_code = request.data.get('bank_code')
        account_number = request.data.get('account_number')
        beneficiary_name = request.data.get('account_name', f"{request.user.first_name} {request.user.last_name}")
        bank_name = request.data.get('bank_name', 'Unknown Bank')

        if not amount or not bank_code or not account_number:
            return Response({'error': 'Amount, bank_code, and account_number are required'}, status=400)

        profile = request.user.professional_profile
        from decimal import Decimal
        try:
            amount_dec = Decimal(str(amount))
        except:
             return Response({'error': 'Invalid amount format'}, status=400)

        if profile.balance < amount_dec:
            return Response({'error': f'Insufficient balance. Current balance: {profile.balance}'}, status=400)

        # Create withdrawal record
        reference = f"wd-{uuid.uuid4()}"
        withdrawal = Withdrawal.objects.create(
            user=request.user,
            amount=amount_dec,
            bank_name=bank_name,
            bank_code=bank_code,
            account_number=account_number,
            account_name=beneficiary_name,
            reference=reference,
            status='pending'
        )

        # Call Chapa Transfer API
        chapa_url = "https://api.chapa.co/v1/transfer"
        chapa_key = getattr(settings, 'CHAPA_SECRET_KEY', None)
        if not chapa_key:
             return Response({'error': 'Chapa key missing in settings'}, status=500)
             
        chapa_key = chapa_key.strip().strip('"').strip("'")
        headers = {
            'Authorization': f'Bearer {chapa_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            "account_name": beneficiary_name,
            "account_number": account_number,
            "amount": float(amount_dec),
            "currency": "ETB",
            "reference": reference,
            "bank_code": bank_code,
        }

        try:
            print(f"Debug: Payout initiation for {beneficiary_name} to bank {bank_code}")
            response = requests.post(chapa_url, json=payload, headers=headers)
            try:
                data = response.json()
            except:
                data = {"message": response.text}
                
            print(f"Debug: Chapa Payout Response: {data}")
            
            is_success = data.get('status') == 'success' or 'success' in data.get('message', '').lower()
            
            if is_success:
                # Deduct from balance
                profile.balance -= amount_dec
                profile.save()
                
                withdrawal.status = 'approved'
                withdrawal.save()
                return Response({'status': 'success', 'message': 'Withdrawal initiated successfully', 'data': data})
            else:
                withdrawal.status = 'failed'
                withdrawal.save()
                return Response({'error': f"Chapa Payout Error: {data.get('message', 'Unknown error')}"}, status=400)
                
        except Exception as e:
            return Response({'error': f"Exception during payout: {str(e)}"}, status=500)
