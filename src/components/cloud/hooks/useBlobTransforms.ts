import { useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { getCloudBlobPosition } from '../utils/geometry'
import type { BlobConfig, TailBlobConfig } from '../types'

/** Derives x/y/scale motion values for an orbiting cloud blob. */
export function useCloudBlobTransforms(
    config: BlobConfig,
    globalOrbitAngle: MotionValue<number>,
    globalRadiusPhase: MotionValue<number>,
) {
    const angle = useTransform(
        globalOrbitAngle,
        (orbitAngle) => config.startRotation + orbitAngle,
    )
    const radiusPhase = useTransform(
        globalRadiusPhase,
        (global) => global + config.radiusOscPhaseOffset,
    )
    const x = useTransform([angle, radiusPhase], ([a, r]) => {
        return getCloudBlobPosition(config, a as number, r as number).x
    })
    const y = useTransform([angle, radiusPhase], ([a, r]) => {
        return getCloudBlobPosition(config, a as number, r as number).y
    })
    const scale = useTransform(radiusPhase, (r) => {
        const pulse = (Math.sin(r) + 1) / 2
        const scaleRange = config.scaleMax - config.scaleMin

        if (config.polarity === 1) {
            return config.scaleMin + pulse * scaleRange
        }

        return config.scaleMax - pulse * scaleRange
    })

    return { x, y, scale }
}

/** Derives x/y/scale motion values for a tail blob along the bezier path. */
export function useTailBlobTransforms(
    config: TailBlobConfig,
    globalTailPhase: MotionValue<number>,
) {
    const radiusPhase = useTransform(
        globalTailPhase,
        (global) => global + config.radiusOscPhaseOffset,
    )
    const x = useTransform(radiusPhase, (r) => {
        const pulse = Math.sin(r)
        return config.baseX + config.normalX * config.positionAmplitude * pulse
    })
    const y = useTransform(radiusPhase, (r) => {
        const pulse = Math.sin(r)
        return config.baseY + config.normalY * config.positionAmplitude * pulse
    })
    const scale = useTransform(radiusPhase, (r) => {
        const pulse = (Math.sin(r) + 1) / 2
        return config.scaleMin + pulse * (config.scaleMax - config.scaleMin)
    })

    return { x, y, scale }
}
