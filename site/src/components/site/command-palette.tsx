import * as React from "react"
import { IconFileText, IconSearch } from "@tabler/icons-react"
import { useNavigate } from "react-router-dom"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { getDocSource } from "@/lib/docs-content"
import { docsNav } from "@/lib/docs-nav"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const select = (slug: string) => {
    setOpen(false)
    navigate(`/docs/${slug}`)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-8 items-center gap-2 rounded-md border border-border bg-transparent px-2.5 text-xs text-muted-foreground hover:text-foreground sm:flex"
      >
        <IconSearch className="size-3.5" />
        <span>Search docs...</span>
        <kbd className="ml-2 rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
          ⌘K
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        label="Search docs"
        shouldFilter
      >
        <CommandInput placeholder="Search docs..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {docsNav.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.slug}
                  value={`${item.title} ${getDocSource(item.slug) ?? ""}`}
                  onSelect={() => select(item.slug)}
                >
                  <IconFileText className="size-4 shrink-0" />
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
