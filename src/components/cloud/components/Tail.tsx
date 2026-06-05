import type { MotionValue } from 'motion/react'
import { useMemo } from 'react'
import type { TailBlobConfig, TailCurve } from '../types'
import { TailBlob } from './TailBlob'

/** Renders the tail blobs and optional bezier guide overlay. */
export function Tail({
    blobs,
    color,
    globalTailPhase,
    curve,
    showGuides = false,
}: {
    blobs: TailBlobConfig[]
    color: string
    globalTailPhase: MotionValue<number>
    curve: TailCurve
    showGuides?: boolean
}) {
    const pathD = useMemo(() => {
        const { p0, p1, p2, p3 } = curve
        return `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`
    }, [curve])

    return (
        <>
            {showGuides ? (
                <svg
                    className="pointer-events-none absolute left-1/2 top-1/2 overflow-visible"
                    style={{ transform: 'translate(-50%, -50%)' }}
                    width={1}
                    height={1}
                    aria-hidden
                >
                    <path
                        d={pathD}
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth={1}
                        strokeDasharray="4 4"
                    />
                    <circle
                        cx={curve.p0.x}
                        cy={curve.p0.y}
                        r={3}
                        fill="rgba(255,255,255,0.2)"
                    />
                    <circle
                        cx={curve.p3.x}
                        cy={curve.p3.y}
                        r={3}
                        fill="rgba(255,255,255,0.2)"
                    />
                    <circle
                        cx={curve.p1.x}
                        cy={curve.p1.y}
                        r={2.5}
                        fill="rgba(255,255,255,0.12)"
                    />
                    <circle
                        cx={curve.p2.x}
                        cy={curve.p2.y}
                        r={2.5}
                        fill="rgba(255,255,255,0.12)"
                    />
                </svg>
            ) : null}

            {blobs.map((blob) => (
                <TailBlob
                    key={blob.id}
                    config={blob}
                    color={color}
                    globalTailPhase={globalTailPhase}
                />
            ))}
        </>
    )
}
