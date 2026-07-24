from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import LeaveRequest
from .serializers import LeaveRequestSerializer


class IsHROrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in {'HR', 'ADMIN'}


class LeaveRequestViewSet(viewsets.ModelViewSet):
    queryset = LeaveRequest.objects.all().order_by('-created_at')
    serializer_class = LeaveRequestSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role in {'HR', 'ADMIN'}:
            return LeaveRequest.objects.all().order_by('-created_at')
        return LeaveRequest.objects.filter(employee=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(employee=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsHROrAdmin])
    def approve(self, request, pk=None):
        leave_request = self.get_object()
        leave_request.status = 'APPROVED'
        leave_request.review_comment = request.data.get('review_comment', 'Approved by HR')
        leave_request.save()
        serializer = self.get_serializer(leave_request)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsHROrAdmin])
    def reject(self, request, pk=None):
        leave_request = self.get_object()
        leave_request.status = 'REJECTED'
        leave_request.review_comment = request.data.get('review_comment', 'Rejected by HR')
        leave_request.save()
        serializer = self.get_serializer(leave_request)
        return Response(serializer.data, status=status.HTTP_200_OK)
