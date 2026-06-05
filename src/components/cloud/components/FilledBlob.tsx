import { motion } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { useCloudBlobTransforms } from '../hooks/useBlobTransforms'
import { getBlobSurfaceStyle } from '../utils/render'
import type { BlobConfig } from '../types'

/** A single filled circle in the main cloud body (div-based render path). */
export function FilledBlob({
    config,
    color,
    globalOrbitAngle,
    globalRadiusPhase,
}: {
    config: BlobConfig
    color: string
    globalOrbitAngle: MotionValue<number>
    globalRadiusPhase: MotionValue<number>
}) {
    const { x, y, scale } = useCloudBlobTransforms(
        config,
        globalOrbitAngle,
        globalRadiusPhase,
    )

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
