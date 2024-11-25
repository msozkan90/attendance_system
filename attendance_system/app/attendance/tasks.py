from celery import shared_task
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta
from attendance.models import AttendanceRecord

User = get_user_model()

@shared_task
def notify_admin_for_late(employee_id, minutes):
    admin_emails = User.objects.filter(is_admin=True).values_list('email', flat=True)
    send_mail(
        subject="Geç Kalan Personel Bildirimi",
        message=f"Personel ID: {employee_id} {minutes} dakika geç kaldı.",
        from_email="admin@company.com",
        recipient_list=admin_emails,
    )

@shared_task
def notify_admin_low_leave(employee_id):
    admin_emails = User.objects.filter(is_admin=True).values_list('email', flat=True)
    send_mail(
        subject="Düşük Yıllık İzin Uyarısı",
        message=f"Personel ID: {employee_id}'in yıllık izni 3 günden az.",
        from_email="admin@company.com",
        recipient_list=admin_emails,
    )

@shared_task
def send_monthly_reports_if_end_of_month():
    """
    Sadece ayın son gününde çalışır ve tüm kullanıcılara aylık rapor gönderir.
    """
    today = datetime.now()
    tomorrow = today + timedelta(days=1)
    if tomorrow.month != today.month:
        send_monthly_reports()
    send_monthly_reports()


@shared_task
def send_monthly_reports():
    """
    Tüm kullanıcılara aylık rapor e-postası gönderir.
    """
    current_month = datetime.now().month
    users = User.objects.all()

    for user in users:
        records = AttendanceRecord.objects.filter(
            user=user,
            date__month=current_month
        ).exclude(date__week_day__in=[1, 7])

        total_hours = sum(
            [
                calculate_hours(record.check_in_time, record.check_out_time)
                for record in records if record.check_out_time and record.check_in_time
            ]
        )

        send_mail(
            subject="Aylık Çalışma Saatleri Raporu",
            message=f"Merhaba {user.username},\n\nBu ay toplam {total_hours} saat çalıştınız.\n\nİyi çalışmalar dileriz.",
            from_email="admin@company.com",
            recipient_list=[user.email],
            fail_silently=False,
        )


def calculate_hours(check_in_time, check_out_time):
    """
    Check-in ve check-out saatleri arasındaki saat farkını hesapla.
    """
    today = datetime.today()
    check_in_datetime = datetime.combine(today, check_in_time)
    check_out_datetime = datetime.combine(today, check_out_time)
    delta = check_out_datetime - check_in_datetime
    return delta.seconds // 3600
