from django.urls import include, path
from .. import views

urlpatterns = [
    # path("signup/", views.UserSignUpAPI.as_view(), name="public_signup"),
    path("login/", views.LoginUserAPI.as_view(), name="login"),
    path("logout/", views.LogoutUserAPI.as_view(), name="logout"),
    path(
        "token/generate/",
        views.CustomTokenObtainPairView.as_view(),
        name="token_generate",
    ),
    path(
        "token/refresh/", views.CustomTokenRefreshView.as_view(), name="token_refresh"
    ),
    path("token/verify/", views.CustomTokenVerifyView.as_view(), name="token_verify"),
    path(
        "token/blacklist/",
        views.CustomTokenBlacklistView.as_view(),
        name="token_blacklist",
    ),
]
