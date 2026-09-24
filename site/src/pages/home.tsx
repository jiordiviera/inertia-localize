import { EcosystemDiagram } from '@/components/site/ecosystem-diagram'
import {
  BoltIcon,
  DiamondIcon,
  LayersIcon,
} from '@/components/site/feature-icons'
import { GithubIcon } from '@/components/site/icons'
import { SiteFooter } from '@/components/site/site-footer'
import { Button } from '@/components/ui/button'

const features = [
  {
    icon: BoltIcon,
    title: 'Simple',
    body: 'Get started in minutes. No complex configuration.',
  },
  {
    icon: DiamondIcon,
    title: 'Lightweight',
    body: 'Only load the translations you need.',
  },
  {
    icon: LayersIcon,
    title: 'Framework agnostic',
    body: 'Consistent experience across React and Vue.',
  },
]

export function Home() {
  return (
    <div className="flex flex-col">
      <section className="page-container flex flex-col items-center gap-16 px-4 py-20 sm:px-6 lg:flex-row lg:items-center lg:px-10 lg:py-28">
        <div className="flex flex-1 flex-col gap-6">
          <span className="inline-flex w-fit items-center rounded-full border border-primary/50 px-3.5 py-1.5 text-xs text-secondary">
            Open Source &middot; Built for Laravel + Inertia
          </span>
          <h1 className="max-w-xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.375rem]">
            Localization that feels{' '}
            <span className="text-secondary">native</span> to Inertia.
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-white/60">
            Keep Laravel as your source of truth. Use your translations
            naturally in React and Vue.
          </p>
          <div className="mt-2 flex gap-3">
            <Button asChild>
              <a href="/docs/installation">Get started &#8594;</a>
            </Button>
            <Button asChild variant="outline">
              <a
                href="https://github.com/jiordiviera/inertia-localize"
                target="_blank"
                rel="noreferrer"
              >
                <GithubIcon className="size-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>

        <div className="w-full max-w-xl flex-1">
          <pre className="prose-docs overflow-x-auto rounded-xl border border-white/10 bg-surface p-6 text-sm leading-7 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.6)]">
            <code>
              <span className="text-white/35">{/* tsx */}</span>
              {'\n'}
              <span className="text-[#c792ea]">import</span>{' '}
              {'{ useTranslation }'}{' '}
              <span className="text-[#c792ea]">from</span>{' '}
              <span className="text-[#89ddff]">'@inertia-localize/react'</span>
              {'\n\n'}
              <span className="text-[#c792ea]">const</span>{' '}
              {'{ t, locale } = useTranslation()'}
              {'\n'}
              {"t('ui.greeting', "}
              {'{ name: '}
              <span className="text-[#89ddff]">'Ada'</span>
              {' })'}
            </code>
          </pre>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="page-container flex flex-col items-center gap-8 px-4 py-20 sm:px-6 lg:px-10">
          <span className="rounded-md border border-secondary/40 px-2.5 py-1 text-[11px] uppercase tracking-wide text-secondary">
            How it works &mdash; the ecosystem
          </span>
          <EcosystemDiagram />
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="page-container grid grid-cols-1 gap-5 px-4 py-16 sm:grid-cols-3 sm:px-6 lg:px-10">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 rounded-xl border border-white/10 p-6"
            >
              <feature.icon className="size-8 text-primary" />
              <div className="text-base font-semibold">{feature.title}</div>
              <div className="text-sm leading-relaxed text-white/50">
                {feature.body}
              </div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
