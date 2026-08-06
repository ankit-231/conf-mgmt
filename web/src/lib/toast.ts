import { toast } from "@/components/ui/toast"

// Thin wrappers around the toast manager for the two cases we hit constantly:
// success confirmations and error surfacing. Plain functions rather than
// hooks — the underlying toast manager is a module-level singleton
// (ToastPrimitive.createToastManager()), not React context state, so these
// work anywhere: components, lib/utils.ts helpers, axios interceptors, etc.

type ToastOptions = {
  title?: string
}

export function toastSuccess(description: string, options?: ToastOptions) {
  toast.add({
    type: "success",
    title: options?.title,
    description,
  })
}

export function toastError(description: string, options?: ToastOptions) {
  toast.add({
    type: "error",
    title: options?.title,
    description,
    priority: "high",
  })
}
