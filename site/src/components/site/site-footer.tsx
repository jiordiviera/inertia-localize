export function SiteFooter() {
  return (
    <footer className="border-t border-white/10">
      <div className="page-container px-4 py-12 text-sm sm:px-6 lg:px-10">
        <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-white/80">Docs</div>
            <a
              href="/docs/introduction"
              className="text-white/50 hover:text-white/80"
            >
              Getting started
            </a>
            <a
              href="/docs/configuration"
              className="text-white/50 hover:text-white/80"
            >
              Laravel
            </a>
            <a
              href="/docs/react-adapter"
              className="text-white/50 hover:text-white/80"
            >
              React / Vue
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-white/80">Project</div>
            <a
              href="https://github.com/jiordiviera/inertia-localize"
              className="text-white/50 hover:text-white/80"
            >
              GitHub
            </a>
            <a
              href="https://github.com/jiordiviera/inertia-localize/releases"
              className="text-white/50 hover:text-white/80"
            >
              Changelog
            </a>
            <span className="text-white/50">License (MIT)</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold text-white/80">Community</div>
            <a
              href="https://github.com/jiordiviera/inertia-localize/blob/v0/CONTRIBUTING.md"
              className="text-white/50 hover:text-white/80"
            >
              Contributing
            </a>
            <a
              href="https://github.com/jiordiviera/inertia-localize/discussions"
              className="text-white/50 hover:text-white/80"
            >
              Discussions
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-white/35 sm:flex-row sm:justify-between">
          <span>&#169; Inertia Localize &#8212; MIT License</span>
          <span>
            Built by{' '}
            <a
              href="https://jiordiviera.me"
              target="_blank"
              rel="noreferrer"
              className="text-white/50 hover:text-white/80"
            >
              Jiordi Kengne
            </a>{' '}
            with Vite + React
          </span>
        </div>
      </div>
    </footer>
  )
}
