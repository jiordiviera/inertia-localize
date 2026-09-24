import * as React from "react"
import { IconCheck, IconCopy } from "@tabler/icons-react"

import { cn } from "@/lib/utils"

export function CodeBlock({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"pre">) {
  const preRef = React.useRef<HTMLPreElement>(null)
  const [copied, setCopied] = React.useState(false)

  const handleCopy = React.useCallback(async () => {
    const text = preRef.current?.textContent ?? ""
    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }, [])

  return (
    <div className="group relative">
      <pre ref={preRef} className={className} {...props}>
        {children}
      </pre>
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy code"
        className={cn(
          "absolute top-2.5 right-2.5 inline-flex size-7 items-center justify-center rounded-md",
          "border border-white/10 bg-white/5 text-zinc-400 opacity-0 transition-all",
          "group-hover:opacity-100 hover:bg-white/10 hover:text-white focus-visible:opacity-100"
        )}
      >
        {copied ? (
          <IconCheck className="size-3.5 text-emerald-400" />
        ) : (
          <IconCopy className="size-3.5" />
        )}
      </button>
    </div>
  )
}
