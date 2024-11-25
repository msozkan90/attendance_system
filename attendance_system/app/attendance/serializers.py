from rest_framework import serializers
from .models import AttendanceRecord, LeaveRequest

class AttendanceSerializer(serializers.ModelSerializer):
    late_minutes = serializers.ReadOnlyField()

    class Meta:
        model = AttendanceRecord
        fields = ['id', 'user', 'date', 'check_in_time', 'check_out_time', 'late_minutes']
        read_only_fields = ['user']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class LeaveRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveRequest
        fields = ['id', 'start_date', 'end_date', 'reason', 'status']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
