"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { InformationCircleIcon } from "@hugeicons/core-free-icons"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

type FormSelectOption = {
  label: string
  value: string
  disabled?: boolean
}

type FormSelectProps = {
  label?: string
  description?: string
  tooltip?: React.ReactNode
  containerClassName?: string
  placeholder?: string
  options: FormSelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
}

function FormSelect({
  label,
  description,
  tooltip,
  containerClassName,
  placeholder,
  options,
  value,
  onValueChange,
  disabled,
}: FormSelectProps) {
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
      <Select
        value={value}
        onValueChange={(next) => onValueChange?.(next ?? "")}
        disabled={disabled}
      >
        <FormControl>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  )
}

export { FormSelect }
export type { FormSelectOption }
