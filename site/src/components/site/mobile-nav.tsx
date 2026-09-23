import * as Dialog from '@radix-ui/react-dialog'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { GithubIcon } from './icons'

const navLinks = [
  { label: 'Docs', to: '/docs/introduction' },
  { label: 'Guide', to: '/docs/quickstart' },
  { label: 'Packages', to: '/docs/installation' },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="flex size-9 items-center justify-center rounded-lg border border-white/15 text-white/70 md:hidden"
        >
          <Menu className="size-4" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 md:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col gap-1 border-r-2 border-primary bg-[#111114] p-5 md:hidden"
        >
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="flex items-center gap-2 text-sm font-bold">
              <img src="/logo-128.png" alt="" className="size-6 rounded-md" />
              inertia <span className="text-primary">localize</span>
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="flex size-8 items-center justify-center rounded-lg border border-white/15 text-white/60"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2.5 text-sm ${isActive ? 'bg-primary/15 text-secondary' : 'text-white/75'}`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-4">
            <a
              href="https://github.com/jiordiviera/inertia-localize"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-white/60"
            >
              <GithubIcon className="size-4" />
              View on GitHub
            </a>
            <Button asChild>
              <a href="/docs/installation" onClick={() => setOpen(false)}>
                Get started &#8594;
              </a>
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
