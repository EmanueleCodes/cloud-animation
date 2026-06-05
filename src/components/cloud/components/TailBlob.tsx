import { motion } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { useTailBlobTransforms } from '../hooks/useBlobTransforms'
import { getBlobSurfaceStyle } from '../utils/render'
import type { TailBlobConfig } from '../types'

/** A single filled circle in the thought-bubble tail (div-based render path). */
export function TailBlob({
    config,
    color,
    globalTailPhase,
}: {
    config: TailBlobConfig
    color: string
    globalTailPhase: MotionValue<number>
}) {
    const { x, y, scale } = useTailBlobTransforms(config, globalTailPhase)

    return (
        <motion.div
            className="absolute rounded-full"
            style={{
                width: config.size,
                height: config.size,
                left: '50%',
                top: '50%',
                marginLeft: -config.size / 2,
                marginTop: -config.size / 2,
                x,
                y,
                scale,
                ...getBlobSurfaceStyle(color),
            }}
        />
    )
}
