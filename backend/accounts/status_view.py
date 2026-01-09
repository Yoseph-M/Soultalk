
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import ProfessionalProfile

class UpdateOnlineStatusView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if request.user.role != 'professional':
            return Response({'error': 'Only professionals can set online status'}, status=status.HTTP_403_FORBIDDEN)
        
        is_online = request.data.get('is_online')
        if is_online is None:
            return Response({'error': 'is_online field is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        profile = get_object_or_404(ProfessionalProfile, user=request.user)
        profile.is_online = bool(is_online)
        profile.save()
        
        return Response({'status': 'success', 'is_online': profile.is_online})
