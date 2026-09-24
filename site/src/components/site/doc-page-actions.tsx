import * as React from "react"
import { Menu } from "@base-ui/react/menu"
import {
  IconBrandOpenai,
  IconChevronDown,
  IconCopy,
  IconCopyCheck,
  IconExternalLink,
  IconFileText,
  IconSparkles,
} from "@tabler/icons-react"

import { getDocSource } from "@/lib/docs-content"
import { cn } from "@/lib/utils"

const SITE_URL = "https://inertia-localize.jiordiviera.me"

const menuItemClass =
  "hover:bg-muted focus:bg-muted data-[highlighted]:bg-muted flex cursor-pointer items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm outline-none"

export function DocPageActions({ slug }: { slug: string }) {
  const [copied, setCopied] = React.useState(false)
  const source = getDocSource(slug)

  if (!source) return null

  const pageUrl = `${SITE_URL}/docs/${slug}`
  const prompt = `Read ${pageUrl} so I can ask questions about it.`

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(source)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  const viewMarkdown = () => {
    const blob = new Blob([source], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank", "noopener,noreferrer")
    window.setTimeout(() => URL.revokeObjectURL(url), 30_000)
  }

  const openInChatGpt = () => {
    window.open(
      `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  const openInClaude = () => {
    window.open(
      `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-md border border-border bg-background text-xs">
      <button
        type="button"
        onClick={copyMarkdown}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 transition-colors hover:bg-muted hover:text-foreground"
      >
        {copied ? (
          <IconCopyCheck className="size-3.5 text-emerald-500" />
        ) : (
          <IconCopy className="size-3.5" />
        )}
        {copied ? "Copied" : "Copy page"}
      </button>

      <Menu.Root>
        <Menu.Trigger
          aria-label="More copy options"
          className="inline-flex items-center border-l border-border px-1.5 transition-colors hover:bg-muted hover:text-foreground"
        >
          <IconChevronDown className="size-3.5" />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner
            className="z-50 outline-none"
            sideOffset={6}
            align="end"
          >
            <Menu.Popup
              className={cn(
                "w-64 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
                "origin-[var(--transform-origin)] transition-[transform,opacity] data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0"
              )}
            >
              <Menu.Item onClick={copyMarkdown} className={menuItemClass}>
                <IconCopy className="size-4" />
                Copy page as Markdown
              </Menu.Item>
              <Menu.Item onClick={viewMarkdown} className={menuItemClass}>
                <IconFileText className="size-4" />
                View as Markdown
              </Menu.Item>
              <Menu.Item onClick={openInChatGpt} className={menuItemClass}>
                <IconBrandOpenai className="size-4" />
                Open in ChatGPT
                <IconExternalLink className="ml-auto size-3.5 text-muted-foreground" />
              </Menu.Item>
              <Menu.Item onClick={openInClaude} className={menuItemClass}>
                <IconSparkles className="size-4" />
                Open in Claude
                <IconExternalLink className="ml-auto size-3.5 text-muted-foreground" />
              </Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  )
}
