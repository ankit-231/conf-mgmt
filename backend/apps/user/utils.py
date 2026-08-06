from typing import Dict

from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db import transaction

from apps.core.utils.common import update_model_instance
from apps.user.models import Profile
from apps.user.serializers import CreateUserSerializer, UpdateUserSerializer

User = get_user_model()
UserType = User


class UserService:

    @staticmethod
    def create_user(data: Dict) -> UserType:
        validated_data = UserService._validate_user_create_data(data)

        username = validated_data.pop("username")
        password = validated_data.pop("password")
        role = validated_data.pop("role")

        # other data are already popped from validated_data, so we can use it as profile data
        profile_data = validated_data

        return UserService._create_user(
            username=username, password=password, role=role, **profile_data
        )

    @staticmethod
    def _create_user(
        username: str, password: str, role: str, **profile_data
    ) -> UserType:
        """
        Data is assumed to be already validated at this point.

        **Creates profile for user as well**
        """
        with transaction.atomic():
            user = User.objects.create_user(
                username=username, password=password, role=role, create_profile=False
            )
            profile = Profile.objects.create(user=user, **profile_data)

            # attach profile to user instance, so that extra hits aren't necessary
            user.profile = profile

        return user

    @staticmethod
    def _validate_user_create_data(data: Dict):
        serializer = CreateUserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data

    @staticmethod
    def delete_user(user: UserType):
        """
        since User is a soft-delete model, we need to make sure that on user deletion, we change the username to something unique, so that the deleted username can be reused by another user. We can achieve this by appending timestamp to the username on deletion.
        """
        now = str(timezone.now().timestamp())
        with transaction.atomic():
            # delete profile if exists
            if hasattr(user, "profile"):
                user.profile.delete()
            user.username = f"{user.username}_{now}"
            user.save()
            user.delete()

    @staticmethod
    def update_user(user: UserType, **data):
        """
        This method will be used to update user details. It will handle both user and profile updates.
        """

        validated_data = UserService._validate_user_update_data(user, data)
        with transaction.atomic():
            # update user fields
            # since this is a partial update, username may or may not be present
            user_data = {}
            username = validated_data.pop("username", None)
            if username:
                user_data["username"] = username
            if user_data:
                update_model_instance(instance=user, **user_data)

            # update profile fields
            profile_data = validated_data
            if profile_data:
                profile = user.profile
                update_model_instance(instance=profile, **profile_data)

        return user

    @staticmethod
    def _validate_user_update_data(user: UserType, data: Dict):
        serializer = UpdateUserSerializer(instance=user, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data
