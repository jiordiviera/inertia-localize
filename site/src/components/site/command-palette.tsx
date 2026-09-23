import * as Dialog from '@radix-ui/react-dialog'
import { Command } from 'cmdk'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { docsNav } from '@/lib/docs-nav'
import { useDocsSearch } from '@/lib/use-docs-search'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { results, indexed } = useDocsSearch(query)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((value) => !value)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  function go(url: string) {
    setOpen(false)
    setQuery('')
    navigate(url)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="flex size-9 items-center justify-center rounded-lg border border-white/15 text-white/50 transition-colors hover:border-white/30 hover:text-white/80 md:h-auto md:w-auto md:gap-2 md:px-3 md:py-1.5 md:text-sm"
      >
        <Search className="size-3.5" />
        <span className="hidden md:inline">Search</span>
        <kbd className="hidden rounded border border-white/15 px-1.5 py-0.5 font-mono text-[11px] text-white/40 md:inline">
          &#8984;K
        </kbd>
      </button>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed left-1/2 top-[110px] z-50 w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-primary/40 bg-[#111114] shadow-2xl"
          >
            <Dialog.Title className="sr-only">
              Search documentation
            </Dialog.Title>
            <Command shouldFilter={!indexed} className="flex flex-col">
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                <Search className="size-4 text-primary" />
                <Command.Input
                  value={query}
                  onValueChange={setQuery}
                  autoFocus
                  placeholder="Search docs, guides, API..."
                  className="flex-1 bg-transparent text-sm text-white/90 outline-none placeholder:text-white/35"
                />
                <kbd className="rounded border border-white/15 px-1.5 py-0.5 font-mono text-[11px] text-white/40">
                  esc
                </kbd>
              </div>
              <Command.List className="max-h-[380px] overflow-y-auto p-2 text-sm">
                <Command.Empty className="px-3 py-6 text-center text-white/40">
                  No results found.
                </Command.Empty>

                {indexed && results
                  ? results.map((result) => (
                      <Command.Item
                        key={result.id}
                        value={result.id}
                        onSelect={() => go(result.url)}
                        className="cursor-pointer rounded-lg px-3 py-2 text-white/80 data-[selected=true]:bg-primary/15 data-[selected=true]:text-secondary"
                      >
                        {result.title}
                      </Command.Item>
                    ))
                  : docsNav.map((group) => (
                      <Command.Group
                        key={group.title}
                        heading={group.title}
                        className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-white/35"
                      >
                        {group.items.map((item) => (
                          <Command.Item
                            key={item.slug}
                            value={item.title}
                            onSelect={() => go(`/docs/${item.slug}`)}
                            className="cursor-pointer rounded-lg px-3 py-2 text-white/80 data-[selected=true]:bg-primary/15 data-[selected=true]:text-secondary"
                          >
                            {item.title}
                          </Command.Item>
                        ))}
                      </Command.Group>
                    ))}
              </Command.List>
              <div className="flex gap-4 border-t border-white/10 px-4 py-2 text-[11px] text-white/40">
                <span>&#8593;&#8595; Navigate</span>
                <span>&#9166; Select</span>
                <span>esc Close</span>
              </div>
            </Command>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
