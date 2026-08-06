from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient

from apps.user.factories import SuperUserFactory, UserFactory
from apps.user.models import Profile

User = get_user_model()


class UserAPITest(APITestCase):

    def setUp(self):
        self.client = APIClient()

        # superuser
        self.super = SuperUserFactory()

        # normal user
        self.user = UserFactory()

        # self.list_url = reverse("users:create")
        # self.me_url = reverse("users:me_detail")
        # self.create_url = reverse("users:create")
        # self.detail_url = reverse("users:detail", kwargs={"uid": self.user.uid})
        # self.delete_url = reverse("users:delete", kwargs={"uid": self.user.uid})
        # self.update_url = reverse("users:update", kwargs={"uid": self.user.uid})

    def test_user_me_returns_self(self):
        self.client.force_authenticate(user=self.user)
        url = reverse("users:me_detail")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["data"]["username"], self.user.username)

    def test_superuser_can_get_user_list(self):
        self.client.force_authenticate(user=self.super)
        url = reverse("users:list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["data"]), 2)

    def test_superuser_can_get_user_detail(self):
        self.client.force_authenticate(user=self.super)
        url = reverse("users:detail", kwargs={"uid": self.user.uid})
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)

    def test_superuser_can_create_user(self):
        self.client.force_authenticate(user=self.super)
        url = reverse("users:create")
        data = {
            "username": "newuser",
            "role": User.Role.USER,
            "password": "newpassword",
            "first_name": "New",
            "last_name": "User",
        }
        response = self.client.post(
            url,
            data,
            format="json",
        )

        self.assertEqual(response.status_code, 201)

    def test_superuser_can_delete_user(self):
        self.client.force_authenticate(user=self.super)
        uid = self.user.uid
        url = reverse("users:delete", kwargs={"uid": uid})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, 204)
        self.assertFalse(User.objects.filter(uid=uid).exists())
        self.assertFalse(Profile.objects.filter(user__uid=uid).exists())

    def test_superuser_can_update_user(self):
        self.client.force_authenticate(user=self.super)
        uid = self.user.uid
        url = reverse("users:update", kwargs={"uid": uid})
        data = {
            "username": "updatedusername",
            "first_name": "UpdatedFirstName",
            "last_name": "UpdatedLastName",
        }
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, "updatedusername")
        self.assertEqual(self.user.profile.first_name, "UpdatedFirstName")
        self.assertEqual(self.user.profile.last_name, "UpdatedLastName")

    def test_superuser_can_partial_update_user(self):
        self.client.force_authenticate(user=self.super)
        uid = self.user.uid
        last_name_before_update = self.user.profile.last_name
        url = reverse("users:update", kwargs={"uid": uid})
        data = {
            "first_name": "PartiallyUpdatedFirstName",
        }
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertEqual(self.user.profile.first_name, "PartiallyUpdatedFirstName")
        # check unchanged
        self.assertEqual(self.user.profile.last_name, last_name_before_update)
