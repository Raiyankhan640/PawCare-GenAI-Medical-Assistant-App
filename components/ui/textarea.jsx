import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-emerald-500 focus-visible:ring-emerald-500/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-all duration-300 outline-none focus-visible:ring-[3px] focus-visible:shadow-lg focus-visible:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm hover:border-emerald-600/50 hover:shadow-md backdrop-blur-sm",
        className
      )}
      {...props} />
  );
}

export { Textarea }
