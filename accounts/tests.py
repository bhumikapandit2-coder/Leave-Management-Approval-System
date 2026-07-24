from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AuthFlowTests(APITestCase):
    def test_register_then_login(self):
        register_response = self.client.post(
            reverse('register'),
            {
                'username': 'alice',
                'email': 'alice@example.com',
                'password': 'SecurePass123!',
                'first_name': 'Alice',
                'last_name': 'Example',
                'role': 'EMPLOYEE',
            },
            format='json',
        )

        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)

        user = User.objects.get(username='alice')
        self.assertTrue(user.check_password('SecurePass123!'))

        login_response = self.client.post(
            reverse('login'),
            {'username': 'alice', 'password': 'SecurePass123!'},
            format='json',
        )

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', login_response.json())
        self.assertIn('refresh', login_response.json())

    def test_default_admin_user_can_login(self):
        login_response = self.client.post(
            reverse('login'),
            {'username': 'admin', 'password': 'Admin@123!'},
            format='json',
        )

        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', login_response.json())
