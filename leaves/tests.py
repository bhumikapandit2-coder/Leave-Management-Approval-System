from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class LeaveWorkflowTests(APITestCase):
    def setUp(self):
        self.employee = User.objects.create_user(username='employee', password='pass123', role='EMPLOYEE')
        self.hr = User.objects.create_user(username='hruser', password='pass123', role='HR')

    def test_employee_can_create_request_and_hr_can_approve(self):
        self.client.force_authenticate(self.employee)
        create_response = self.client.post(
            reverse('leave-request-list'),
            {
                'leave_type': 'Sick Leave',
                'start_date': '2026-08-01',
                'end_date': '2026-08-03',
                'reason': 'Need rest',
            },
            format='json',
        )

        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        leave_id = create_response.json()['id']

        self.client.force_authenticate(self.hr)
        approve_response = self.client.post(
            reverse('leave-request-approve', kwargs={'pk': leave_id}),
            {'review_comment': 'Approved by HR'},
            format='json',
        )

        self.assertEqual(approve_response.status_code, status.HTTP_200_OK)
        self.assertEqual(approve_response.json()['status'], 'APPROVED')
