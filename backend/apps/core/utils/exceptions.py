class ApplicationError(Exception):
    """
    raise this to send 400 error. Look at utils/exception_handler.py
    """

    def __init__(self, message="There was an error", extra=None):
        super().__init__(message)

        self.message = message
        self.extra = extra or {}


class InternalApplicationError(Exception):
    """
    raise this to send 500 error. Look at utils/exception_handler.py.

    Details about the error should be shown on development but suppressed on production as to not leak detail to frontend.
    """

    def __init__(self, message="Internal Server Error", extra=None):
        super().__init__(message)

        self.message = message
        self.extra = extra or {}


class NotFoundError(Exception):
    """
    raise this to send 404 error. Look at utils/exception_handler.py.

    We could Http404 instead of this, but this allows us to send custom errors.
    """

    def __init__(self, message="Not Found", extra=None):
        super().__init__(message)

        self.message = message
        self.extra = extra or {}


class ConflictError(Exception):
    """
    raise this to send 409 error. Look at utils/exception_handler.py
    """

    def __init__(self, message="Conflict", extra=None):
        super().__init__(message)

        self.message = message
        self.extra = extra or {}
