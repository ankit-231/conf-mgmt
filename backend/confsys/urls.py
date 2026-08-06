"""
URL configuration for confsys project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from apps.user.urls import users_urls
from apps.user.urls import auth_urls

api_prefix = settings.API_VERSION_1_URL_PREFIX

all_patterns = [
    path("auth/", include((auth_urls, "auth"))),
    path("users/", include((users_urls, "users"))),
]

urlpatterns = [
    # path('admin/', admin.site.urls),
    path(api_prefix + "/", include(all_patterns)),
]
