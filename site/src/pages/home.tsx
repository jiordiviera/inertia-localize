import { IconBolt, IconDiamond, IconStack2 } from "@tabler/icons-react"
import { Link } from "react-router-dom"

import { CodeBlock } from "@/components/site/code-block"
import { SiteFooter } from "@/components/site/site-footer"
import { Button } from "@/components/ui/button"
import { Laravel } from "@/components/ui/svgs/laravel"
import { Svelte } from "@/components/ui/svgs/svelte"
import { Vue } from "@/components/ui/svgs/vue"
import { useResolvedDark } from "@/lib/use-resolved-dark"
import { GithubDark } from "@/components/ui/svgs/githubDark"
import { GithubLight } from "@/components/ui/svgs/githubLight"
import { ReactDark } from "@/components/ui/svgs/reactDark"
import { ReactLight } from "@/components/ui/svgs/reactLight"

const features = [
  {
    icon: IconBolt,
    title: "Simple",
    body: "Get started in minutes. No complex configuration.",
  },
  {
    icon: IconDiamond,
    title: "Lightweight",
    body: "Only load the translations you need.",
  },
  {
    icon: IconStack2,
    title: "Framework agnostic",
    body: "Consistent experience across React and Vue.",
  },
]

export function Home() {
  const isDark = useResolvedDark()

  return (
    <div className="flex flex-col">
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:flex-row lg:gap-16 lg:py-28">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <span className="inline-flex w-fit items-center rounded-full border border-primary/40 px-3.5 py-1.5 text-xs text-primary">
            Open Source &middot; Built for Laravel + Inertia
          </span>
          <h1 className="max-w-xl text-3xl leading-[1.08] font-bold tracking-tight sm:text-5xl">
            Localization that feels <span className="text-primary">native</span>{" "}
            to Inertia.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Keep Laravel as your source of truth. Use your translations
            naturally in React and Vue.
          </p>
          <div className="mt-2 flex flex-col gap-3 min-[380px]:flex-row">
            <Button
              nativeButton={false}
              render={<Link to="/docs/installation" />}
            >
              Get started &#8594;
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              render={
                <a
                  href="https://github.com/jiordiviera/inertia-locale-kit"
                  target="_blank"
                  rel="noreferrer"
                />
              }
            >
              {isDark ? (
                <GithubDark className="size-4" />
              ) : (
                <GithubLight className="size-4" />
              )}
              View on GitHub
            </Button>
          </div>
        </div>

        <div className="w-full min-w-0 max-w-xl flex-1">
          <CodeBlock className="prose-docs overflow-x-auto rounded-xl border border-border bg-card p-4 text-xs leading-6 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.15)] sm:p-6 sm:text-sm sm:leading-7">
            <code>
              <span className="text-muted-foreground">{"// tsx"}</span>
              {"\n"}
              <span className="text-primary">import</span>{" "}
              {"{ useTranslation }"} <span className="text-primary">from</span>{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                '@inertia-localize/react'
              </span>
              {"\n\n"}
              <span className="text-primary">const</span>{" "}
              {"{ t, locale } = useTranslation()"}
              {"\n"}
              {"t('ui.greeting', "}
              {"{ name: "}
              <span className="text-emerald-600 dark:text-emerald-400">
                'Ada'
              </span>
              {" })"}
            </code>
          </CodeBlock>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 sm:px-6">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Works with
          </span>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            <Laravel className="h-7 w-auto" />
            <div className="flex items-center gap-2">
              {isDark ? (
                <ReactDark className="h-7 w-auto" />
              ) : (
                <ReactLight className="h-7 w-auto" />
              )}
            </div>
            <Vue className="h-7 w-auto" />
            <div className="flex items-center gap-1.5 opacity-40">
              <Svelte className="h-7 w-auto" />
              <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                Soon
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 py-12 sm:grid-cols-3 sm:px-6 sm:py-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 rounded-xl border border-border p-6"
            >
              <feature.icon className="size-8 text-primary" />
              <div className="text-base font-semibold">{feature.title}</div>
              <div className="text-sm leading-relaxed text-muted-foreground">
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
