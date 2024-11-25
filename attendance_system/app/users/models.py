from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models

class CustomUser(AbstractUser):
    is_admin = models.BooleanField(default=False)
    annual_leave_days = models.FloatField(default=15.0)
    used_leave_days = models.FloatField(default=0.0)

    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_set",
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_set",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    def remaining_leave(self):
        return self.annual_leave_days - self.used_leave_days
