from rest_framework import permissions
from django.contrib.auth import get_user_model

User = get_user_model()


class IsSuper(permissions.BasePermission):
    """
    Allows access only to super user.
    """

    message = "You are not authenticated to perform this action"

    def has_permission(self, request, view):
        return request.user.role == User.Role.SUPER

    def has_object_permission(self, request, view, obj):
        return request.user.role == User.Role.SUPER


class IsAdmin(permissions.BasePermission):
    """
    Allows access only to admin user.
    """

    message = "You are not authenticated to perform this action"

    def has_permission(self, request, view):
        return request.user.role == User.Role.ADMIN

    def has_object_permission(self, request, view, obj):
        return request.user.role == User.Role.ADMIN


class IsUser(permissions.BasePermission):
    """
    Allows access only to user.
    """

    message = "You are not authenticated to perform this action"

    def has_permission(self, request, view):
        return request.user.role == User.Role.USER

    def has_object_permission(self, request, view, obj):
        return request.user.role == User.Role.USER
