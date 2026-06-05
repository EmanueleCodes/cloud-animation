import { animate, useMotionValue } from 'motion/react'
import { useEffect, useMemo } from 'react'
import type { CloudParams, OutlineStyle } from '../types'
import {
    getStaggerPhaseOffset,
    sampleCubicBezier,
    sampleCubicBezierTangent,
} from '../utils/geometry'

/**
 * Owns the three global animation drivers (orbit, radius pulse, tail wobble)
 * and derives blob layouts from the current parameter set.
 */
export function useCloudStage(params: CloudParams, paused = false) {
    const globalOrbitAngle = useMotionValue(0)
    const globalRadiusPhase = useMotionValue(0)
    const globalTailPhase = useMotionValue(0)

    useEffect(() => {
        if (paused) return

        const controls = animate(globalOrbitAngle, [0, 360], {
            duration: params.orbitSpeed,
            repeat: Infinity,
            ease: 'linear',
        })

        return () => controls.stop()
    }, [globalOrbitAngle, params.orbitSpeed, paused])

    useEffect(() => {
        if (paused) return

        const controls = animate(globalRadiusPhase, [0, Math.PI * 2], {
            duration: params.radiusOscillation.speed,
            repeat: Infinity,
            ease: 'linear',
        })

        return () => controls.stop()
    }, [globalRadiusPhase, params.radiusOscillation.speed, paused])

    useEffect(() => {
        if (paused) return

        const controls = animate(globalTailPhase, [0, Math.PI * 2], {
            duration: params.tail.oscillationSpeed,
            repeat: Infinity,
            ease: 'linear',
        })

        return () => controls.stop()
    }, [globalTailPhase, params.tail.oscillationSpeed, paused])

    const blobs = useMemo(() => {
        if (params.duoMode) {
            const configs = []

            for (let i = 0; i < params.blobCount; i++) {
                const startRotation = (i / params.blobCount) * 360
                const radiusOscPhaseOffset = getStaggerPhaseOffset(
                    i,
                    params.blobCount,
                )
                const pairConfig = {
                    size: params.blobSize,
                    orbitRadius: params.orbitRadius,
                    orbitDuration: params.orbitSpeed,
                    startRotation,
                    scaleMin: 1 - params.scaleAmplitude,
                    scaleMax: 1 + params.scaleAmplitude,
                    radiusOscAmplitude: params.radiusOscillation.amplitude,
                    radiusOscPhaseOffset,
                }

                configs.push(
                    { ...pairConfig, id: `${i}-inner`, polarity: -1 as const },
                    { ...pairConfig, id: `${i}-outer`, polarity: 1 as const },
                )
            }

            return configs
        }

        const configs = []
        for (let i = 0; i < params.blobCount; i++) {
            const phase = getStaggerPhaseOffset(i, params.blobCount)
            const wave = Math.sin(phase)
            const wave2 = Math.cos(phase)
            const startRotation = (i / params.blobCount) * 360

            configs.push({
                id: `${i}`,
                size: params.blobSize * (1 + params.variation.size * wave),
                orbitRadius:
                    params.orbitRadius + params.variation.radius * wave2,
                orbitDuration: params.orbitSpeed,
                startRotation,
                scaleMin:
                    1 -
                    params.scaleAmplitude -
                    params.variation.scaleAmplitude * Math.abs(wave),
                scaleMax:
                    1 +
                    params.scaleAmplitude +
                    params.variation.scaleAmplitude * Math.abs(wave2),
                radiusOscAmplitude: params.radiusOscillation.amplitude,
                radiusOscPhaseOffset: phase,
                polarity: 1 as const,
            })
        }
        return configs
    }, [
        params.blobCount,
        params.blobSize,
        params.orbitRadius,
        params.orbitSpeed,
        params.scaleAmplitude,
        params.duoMode,
        params.variation.size,
        params.variation.radius,
        params.variation.scaleAmplitude,
        params.radiusOscillation.amplitude,
    ])

    const tailCurve = useMemo(
        () => ({
            p0: params.tail.bigBlob,
            p1: params.tail.handle1,
            p2: params.tail.handle2,
            p3: params.tail.smallBlob,
        }),
        [
            params.tail.bigBlob,
            params.tail.handle1,
            params.tail.handle2,
            params.tail.smallBlob,
        ],
    )

    const tailBlobs = useMemo(() => {
        const configs = []
        const count = params.tail.blobCount
        const scaleMin = 1 - params.tail.scaleAmplitude
        const scaleMax = 1 + params.tail.scaleAmplitude

        for (let i = 0; i < count; i++) {
            const t = count === 1 ? 0 : i / (count - 1)
            const point = sampleCubicBezier(
                tailCurve.p0,
                tailCurve.p1,
                tailCurve.p2,
                tailCurve.p3,
                t,
            )
            const tangent = sampleCubicBezierTangent(
                tailCurve.p0,
                tailCurve.p1,
                tailCurve.p2,
                tailCurve.p3,
                t,
            )
            const tangentLength = Math.hypot(tangent.x, tangent.y) || 1
            const normalX = -tangent.y / tangentLength
            const normalY = tangent.x / tangentLength
            const sizeTaper = 1 - t * 0.45

            configs.push({
                id: `tail-${i}`,
                baseX: point.x,
                baseY: point.y,
                normalX,
                normalY,
                size: params.tail.blobSize * sizeTaper,
                scaleMin,
                scaleMax,
                positionAmplitude: params.tail.positionAmplitude,
                radiusOscPhaseOffset: getStaggerPhaseOffset(i, count),
            })
        }

        return configs
    }, [
        params.tail.blobCount,
        params.tail.blobSize,
        params.tail.scaleAmplitude,
        params.tail.positionAmplitude,
        tailCurve,
    ])

    const stageSize = useMemo(() => {
        const cloudReach =
            params.orbitRadius +
            params.variation.radius +
            params.radiusOscillation.amplitude +
            params.blobSize

        const tailPoints = [
            tailCurve.p0,
            tailCurve.p1,
            tailCurve.p2,
            tailCurve.p3,
            ...tailBlobs.map((blob) => ({ x: blob.baseX, y: blob.baseY })),
        ]

        let extent = cloudReach
        for (const point of tailPoints) {
            extent = Math.max(
                extent,
                Math.hypot(point.x, point.y) + params.tail.blobSize,
            )
        }

        return extent * 2.4
    }, [
        params.orbitRadius,
        params.variation.radius,
        params.radiusOscillation.amplitude,
        params.blobSize,
        params.tail.blobSize,
        tailCurve,
        tailBlobs,
    ])

    const outlineStyle = useMemo<OutlineStyle>(
        () => ({
            fillColor: params.outline.fillColor,
            innerColor: params.outline.innerColor,
            outerColor: params.outline.outerColor,
            fillOpacity: params.outline.fillOpacity,
            innerOpacity: params.outline.innerOpacity,
            outerOpacity: params.outline.outerOpacity,
            innerWidth: params.outline.innerWidth,
            outerWidth: params.outline.outerWidth,
        }),
        [params.outline],
    )

    return {
        blobs,
        tailBlobs,
        tailCurve,
        stageSize,
        outlineStyle,
        globalOrbitAngle,
        globalRadiusPhase,
        globalTailPhase,
    }
}
