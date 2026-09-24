import type { ComponentType, SVGProps } from 'react'
import { LaravelLogo, ReactLogo, SvelteLogo, VueLogo } from './tech-icons'

interface Tile {
  key: string
  label: string
  sub: string
  top: number
  left: number
  width: number
  height: number
  border: string
  glow?: string
  textColor: string
  subColor: string
  muted?: boolean
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  iconColor?: string
  floatDelay: string
}

const tiles: Tile[] = [
  {
    key: 'react',
    label: 'React',
    sub: 'useTranslation()',
    top: 20,
    left: 50,
    width: 150,
    height: 104,
    border: '#61dafb',
    textColor: '#c9f2ff',
    subColor: '#8fd9f5',
    icon: ReactLogo,
    iconColor: '#61dafb',
    floatDelay: '0s',
  },
  {
    key: 'vue',
    label: 'Vue',
    sub: 'useTranslation()',
    top: 0,
    left: 235,
    width: 150,
    height: 104,
    border: '#42b883',
    textColor: '#c8f3e0',
    subColor: '#8cd9b4',
    icon: VueLogo,
    iconColor: '#42b883',
    floatDelay: '0.6s',
  },
  {
    key: 'svelte',
    label: 'Svelte',
    sub: 'planned — not v0.1',
    top: 20,
    left: 420,
    width: 150,
    height: 104,
    border: 'rgba(255,62,0,.45)',
    textColor: '#ffc2ae',
    subColor: '#e0997e',
    muted: true,
    icon: SvelteLogo,
    iconColor: '#ff3e00',
    floatDelay: '1.2s',
  },
  {
    key: 'hub',
    label: 'Inertia Localize',
    sub: 'shared i18n prop',
    top: 180,
    left: 250,
    width: 180,
    height: 118,
    border: '#6366f1',
    glow: '0 0 60px rgba(99,102,241,.4)',
    textColor: '#dcdefc',
    subColor: '#a5b4fc',
    floatDelay: '1.8s',
  },
  {
    key: 'laravel',
    label: 'Laravel',
    sub: 'source of truth — lang/ files',
    top: 330,
    left: 230,
    width: 220,
    height: 140,
    border: '#ff2d20',
    textColor: '#ffcfc9',
    subColor: '#ff9d92',
    icon: LaravelLogo,
    iconColor: '#ff2d20',
    floatDelay: '2.4s',
  },
]

const staticLines = [
  { x1: 125, y1: 124, x2: 125, y2: 150 },
  { x1: 310, y1: 104, x2: 310, y2: 150 },
  { x1: 495, y1: 124, x2: 495, y2: 150 },
  { x1: 125, y1: 150, x2: 495, y2: 150 },
  { x1: 340, y1: 150, x2: 340, y2: 180 },
  { x1: 340, y1: 298, x2: 340, y2: 330 },
]

const flows = [
  {
    path: 'M340,180 L340,150 L125,150 L125,124',
    color: '#61dafb',
    dur: '2.6s',
    begin: '0s',
  },
  {
    path: 'M340,180 L340,150 L310,150 L310,104',
    color: '#42b883',
    dur: '2.6s',
    begin: '0.35s',
  },
  {
    path: 'M340,180 L340,150 L495,150 L495,124',
    color: '#ff8a63',
    dur: '2.6s',
    begin: '0.7s',
  },
  { path: 'M340,330 L340,298', color: '#a5b4fc', dur: '1.4s', begin: '0s' },
]

export function EcosystemDiagram() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div
        className="relative"
        style={{ width: 640, height: 480, perspective: 1400 }}
      >
        <svg
          viewBox="0 0 640 480"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {staticLines.map((line) => (
            <line
              key={`${line.x1}-${line.y1}-${line.x2}-${line.y2}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="rgba(255,255,255,.16)"
              strokeWidth="1.5"
            />
          ))}
          <g className="ecosystem-flow">
            {flows.map((flow) => (
              <circle key={flow.path} r="3.5" fill={flow.color}>
                <animateMotion
                  dur={flow.dur}
                  begin={flow.begin}
                  repeatCount="indefinite"
                  path={flow.path}
                  calcMode="linear"
                />
              </circle>
            ))}
          </g>
        </svg>

        {tiles.map((tile) => {
          const Icon = tile.icon
          return (
            <div
              key={tile.key}
              className="ecosystem-tile absolute flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 backdrop-blur-sm"
              style={{
                top: tile.top,
                left: tile.left,
                width: tile.width,
                height: tile.height,
                transform: 'rotateX(50deg) rotateZ(-38deg)',
                borderColor: tile.border,
                background: `${tile.border}14`,
                boxShadow: [tile.glow, '0 20px 30px -10px rgba(0,0,0,.6)']
                  .filter(Boolean)
                  .join(', '),
                opacity: tile.muted ? 0.65 : 1,
                animationDelay: tile.floatDelay,
              }}
            >
              {Icon && (
                <Icon className="size-6" style={{ color: tile.iconColor }} />
              )}
              {!Icon && (
                <img src="/logo-128.png" alt="" className="size-6 rounded-md" />
              )}
              <span
                className="font-bold"
                style={{
                  color: tile.textColor,
                  fontSize: tile.label.length > 10 ? 15 : 17,
                }}
              >
                {tile.label}
              </span>
              <span className="text-[11px]" style={{ color: tile.subColor }}>
                {tile.sub}
              </span>
            </div>
          )
        })}
      </div>
      <p className="text-sm text-white/40">
        Laravel translations flow up through Inertia Localize into every
        frontend adapter.
      </p>
    </div>
  )
}
