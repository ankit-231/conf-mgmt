from django.contrib.auth import get_user_model
import factory

from apps.user.utils import UserService

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"user{n}")
    password = "password123"

    role = User.Role.USER

    first_name = "John"
    last_name = "Doe"

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        return UserService.create_user(kwargs)


class AdminUserFactory(UserFactory):
    role = User.Role.ADMIN


class SuperUserFactory(UserFactory):
    role = User.Role.SUPER
