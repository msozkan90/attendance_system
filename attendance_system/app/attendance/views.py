from rest_framework.viewsets import ModelViewSet
from .models import AttendanceRecord, LeaveRequest
from .serializers import AttendanceSerializer, LeaveRequestSerializer
from rest_framework.permissions import IsAuthenticated
from attendance.tasks import notify_admin_for_late
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from attendance.tasks import notify_admin_low_leave

class AttendanceViewSet(ModelViewSet):
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_admin:
            return AttendanceRecord.objects.all()
        return AttendanceRecord.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        today = request.data.get('date')
        existing_record = AttendanceRecord.objects.filter(user=request.user, date=today).first()

        if existing_record:
            return Response(
                {"error": "You already have a check-in record for today."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        if instance.late_minutes > 0:
            notify_admin_for_late.delay(employee_id=instance.user.id, minutes=instance.late_minutes)

            instance.user.used_leave_days += instance.late_minutes / 600
            instance.user.save()

            if instance.user.remaining_leave() < 3:
                notify_admin_low_leave.delay(employee_id=instance.user.id)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.check_out_time:
            return Response(
                {"error": "You have already checked out for today."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class LeaveRequestViewSet(ModelViewSet):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_admin:
            return LeaveRequest.objects.all()
        return LeaveRequest.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        previous_status = instance.status

        response = super().update(request, *args, **kwargs)

        if request._data["status"] == "Approved":
            days_requested = (instance.end_date - instance.start_date).days + 1
            instance.user.used_leave_days += days_requested
            instance.user.save()

            if instance.user.remaining_leave() < 3:
                notify_admin_low_leave.delay(employee_id=instance.user.id)


        return response

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def mine(self, request):
        """Oturum açmış kullanıcının izin taleplerini getirir"""
        user_leave_requests = LeaveRequest.objects.filter(user=request.user)
        serializer = self.get_serializer(user_leave_requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)