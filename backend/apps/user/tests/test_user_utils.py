from django.test import TestCase

from apps.user.models import Profile
from apps.user.utils import UserService
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError as DRFValidationError
from unittest.mock import patch

User = get_user_model()


class CreateUserServiceTest(TestCase):

    def setUp(self):
        self.valid_data = {
            "username": "johndoe",
            "password": "securepassword123",
            "role": User.Role.USER,
            "first_name": "John",
            "last_name": "Doe",
        }

    # --- Happy path ---

    def test_creates_user_with_valid_data(self):
        user = UserService.create_user(self.valid_data)

        self.assertIsNotNone(user.pk)
        self.assertEqual(user.username, "johndoe")
        self.assertEqual(user.role, User.Role.USER)

    def test_creates_profile_alongside_user(self):
        user = UserService.create_user(self.valid_data)

        self.assertTrue(hasattr(user, "profile"))
        self.assertEqual(user.profile.first_name, "John")
        self.assertEqual(user.profile.last_name, "Doe")

    def test_password_is_hashed(self):
        user = UserService.create_user(self.valid_data)

        self.assertNotEqual(user.password, "securepassword123")
        self.assertTrue(user.check_password("securepassword123"))

    def test_creates_user_with_admin_role(self):
        user = UserService.create_user({**self.valid_data, "role": User.Role.ADMIN})

        self.assertEqual(user.role, User.Role.ADMIN)

    def test_username_is_lowercased(self):
        self.valid_data["username"] = "JohnDoe"
        user = UserService.create_user(self.valid_data)

        self.assertEqual(user.username, "johndoe")

    # --- Validation errors ---

    def test_raises_if_username_already_exists(self):
        UserService.create_user(self.valid_data)

        with self.assertRaises(DRFValidationError):
            UserService.create_user(self.valid_data)

    def test_raises_if_username_missing(self):
        data = {**self.valid_data, "username": ""}

        with self.assertRaises(DRFValidationError):
            UserService.create_user(data)

    def test_raises_if_invalid_role(self):
        data = {**self.valid_data, "role": "INVALID_ROLE"}

        with self.assertRaises(DRFValidationError):
            UserService.create_user(data)

    def test_raises_if_first_name_missing(self):
        data = {**self.valid_data, "first_name": ""}

        with self.assertRaises(DRFValidationError):
            UserService.create_user(data)

    # --- Atomicity ---

    def test_does_not_create_user_if_profile_creation_fails(self):
        """
        If profile creation fails mid transaction, user should not be created either.
        Tests the transaction.atomic() block.
        """
        with self.assertRaises(Exception):
            UserService.create_user({**self.valid_data, "last_name": "x" * 999})

        self.assertFalse(User.objects.filter(username="johndoe").exists())


class DeleteUserServiceTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="johndoe",
            password="securepassword123",
            role=User.Role.USER,
        )

    # --- Happy path ---

    def test_soft_deletes_user(self):
        UserService.delete_user(self.user)

        # soft delete — should not exist in normal queryset
        self.assertFalse(User.objects.filter(pk=self.user.pk).exists())

    def test_deletes_profile(self):
        UserService.delete_user(self.user)

        self.assertFalse(Profile.objects.filter(user=self.user).exists())

    def test_username_is_modified_on_deletion(self):
        original_username = self.user.username
        UserService.delete_user(self.user)

        # refresh won't work on soft deleted — check the modified username directly
        self.user.refresh_from_db()
        self.assertNotEqual(self.user.username, original_username)
        self.assertIn(original_username, self.user.username)  # johndoe_{timestamp}

    def test_original_username_can_be_reused_after_deletion(self):
        UserService.delete_user(self.user)

        # should not raise since username is now free
        new_user = User.objects.create_user(
            username="johndoe",
            password="newpassword123",
            role=User.Role.USER,
        )
        self.assertIsNotNone(new_user.pk)


class UpdateUserServiceTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="oldusername",
            password="oldpassword123",
        )
        self.profile = self.user.profile
        self.profile.first_name = "Old"
        self.profile.last_name = "Name"
        self.profile.save()

        self.valid_update_data = {
            "username": "newusername",
            "first_name": "New",
            "last_name": "NameUpdated",
        }

    # -------------------------
    # Happy path
    # -------------------------

    def test_updates_username_successfully(self):
        updated_user = UserService.update_user(self.user, **self.valid_update_data)

        self.user.refresh_from_db()
        self.assertEqual(self.user.username, "newusername")
        self.assertEqual(updated_user.username, "newusername")

    def test_updates_profile_fields_successfully(self):
        UserService.update_user(self.user, **self.valid_update_data)

        self.profile.refresh_from_db()
        self.assertEqual(self.profile.first_name, "New")
        self.assertEqual(self.profile.last_name, "NameUpdated")

    def test_returns_same_user_instance(self):
        result = UserService.update_user(self.user, **self.valid_update_data)

        self.assertEqual(result, self.user)

    def test_username_is_lowercased_on_update(self):
        self.valid_update_data["username"] = "JohnDoe"
        UserService.update_user(self.user, **self.valid_update_data)

        self.user.refresh_from_db()
        self.assertEqual(self.user.username, "johndoe")

    def test_update_only_one_field(self):
        data = {"first_name": "OnlyFirst"}

        UserService.update_user(self.user, **data)

        self.profile.refresh_from_db()
        self.assertEqual(self.profile.first_name, "OnlyFirst")
        self.assertEqual(self.profile.last_name, "Name")  # unchanged

    # -------------------------
    # Partial updates
    # -------------------------

    def test_can_update_only_username(self):
        data = {"username": "onlyusernamechange"}

        UserService.update_user(self.user, **data)

        self.user.refresh_from_db()
        self.assertEqual(self.user.username, "onlyusernamechange")

        self.profile.refresh_from_db()
        self.assertEqual(self.profile.first_name, "Old")  # unchanged

    def test_can_update_only_profile_fields(self):
        data = {
            "username": "sameusername",
            "first_name": "OnlyFirst",
        }

        UserService.update_user(self.user, **data)

        self.profile.refresh_from_db()
        self.assertEqual(self.profile.first_name, "OnlyFirst")
        self.assertEqual(self.profile.last_name, "Name")  # unchanged

    # -------------------------
    # Validation
    # -------------------------

    @patch("apps.user.serializers.UpdateUserSerializer.is_valid")
    def test_validation_error_propagates(self, mock_is_valid):
        mock_is_valid.side_effect = DRFValidationError("Invalid data")

        with self.assertRaises(DRFValidationError):
            UserService.update_user(self.user, **self.valid_update_data)

    # -------------------------
    # Atomicity
    # -------------------------

    @patch("apps.user.utils.update_model_instance")
    def test_atomic_rollback_on_profile_update_failure(self, mock_update):
        """
        If profile update fails, username update should be rolled back.
        """

        def side_effect(instance, **kwargs):
            if "first_name" in kwargs:
                raise Exception("Profile update failed")

        mock_update.side_effect = side_effect

        with self.assertRaises(Exception):
            UserService.update_user(self.user, **self.valid_update_data)

        # nothing should persist
        self.user.refresh_from_db()
        self.profile.refresh_from_db()

        self.assertEqual(self.user.username, "oldusername")
        self.assertEqual(self.profile.first_name, "Old")
