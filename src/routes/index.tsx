import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  AnimatedCloud,
  DEFAULT_CLOUD_PARAMS,
  type CloudParams,
} from '#/components/AnimatedCloud'

type RenderMode = CloudParams['renderMode']

const MODES: { id: RenderMode; label: string }[] = [
  { id: 'filled', label: 'Filled' },
  { id: 'outline', label: 'Outline' },
  { id: 'outlineFill', label: 'Outline + Fill' },
]

const SVG_OUTLINE_DEFAULTS = {
  fillColor: '#ffffff',
  innerColor: '#c8c8c8',
  outerColor: '#ffffff',
  fillOpacity: 0,
  innerOpacity: 0.3,
  outerOpacity: 1,
  innerWidth: 0.7,
  outerWidth: 0.7,
} as const

function getParamsForMode(mode: RenderMode): CloudParams {
  if (mode === 'filled') {
    return {
      ...DEFAULT_CLOUD_PARAMS,
      renderMode: 'filled',
      color: '#FFFFFF',
    }
  }

  return {
    ...DEFAULT_CLOUD_PARAMS,
    renderMode: mode,
    color: '#FFFFFF',
    outline: {
      ...DEFAULT_CLOUD_PARAMS.outline,
      ...SVG_OUTLINE_DEFAULTS,
    },
  }
}

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [mode, setMode] = useState<RenderMode>('filled')
  const params = useMemo(() => getParamsForMode(mode), [mode])
  const isSvgMode = mode === 'outline' || mode === 'outlineFill'

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#141414] px-8 text-white">
      <div className="flex w-full max-w-2xl flex-col items-center gap-10">
        <header className="flex flex-col items-center gap-3 text-center">
          <p className="m-0 text-sm text-[#7f7f7f]">Code / ChatGPT cloud</p>
          <h1 className="m-0 text-2xl font-semibold tracking-tight">
            Cloud Animation
          </h1>
          <p className="m-0 max-w-md text-sm text-[#9a9a9a]">
            Finished version from the{' '}
            <a
              href="https://emanuelecodes.com/cloud-tutorial"
              className="text-white underline underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              tutorial
            </a>
            . Switch render modes below.
          </p>
        </header>

        <div className="relative flex h-[360px] w-full items-center justify-center overflow-hidden rounded-2xl border border-[#292929] bg-[#1b1b1b]">
          <AnimatedCloud
            params={params}
            displayScale={0.55}
            filled={mode === 'outlineFill'}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {MODES.map((option) => {
            const isActive = mode === option.id
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setMode(option.id)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? 'border-white bg-white text-[#141414]'
                    : 'border-[#3a3a3a] bg-transparent text-[#bdbdbd] hover:border-[#5a5a5a] hover:text-white'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>

        <p className="m-0 text-center text-xs text-[#666]">
          {isSvgMode
            ? 'SVG outline mode — inner stroke + outer halo'
            : 'DOM filled mode — overlapping circles with tail'}
        </p>
      </div>
    </main>
  )
}
