import {
  IconArrowRight,
  IconBolt,
  IconBraces,
  IconCheck,
  IconCode,
  IconRoute,
  IconShieldCheck,
} from "@tabler/icons-react"
import { Link } from "react-router-dom"

import { CodeBlock } from "@/components/site/code-block"
import { SiteFooter } from "@/components/site/site-footer"
import { Button } from "@/components/ui/button"
import { GithubDark } from "@/components/ui/svgs/githubDark"
import { GithubLight } from "@/components/ui/svgs/githubLight"
import { Laravel } from "@/components/ui/svgs/laravel"
import { ReactDark } from "@/components/ui/svgs/reactDark"
import { ReactLight } from "@/components/ui/svgs/reactLight"
import { Vue } from "@/components/ui/svgs/vue"
import { useResolvedDark } from "@/lib/use-resolved-dark"

const features = [
  {
    icon: IconBolt,
    title: "Minimal integration",
    body: "Add the Laravel package, share your translations through Inertia, and start translating in minutes.",
  },
  {
    icon: IconBraces,
    title: "Type-safe by design",
    body: "Keep a small, predictable API with interpolation and shared types across your application.",
  },
  {
    icon: IconShieldCheck,
    title: "One source of truth",
    body: "No mirrored JSON files, synchronization scripts, or second frontend translation system to maintain.",
  },
]

export function Home() {
  const isDark = useResolvedDark()

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_34%)]" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:flex-row lg:items-center lg:gap-20 lg:py-32">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-6">
            <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary">
              Open source &middot; Built for Laravel + Inertia
            </span>
            <h1 className="max-w-2xl text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl">
              Your Laravel translations.{" "}
              <span className="text-primary">Your Inertia frontend.</span> One
              source of truth.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Laravel translations, available directly in React and Vue. Stop
              duplicating locale files and keep your application in sync.
            </p>
            <div className="flex flex-col gap-3 min-[380px]:flex-row">
              <Button
                size="lg"
                nativeButton={false}
                render={<Link to="/docs/installation" />}
              >
                Get started <IconArrowRight />
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={
                  <a
                    href="https://github.com/jiordiviera/inertia-localize"
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                {isDark ? (
                  <GithubLight className="size-4" />
                ) : (
                  <GithubDark className="size-4" />
                )}
                View on GitHub
              </Button>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <IconCheck className="size-3.5 text-primary" /> React & Vue
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconCheck className="size-3.5 text-primary" /> TypeScript
              </span>
              <span className="inline-flex items-center gap-1.5">
                <IconCheck className="size-3.5 text-primary" /> No duplicated
                files
              </span>
            </div>
          </div>

          <div className="w-full max-w-xl min-w-0 flex-1">
            <CodeBlock className="prose-docs overflow-x-auto rounded-xl border border-border bg-card p-4 text-xs leading-6 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.3)] sm:p-6 sm:text-sm sm:leading-7">
              <code>
                <span className="text-muted-foreground">{"// React"}</span>
                {"\n"}
                <span className="text-primary">import</span>{" "}
                {"{ useTranslation }"}{" "}
                <span className="text-primary">from</span>{" "}
                <span className="text-emerald-600 dark:text-emerald-400">
                  '@inertia-localize/react'
                </span>
                {"\n\n"}
                <span className="text-primary">const</span>{" "}
                {"{ t } = useTranslation()"}
                {"\n\n"}
                <span className="text-primary">return</span> {"<h1>{t("}
                <span className="text-emerald-600 dark:text-emerald-400">
                  'dashboard.welcome'
                </span>
                {")}</h1>"}
              </code>
            </CodeBlock>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              <span>Translations stay in Laravel&apos;s lang/ directory</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
              The problem
            </p>
            <h2 className="max-w-lg text-3xl font-bold tracking-tight sm:text-4xl">
              Your translations shouldn&apos;t have to live twice.
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
              A separate frontend i18n setup means duplicated locale files,
              synchronization work, and a second system to configure. Inertia
              Localize keeps the backend you already trust at the center.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["1", "Duplicate locale files"],
              ["2", "Synchronize changes"],
              ["3", "Maintain two systems"],
            ].map(([number, label]) => (
              <div
                key={number}
                className="rounded-xl border border-border bg-background p-5"
              >
                <span className="text-2xl font-bold text-primary">
                  {number}
                </span>
                <p className="mt-8 text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
              30-second setup
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Keep your stack small.
            </h2>
          </div>
          <Link
            to="/docs/quickstart"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Read the quickstart <IconArrowRight className="size-4" />
          </Link>
        </div>
        <CodeBlock className="prose-docs overflow-x-auto rounded-xl border border-border bg-card p-5 text-sm leading-7 shadow-sm sm:p-7">
          <code>
            <span className="text-muted-foreground">{"$ "}</span>
            <span className="text-primary">composer require</span>{" "}
            inertia-localize/laravel
            {"\n\n"}
            <span className="text-muted-foreground">
              {"# Add your adapter"}
            </span>
            {"\n"}
            <span className="text-primary">pnpm add</span>{" "}
            @inertia-localize/react
          </code>
        </CodeBlock>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
              Before / after
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              The same translation, without the busywork.
            </h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <span className="size-2 rounded-full bg-muted-foreground/50" />
                Without Inertia Localize
              </div>
              <CodeBlock className="prose-docs h-full overflow-x-auto rounded-xl border border-border bg-card p-5 text-xs leading-6 opacity-75 sm:text-sm">
                <code>
                  <span className="text-primary">import</span> i18n{" "}
                  <span className="text-primary">from</span>{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    &apos;i18next&apos;
                  </span>
                  {"\n"}
                  <span className="text-primary">import</span> en{" "}
                  <span className="text-primary">from</span>{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    &apos;./locales/en.json&apos;
                  </span>
                  {"\n"}
                  <span className="text-primary">import</span> fr{" "}
                  <span className="text-primary">from</span>{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    &apos;./locales/fr.json&apos;
                  </span>
                  {"\n\n"}
                  <span className="text-muted-foreground">
                    {"// configuration..."}
                  </span>
                  {"\n"}
                  <span className="text-muted-foreground">
                    {"// synchronization..."}
                  </span>
                  {"\n"}
                  <span className="text-muted-foreground">
                    {"// duplicated translations..."}
                  </span>
                </code>
              </CodeBlock>
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <span className="size-2 rounded-full bg-primary" />
                With Inertia Localize
              </div>
              <CodeBlock className="prose-docs h-full overflow-x-auto rounded-xl border border-primary/30 bg-card p-5 text-xs leading-6 sm:text-sm">
                <code>
                  <span className="text-muted-foreground">
                    {"// lang/en/dashboard.php"}
                  </span>
                  {"\n\n"}
                  <span className="text-primary">return</span> [{"\n"}
                  {"  "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    &apos;welcome&apos;
                  </span>
                  {" => "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    &apos;Welcome back!&apos;
                  </span>
                  {",\n];"}
                  {"\n\n"}
                  <span className="text-muted-foreground">
                    {"// Any React or Vue page"}
                  </span>
                  {"\n"}
                  <span className="text-primary">const</span> {"{ t } = "}
                  useTranslation()
                  {"\n"}
                  {"t("}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    &apos;dashboard.welcome&apos;
                  </span>
                  {")"}
                </code>
              </CodeBlock>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
            How it works
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            One clear path from Laravel to your UI.
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Translations flow through the Inertia shared props you already use.
            Your adapter exposes a small, familiar <code>t()</code> API.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-5">
          {[
            { icon: Laravel, label: "Laravel", detail: "lang/*" },
            {
              icon: IconRoute,
              label: "Inertia Localize",
              detail: "normalizes",
            },
            { icon: IconCode, label: "Shared props", detail: "i18n" },
            { icon: ReactLight, label: "React / Vue", detail: "adapters" },
            { icon: IconBraces, label: "t()", detail: "in your page" },
          ].map((step, index) => (
            <div key={step.label} className="flex items-center gap-3 md:block">
              <div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-card p-4 md:min-h-28 md:flex-col md:items-start md:justify-between">
                <step.icon className="size-7 shrink-0 text-primary" />
                <div>
                  <div className="text-sm font-semibold">{step.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {step.detail}
                  </div>
                </div>
              </div>
              {index < 4 ? (
                <IconArrowRight className="hidden size-4 shrink-0 text-muted-foreground md:mx-auto md:mt-3 md:block" />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
                Built for your frontend
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Laravel at the center. Your adapter of choice.
              </h2>
            </div>
            <div className="flex items-center gap-5">
              {isDark ? (
                <ReactDark className="h-8 w-auto" />
              ) : (
                <ReactLight className="h-8 w-auto" />
              )}
              <Vue className="h-8 w-auto" />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-3 rounded-xl border border-border bg-background p-6"
              >
                <feature.icon className="size-7 text-primary" />
                <div className="text-base font-semibold">{feature.title}</div>
                <div className="text-sm leading-relaxed text-muted-foreground">
                  {feature.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-16 text-center sm:px-6 sm:py-24">
        <p className="mb-3 text-xs font-semibold tracking-widest text-primary uppercase">
          Ready to simplify localization?
        </p>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
          Keep Laravel as your source of truth.
        </h2>
        <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
          Get your first translation rendering in an Inertia page in under a
          minute.
        </p>
        <div className="mt-8 flex flex-col gap-3 min-[380px]:flex-row">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link to="/docs/installation" />}
          >
            Read the documentation <IconArrowRight />
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={
              <a
                href="https://github.com/jiordiviera/inertia-localize"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            Explore on GitHub
          </Button>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
