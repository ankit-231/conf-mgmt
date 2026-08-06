"use client"

import * as React from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormField } from "@/components/ui/form"
import { FormInput } from "@/components/forms/form-input"

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

function RegisterForm() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  function onSubmit(values: RegisterFormValues) {
    // TODO: wire up to auth backend
    console.log("register submit", values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormInput label="Name" placeholder="Jane Doe" {...field} />
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              tooltip="Must be at least 8 characters"
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormInput
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              {...field}
            />
          )}
        />
        <Button type="submit" className="w-full">
          Create account
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
            Log in
          </Link>
        </p>
      </form>
    </Form>
  )
}

export { RegisterForm }
