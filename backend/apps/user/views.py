from django.shortcuts import get_object_or_404, render
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
    TokenBlacklistView,
)

from apps.core.utils.base_views import AuthAPIView, PublicAPIView
from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model, login, logout

from apps.core.utils.permissions import IsSuper
from apps.core.utils.response_wrappers import (
    CreatedResponse,
    NoContentResponse,
    OKResponse,
    UnauthorizedResponse,
)
from apps.user.models import Profile
from apps.user.serializers import (
    CustomTokenObtainPairSerializer,
    CustomTokenObtainPairSerializer,
    GetUserDetailSerializer,
)
from apps.user.utils import UserService

User = get_user_model()


class UserDetailAPI(AuthAPIView):
    extra_permissions = [IsSuper]

    output_serializer = GetUserDetailSerializer

    def get(self, request, uid):
        qs = User.objects.select_related("profile")
        user = get_object_or_404(qs, uid=uid)
        serializer = self.output_serializer(user)
        output_data = serializer.data
        return OKResponse(data=output_data)


class UserMeDetailAPI(AuthAPIView):

    output_serializer = GetUserDetailSerializer

    def get(self, request):
        user = request.user
        serializer = self.output_serializer(user)
        output_data = serializer.data
        return OKResponse(data=output_data)


class UserListAPI(AuthAPIView):
    extra_permissions = [IsSuper]

    output_serializer = GetUserDetailSerializer

    def get(self, request):
        qs = User.objects.select_related("profile").all()
        serializer = self.output_serializer(qs, many=True)
        output_data = serializer.data
        return OKResponse(data=output_data)


class UserCreateAPI(AuthAPIView):
    output_serializer = GetUserDetailSerializer

    def post(self, request):
        user = UserService.create_user(request.data)
        output_data = self.output_serializer(user).data
        return CreatedResponse(data=output_data)


class UserDeleteAPI(AuthAPIView):
    extra_permissions = [IsSuper]

    def delete(self, request, uid):
        user = get_object_or_404(User, uid=uid)
        UserService.delete_user(user)
        return NoContentResponse(message="User deleted successfully")


class UserUpdateAPI(AuthAPIView):
    extra_permissions = [IsSuper]

    output_serializer = GetUserDetailSerializer

    def patch(self, request, uid):
        user = get_object_or_404(User.objects.select_related("profile"), uid=uid)
        data = request.data
        user = UserService.update_user(user, **data)
        output_data = self.output_serializer(user).data
        return OKResponse(data=output_data)


class LoginUserAPI(PublicAPIView):
    class InputSerializer(serializers.Serializer):
        username = serializers.CharField()
        password = serializers.CharField(write_only=True)
        remember_me = serializers.BooleanField(default=False)

    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = User
            fields = [
                "username",
                "role",
            ]

    input_serializer = InputSerializer
    output_serializer = OutputSerializer

    def post(self, request):
        input_serializer = self.input_serializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)

        username = input_serializer.validated_data["username"]
        password = input_serializer.validated_data["password"]
        remember_me = input_serializer.validated_data["remember_me"]

        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            if remember_me:
                # Persist session for 2 days (cookie survives browser restarts)
                request.session.set_expiry(2 * 24 * 60 * 60)  # 2 days in seconds
                # request.session.set_expiry(20)  # 60 seconds
                # Django stores below key-value pair in the session store (e.g. DB or cache), under the current user's session. depends on your SESSION_ENGINE in settings, defaults to 'django.contrib.sessions.backends.db'
                request.session["remember_me"] = True

            else:
                # Expire on browser close (session cookie, no expiry set)
                request.session.set_expiry(0)
                request.session["remember_me"] = False

            output = self.output_serializer(instance=user).data

            resp = OKResponse(data=output, message="Logged In Successfully!")

            # set cookie had_logged_in to True for showing better UX message about logged out state for user.
            resp.set_cookie("had_logged_in", True, max_age=2 * 24 * 60 * 60)

            return resp

        # returning UnauthorizedResponse is correct according to 2 scoops of Django. Authentication required but user did not provide credentials or provided invalid ones.
        resp = UnauthorizedResponse(message="Invalid Credentials")

        # if invalid credentials, they now know that they have been logged out so simply set cookie had_logged_in to False
        resp.set_cookie("had_logged_in", False, max_age=2 * 24 * 60 * 60)
        return resp


class LogoutUserAPI(AuthAPIView):
    def post(self, request):
        logout(request)
        resp = OKResponse(message="Logged Out Successfully!")
        resp.delete_cookie("had_logged_in")
        return resp


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Note: Custom serializer and to get a consistent response
    """

    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        old_response = super().post(request, *args, **kwargs)
        # looking at the post method of super, we can see that only possible response is a 200 response, bad response is handled by raising exception
        ok_response = OKResponse(data=old_response.data)
        return ok_response


class CustomTokenRefreshView(TokenRefreshView):
    """
    Note: Just to get a consistent response
    """

    def post(self, request, *args, **kwargs):
        old_response = super().post(request, *args, **kwargs)
        ok_response = OKResponse(data=old_response.data)
        return ok_response


class CustomTokenVerifyView(TokenVerifyView):
    """
    Note: Just to get a consistent response
    """

    def post(self, request, *args, **kwargs):
        old_response = super().post(request, *args, **kwargs)
        ok_response = OKResponse(data=old_response.data)
        return ok_response


class CustomTokenBlacklistView(TokenBlacklistView):
    """
    Note: Just to get a consistent response
    """

    def post(self, request, *args, **kwargs):
        old_response = super().post(request, *args, **kwargs)
        ok_response = OKResponse(data=old_response.data)
        return ok_response
