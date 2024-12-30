import * as React from "react"
import { clsx } from "clsx"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx(
        "inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2",
        {
          "border-transparent bg-gray-900 text-gray-50": variant === "default",
          "border-transparent bg-gray-100 text-gray-900": variant === "secondary",
        },
        className
      )}
      {...props}
    />
  )
})

export { Badge }