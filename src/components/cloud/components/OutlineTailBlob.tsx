import { motion, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { createPortal } from 'react-dom'
import { useTailBlobTransforms } from '../hooks/useBlobTransforms'
import type { OutlineBlobLayer, TailBlobConfig } from '../types'

/** SVG circle for a single tail blob in outline / outline+fill mode. */
export function OutlineTailBlob({
    config,
    globalTailPhase,
    outerMaskLayer,
    fillColor,
    strokeColor,
    strokeWidth,
    layer,
}: {
    config: TailBlobConfig
    globalTailPhase: MotionValue<number>
    outerMaskLayer: SVGGElement | null
    fillColor: string
    strokeColor: string
    strokeWidth: number
    layer: OutlineBlobLayer
}) {
    const { x, y, scale } = useTailBlobTransforms(config, globalTailPhase)
    const radius = useTransform(scale, (value) => (config.size * value) / 2)

    if (layer === 'fill') {
        return <motion.circle cx={x} cy={y} r={radius} fill={fillColor} />
    }

    if (layer === 'stroke') {
        return (
            <motion.circle
                cx={x}
                cy={y}
                r={radius}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
            />
        )
    }

    return outerMaskLayer
        ? createPortal(
              <motion.circle cx={x} cy={y} r={radius} fill="#ffffff" />,
              outerMaskLayer,
          )
        : null
}
