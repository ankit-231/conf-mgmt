"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"

import { Input } from "@/components/ui/input"
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  HybridTooltip,
  HybridTooltipContent,
  HybridTooltipTrigger,
} from "@/components/ui/hybrid-tooltip"

type FormInputProps = React.ComponentProps<typeof Input> & {
  label?: string
  description?: string
  tooltip?: React.ReactNode
  containerClassName?: string
}

function FormInput({
  label,
  description,
  tooltip,
  containerClassName,
  ...props
}: FormInputProps) {
  return (
    <FormItem className={containerClassName}>
      {label && (
        <FormLabel>
          {label}
          {tooltip && (
            <HybridTooltip>
              <HybridTooltipTrigger
                render={
                  <button
                    type="button"
                    aria-label={`More information about ${label}`}
                    className="text-muted-foreground"
                  >
                    <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} className="size-3.5" />
                  </button>
                }
              />
              <HybridTooltipContent>{tooltip}</HybridTooltipContent>
            </HybridTooltip>
          )}
        </FormLabel>
      )}
      <FormControl>
        <Input {...props} />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}

export { FormInput }
