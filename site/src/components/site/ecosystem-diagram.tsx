import { cn } from '@/lib/utils'

interface Tile {
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
}

const tiles: Tile[] = [
  {
    label: 'React',
    sub: 'useTranslation()',
    top: 30,
    left: 60,
    width: 150,
    height: 95,
    border: '#61dbfb',
    textColor: '#beefff',
    subColor: '#8fd9f5',
  },
  {
    label: 'Vue',
    sub: 'useTranslation()',
    top: 10,
    left: 245,
    width: 150,
    height: 95,
    border: '#42b883',
    textColor: '#b9f0d8',
    subColor: '#8cd9b4',
  },
  {
    label: 'Svelte',
    sub: 'planned — not v0.1',
    top: 30,
    left: 430,
    width: 150,
    height: 95,
    border: 'rgba(255,110,64,.55)',
    textColor: '#ffb69e',
    subColor: '#e39a82',
    muted: true,
  },
  {
    label: '{t} Inertia Localize',
    sub: 'shared i18n prop',
    top: 170,
    left: 260,
    width: 180,
    height: 110,
    border: '#6366f1',
    glow: '0 0 50px rgba(99,102,241,.35)',
    textColor: '#c7cbfc',
    subColor: '#a5b4fc',
  },
  {
    label: 'Laravel',
    sub: 'source of truth — lang/ files',
    top: 310,
    left: 240,
    width: 220,
    height: 130,
    border: '#ff6b4a',
    textColor: '#ffc7b8',
    subColor: '#ffa98f',
  },
]

const connectors = [
  { left: 134, top: 118, width: 2, height: 32, color: 'rgba(97,219,251,.4)' },
  { left: 319, top: 98, width: 2, height: 52, color: 'rgba(66,184,131,.4)' },
  { left: 504, top: 118, width: 2, height: 32, color: 'rgba(255,110,64,.3)' },
  {
    left: 135,
    top: 150,
    width: 370,
    height: 2,
    color: 'rgba(229,231,235,.25)',
  },
  { left: 349, top: 150, width: 2, height: 20, color: 'rgba(165,180,252,.5)' },
  { left: 349, top: 280, width: 2, height: 30, color: 'rgba(165,180,252,.5)' },
]

export function EcosystemDiagram() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative"
        style={{ width: 640, height: 460, perspective: 1200, maxWidth: '100%' }}
      >
        {connectors.map((c) => (
          <div
            key={`${c.left}-${c.top}`}
            className="absolute"
            style={{
              left: c.left,
              top: c.top,
              width: c.width,
              height: c.height,
              background: c.color,
            }}
          />
        ))}

        {tiles.map((tile) => (
          <div
            key={tile.label}
            className={cn(
              'absolute flex flex-col items-center justify-center gap-1 rounded-2xl border-2 text-center backdrop-blur-sm',
              tile.muted && 'opacity-60',
            )}
            style={{
              left: tile.left,
              top: tile.top,
              width: tile.width,
              height: tile.height,
              transform: 'rotateX(50deg) rotateZ(-38deg)',
              borderColor: tile.border,
              background: `${tile.border}14`,
              boxShadow: [tile.glow, '0 20px 30px -10px rgba(0,0,0,.6)']
                .filter(Boolean)
                .join(', '),
            }}
          >
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
        ))}
      </div>
      <p className="text-sm text-white/40">
        Laravel translations flow up through Inertia Localize into every
        frontend adapter.
      </p>
    </div>
  )
}
