from django.db import models
from django.contrib.auth import get_user_model
from datetime import datetime

User = get_user_model()

class AttendanceRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="attendance_records")
    date = models.DateField(auto_now_add=True)
    check_in_time = models.TimeField(null=True, blank=True)
    check_out_time = models.TimeField(null=True, blank=True)

    @property
    def late_minutes(self):
        if self.check_in_time:
            work_start = datetime.strptime("08:00", "%H:%M").time()
            delta = datetime.combine(datetime.min, self.check_in_time) - datetime.combine(datetime.min, work_start)
            return max(0, delta.total_seconds() // 60)
        return 0


class LeaveRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="leave_requests")
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')], default='Pending')
