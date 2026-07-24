from rest_framework import serializers

from .models import LeaveRequest


class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.SerializerMethodField()

    class Meta:
        model = LeaveRequest
        fields = ('id', 'employee', 'employee_name', 'leave_type', 'start_date', 'end_date', 'reason', 'review_comment', 'status')
        read_only_fields = ('employee', 'status', 'employee_name', 'review_comment')

    def get_employee_name(self, obj):
        return obj.employee.get_full_name() or obj.employee.username
