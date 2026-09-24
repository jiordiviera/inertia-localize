import { IconMoon, IconSun } from "@tabler/icons-react"
import { Link } from "react-router-dom"

import { CommandPalette } from "@/components/site/command-palette"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useResolvedDark } from "@/lib/use-resolved-dark"
import { Bmc } from "@/components/ui/svgs/bmc"
import { GithubDark } from "@/components/ui/svgs/githubDark"
import { GithubLight } from "@/components/ui/svgs/githubLight"

const NAV_LINKS = [
  { label: "Docs", href: "/docs", active: true },
  { label: "API Reference", href: "/docs/api-reference" },
]

const REPO_URL = "https://github.com/jiordiviera/inertia-locale-kit"
const COFFEE_URL = "https://buymeacoffee.com/jiordiviera"

export function SiteHeader() {
  const { setTheme } = useTheme()
  const isDark = useResolvedDark()

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <Link to="/">
          <img src="/logo.png" alt="" className="size-10" />
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) =>
            link.href.startsWith("/") ? (
              <Link
                key={link.label}
                to={link.href}
                className={
                  link.active
                    ? "relative text-primary"
                    : "text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                {link.label}
                {link.active ? (
                  <span className="absolute -bottom-[19px] left-0 h-0.5 w-full rounded-full bg-primary" />
                ) : null}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <CommandPalette />

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? (
              <IconSun className="size-4" />
            ) : (
              <IconMoon className="size-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Support on Buy Me a Coffee"
            nativeButton={false}
            render={<a href={COFFEE_URL} target="_blank" rel="noreferrer" />}
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-white p-0.5">
              <Bmc className="size-full" />
            </span>
          </Button>

          <Button
            size="sm"
            className="hidden sm:inline-flex"
            nativeButton={false}
            render={<a href={REPO_URL} target="_blank" rel="noreferrer" />}
          >
            {isDark ? (
              <GithubLight className="size-4" />
            ) : (
              <GithubDark className="size-4" />
            )}
            Star on GitHub
          </Button>
        </div>
      </div>
    </header>
  )
}
