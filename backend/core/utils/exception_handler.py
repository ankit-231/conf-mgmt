# responses.py
import logging

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import exception_handler
from django.core.exceptions import (
    ValidationError as DjangoValidationError,
)
from rest_framework import exceptions
from rest_framework.serializers import as_serializer_error

from .exceptions import (
    ApplicationError,
    ConflictError,
    InternalApplicationError,
    NotFoundError,
)
from django.http import Http404
from django.core.exceptions import PermissionDenied
from django.conf import settings

from rest_framework_simplejwt.exceptions import InvalidToken

logger = logging.getLogger("exception_handler")


def custom_exception_handler(exc, ctx):
    """
    {
        "message": "Error message",
        "extra": {},
    }

    # note: Taken then modified from https://github.com/HackSoftware/Django-Styleguide?tab=readme-ov-file#errors--exception-handling

    """
    # print(type(exc))
    if isinstance(exc, DjangoValidationError):
        exc = exceptions.ValidationError(as_serializer_error(exc))

    response = exception_handler(exc, ctx)

    # Handle Http404 (usually raised from django.shortcuts.get_object_or_404)
    # Even though rest_framework.views.exception_handler handles Http404, it still does not return the response in the format we want
    if isinstance(exc, Http404):
        response.data["message"] = "Not found"
        response.data["extra"] = response.data["detail"]
        del response.data["detail"]
        return response
    # same with django's PermissionDenied. It hasn't been explicitly used till now, but doing this for the future
    elif isinstance(exc, PermissionDenied):
        response.data["message"] = "Permission denied"
        response.data["extra"] = response.data["detail"]
        del response.data["detail"]
        return response

    # If unexpected error occurs (server error, etc.)
    if response is None:
        # our custom error
        if isinstance(exc, ApplicationError):
            data = {
                "message": exc.message,
                "extra": exc.extra,
            }
            return Response(data, status=status.HTTP_400_BAD_REQUEST)

        if isinstance(exc, NotFoundError):
            data = {"message": exc.message, "extra": exc.extra}
            return Response(data, status=status.HTTP_404_NOT_FOUND)

        if isinstance(exc, ConflictError):
            data = {"message": exc.message, "extra": exc.extra}
            return Response(data, status=status.HTTP_409_CONFLICT)

        if isinstance(exc, InternalApplicationError):
            if settings.DEBUG:
                data = {
                    "message": exc.message,
                    "extra": exc.extra,
                }
            else:
                data = {
                    "message": "Internal Server Error",
                    "extra": {},
                }
            # log error regardless
            logger.error(f"InternalApplicationError: {exc.message}, extra: {exc.extra}")
            return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return response

    if isinstance(exc.detail, (list, dict)):
        response.data = {"detail": response.data}

    if isinstance(exc, exceptions.ValidationError):
        response.data["message"] = "Validation error"
        response.data["extra"] = {"fields": response.data["detail"]}

    elif isinstance(exc, exceptions.PermissionDenied):
        response.data["message"] = response.data["detail"]
        response.data["extra"] = {}
    elif isinstance(exc, InvalidToken):
        # rest_framework_simplejwt's InvalidToken error
        response.data["message"] = "Invalid token"
        response.data["extra"] = response.data["detail"]
    else:
        response.data["message"] = response.data["detail"]
        response.data["extra"] = {}

    del response.data["detail"]
    return response
