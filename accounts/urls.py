from django.urls import path

from .views import LoginView, RegisterView, UserListView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('users/', UserListView.as_view(), name='users'),
]
