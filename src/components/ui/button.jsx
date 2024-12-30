import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { clsx } from "clsx"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={clsx(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        {
          "bg-gray-900 text-gray-50 hover:bg-gray-900/90": variant === "default",
          "bg-transparent border border-gray-200 hover:bg-gray-100": variant === "outline",
        },
        {
          "h-10 py-2 px-4": size === "default",
          "h-9 px-3": size === "sm",
          "h-11 px-8": size === "lg",
        },
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

export { Button }
