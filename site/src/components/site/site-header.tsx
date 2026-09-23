import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CommandPalette } from './command-palette'
import { GithubIcon } from './icons'
import { MobileNav } from './mobile-nav'

const navLinks = [
  { label: 'Docs', to: '/docs/introduction' },
  { label: 'Guide', to: '/docs/quickstart' },
  { label: 'Packages', to: '/docs/installation' },
]

export function SiteHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-6 lg:px-10">
      <div className="flex items-center gap-2">
        <MobileNav />
        <NavLink to="/" className="flex items-center gap-3">
          <img src="/logo-128.png" alt="" className="size-8 rounded-lg" />
          <span className="text-[15px] font-bold">
            inertia <span className="text-primary">localize</span>
          </span>
        </NavLink>
      </div>

      <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
        {navLinks.map((link) => (
          <NavLink
            key={link.label}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'pb-1 transition-colors hover:text-white',
                isActive && 'border-b-2 border-primary text-secondary',
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <CommandPalette />
        <a
          href="https://github.com/jiordiviera/inertia-localize"
          target="_blank"
          rel="noreferrer"
          className="hidden size-9 items-center justify-center rounded-lg border border-white/15 text-white/70 transition-colors hover:border-white/30 hover:text-white md:flex"
          aria-label="View on GitHub"
        >
          <GithubIcon className="size-4" />
        </a>
        <Button asChild size="sm" className="hidden md:inline-flex">
          <a href="/docs/installation">Get started &#8594;</a>
        </Button>
      </div>
    </header>
  )
}
