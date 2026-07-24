from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import LeaveRequestViewSet

router = DefaultRouter()
router.register(r'leave-requests', LeaveRequestViewSet, basename='leave-request')

urlpatterns = [
    path('leave-history/', LeaveRequestViewSet.as_view({'get': 'list'}), name='leave-history'),
] + router.urls
