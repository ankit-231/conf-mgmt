from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class CreateUserSerializer(serializers.Serializer):
    """
    Single source of truth for data validation of user creation
    """

    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.Role.choices)
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value


class UpdateUserSerializer(serializers.Serializer):
    """
    Single source of truth for data validation of user update
    """

    username = serializers.CharField(max_length=150, required=False)
    first_name = serializers.CharField(max_length=30, required=False)
    last_name = serializers.CharField(max_length=30, required=False)

    def validate_username(self, value):
        user_to_update = self.instance
        if User.objects.filter(username=value).exclude(pk=user_to_update.pk).exists():
            raise serializers.ValidationError("Username already exists.")
        return value


class GetUserDetailSerializer(serializers.ModelSerializer):
    class ProfileSerializer(serializers.Serializer):
        first_name = serializers.CharField(max_length=30)
        last_name = serializers.CharField(max_length=30)

    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ("uid", "username", "role", "is_active", "profile")


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # note: you can only access self.user after calling super().validate(attrs)

        # Add your extra responses here
        data["username"] = self.user.username
        data["role"] = self.user.role
        return data
