import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FieldValues, Path, UseFormSetError } from "react-hook-form"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function arrayOfStringToString(arr: string[]) {
  return arr.join(", ")
}

// Maps DRF serializer field errors (ApiErrorResponse["extra"]["fields"]) onto
// react-hook-form fields. non_field_errors has no matching field, so it goes
// to "root" instead (rendered wherever the form shows its root error).
export function setFormErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  fields: Record<string, string[]>,
) {
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    return
  }

  Object.keys(fields).forEach((fieldName) => {
    const fieldErrors = fields[fieldName]

    if (!Array.isArray(fieldErrors) || fieldErrors.length === 0) {
      return
    }

    const targetField = fieldName === "non_field_errors" ? "root" : fieldName

    setError(targetField as Path<T>, {
      type: "manual",
      message: arrayOfStringToString(fieldErrors),
    })
  })
}
