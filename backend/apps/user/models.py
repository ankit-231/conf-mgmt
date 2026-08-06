from django.db import models
from django.contrib.auth.models import AbstractBaseUser, AbstractUser, PermissionsMixin
from safedelete.managers import SafeDeleteManager

from apps.core.utils.base_models import BaseModel
from django.contrib.auth.base_user import BaseUserManager

# Create your models here.


class UserManager(SafeDeleteManager, BaseUserManager):
    def create_user(self, username, password=None, create_profile=True, **extra_fields):
        if not username:
            raise ValueError("Username is required")

        role = extra_fields.get("role", User.Role.USER)
        if role not in User.Role.values:
            raise ValueError(f"Role must be one of {User.Role.values}")
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        if create_profile:
            Profile.objects.create(user=user)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("role", User.Role.SUPER)
        return self.create_user(username, password, create_profile=True, **extra_fields)


class User(BaseModel, AbstractBaseUser):

    class Role(models.TextChoices):
        SUPER = "SUPER", "Super"
        ADMIN = "ADMIN", "Admin"
        USER = "USER", "User"

    # since this is a soft-delete model, we need to make sure that on user deletion, we change the username to something unique, so that the deleted username can be reused by another user. We can achieve this by appending timestamp to the username on deletion.
    username = models.CharField(max_length=150, unique=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.USER)
    is_active = models.BooleanField(default=True)

    objects = UserManager()

    USERNAME_FIELD = "username"

    @property
    def is_superuser(self):
        return self.role == self.Role.SUPER

    @property
    def is_staff(self):
        return self.role in (self.Role.SUPER, self.Role.ADMIN)

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

    def save(self, *args, **kwargs):
        username = self.username.strip().lower()
        self.username = username
        return super().save(*args, **kwargs)

    class Meta:
        db_table = "user"
        verbose_name = "User"
        verbose_name_plural = "Users"


class Profile(BaseModel):
    user = models.OneToOneField(User, on_delete=models.PROTECT, related_name="profile")
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)

    class Meta:
        db_table = "profile"
        verbose_name = "Profile"
        verbose_name_plural = "Profiles"
