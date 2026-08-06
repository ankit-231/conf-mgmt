import uuid

from django.db import models
from safedelete.config import SOFT_DELETE_CASCADE, SOFT_DELETE
from safedelete.models import (
    SafeDeleteModel,
    FIELD_NAME,
)
from django.conf import settings
from django_currentuser.middleware import get_current_authenticated_user
from django.core.validators import MaxLengthValidator


class TimeAuditModel(models.Model):
    """
    Adds created_at and updated_at fields
    Inspired from https://github.com/makeplane/plane
    """

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class UserAuditModel(models.Model):
    """
    Adds created_by and updated_by fields
    Inspired from https://github.com/makeplane/plane
    """

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="%(class)s_created_by",
        null=True,
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="%(class)s_updated_by",
        null=True,
    )

    class Meta:
        abstract = True


class SeoModel(models.Model):
    """
    From https://github.com/saleor/saleor/blob/main/saleor/seo/models.py
    """

    seo_title = models.CharField(
        max_length=70, blank=True, null=True, validators=[MaxLengthValidator(70)]
    )
    seo_description = models.CharField(
        max_length=300, blank=True, null=True, validators=[MaxLengthValidator(300)]
    )

    class Meta:
        abstract = True


class AuditModel(TimeAuditModel, UserAuditModel):
    """
    Combines TimeAuditModel and UserAuditModel
    """

    class Meta:
        abstract = True


class BaseModel(SafeDeleteModel, AuditModel):
    """
    Inherits from SafeDeleteModel and AuditModel.
    Overrides save method to set created_by and updated_by using django_currentuser.middleware.get_current_authenticated_user
    """

    uid = models.UUIDField(
        default=uuid.uuid4, editable=False, db_index=True, unique=True
    )

    _safedelete_policy = SOFT_DELETE_CASCADE

    class Meta:
        abstract = True
        # NOTE: this won't work even if you inherit this class. You need to order in Child level
        ordering = ["-created_at"]

    @property
    def is_deleted(self):
        return getattr(self, FIELD_NAME, None) is not None

    def save(self, *args, **kwargs):
        user = get_current_authenticated_user()
        if user and not self.pk and not self.created_by:
            self.created_by = user
        if user:
            self.updated_by = user
        super().save(*args, **kwargs)
