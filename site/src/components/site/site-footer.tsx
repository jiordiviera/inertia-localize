import { useResolvedDark } from "@/lib/use-resolved-dark"
import { Bmc } from "@/components/ui/svgs/bmc"
import { GithubDark } from "@/components/ui/svgs/githubDark"
import { GithubLight } from "@/components/ui/svgs/githubLight"

const COFFEE_URL = "https://buymeacoffee.com/jiordiviera"
const REPO_URL = "https://github.com/jiordiviera/inertia-localize"

export function SiteFooter() {
  const isDark = useResolvedDark()
  return (
    <footer className="border-t border-border/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
          <img src="/logo.png" alt="" className="size-5 rounded-md" />
          <span className="min-w-0">
            Built by{" "}
            <a
              href="https://jiordiviera.me"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Jiordi Kengne
            </a>{" "}
            &middot; MIT License
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            {isDark ? (
              <GithubDark className="size-4" />
            ) : (
              <GithubLight className="size-4" />
            )}
            GitHub
          </a>
          <a
            href={COFFEE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-foreground transition-colors hover:bg-muted"
          >
            <span className="flex size-5 items-center justify-center rounded-full bg-white p-0.5">
              <Bmc className="size-full" />
            </span>
            Buy me a coffee
          </a>
        </div>
      </div>
    </footer>
  )
}
