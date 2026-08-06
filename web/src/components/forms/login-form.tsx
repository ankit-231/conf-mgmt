"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { isAxiosError } from "axios"

import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { FormInput } from "@/components/forms/form-input"
import { useLogin } from "@/hooks/use-auth"
import { setFormErrors } from "@/lib/utils"
import { toastError } from "@/lib/toast"

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
  const login = useLogin()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  function onSubmit(values: LoginFormValues) {
    login.mutate(values, {
      onSuccess: () => {
        router.push("/")
      },
      onError: (error) => {
        const fieldErrors = isAxiosError(error)
          ? error.response?.data?.extra?.fields
          : undefined

        if (fieldErrors) {
          setFormErrors<LoginFormValues>(form.setError, fieldErrors)
          return
        }

        const message = isAxiosError(error)
          ? error.response?.data?.message
          : undefined

        toastError(message || "Invalid username or password.")
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormInput label="Username" placeholder="you" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormInput label="Password" type="password" placeholder="••••••••" {...field} />
          )}
        />
        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? "Logging in..." : "Log in"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-foreground underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  )
}

export { LoginForm }
