from .. import views
from django.urls import include, path

urlpatterns = [
    path("create/", views.UserCreateAPI.as_view(), name="create"),
    path("", views.UserListAPI.as_view(), name="list"),
    path("<uuid:uid>/", views.UserDetailAPI.as_view(), name="detail"),
    path("me/", views.UserMeDetailAPI.as_view(), name="me_detail"),
    path("<uuid:uid>/delete/", views.UserDeleteAPI.as_view(), name="delete"),
    path("<uuid:uid>/update/", views.UserUpdateAPI.as_view(), name="update"),
]
