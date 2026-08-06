from django.core.exceptions import FieldError

from .exceptions import InternalApplicationError


def update_model_instance(*, instance, save=True, validate_fields_exist=True, **kwargs):
    # check if save key was passed in kwargs
    if "save" in kwargs:
        raise InternalApplicationError(
            "The 'save' key cannot be passed as kwargs It is used as a parameter."
        )
    if "validate_fields_exist" in kwargs:
        raise InternalApplicationError(
            "The 'validate_fields_exist' key cannot be passed as kwargs It is used as a parameter."
        )

    # Validate that fields exist on the model
    if validate_fields_exist:
        model_fields = {field.name for field in instance._meta.get_fields()}
        for key in kwargs:
            if key not in model_fields:
                raise FieldError(
                    f"Field '{key}' does not exist on {instance.__class__.__name__}"
                )

    update_fields = []
    for key, value in kwargs.items():
        setattr(instance, key, value)
        update_fields.append(key)

    if save:
        instance.save(update_fields=update_fields)
    return instance
