import type { BlobConfig, Point } from '../types'

/** Evenly distributes blob phase offsets around a full cycle. */
export function getStaggerPhaseOffset(index: number, count: number) {
    return (index / count) * Math.PI * 2
}

/** Samples a point on a cubic bezier curve at parameter t ∈ [0, 1]. */
export function sampleCubicBezier(
    p0: Point,
    p1: Point,
    p2: Point,
    p3: Point,
    t: number,
): Point {
    const u = 1 - t
    const tt = t * t
    const uu = u * u
    const uuu = uu * u
    const ttt = tt * t

    return {
        x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
        y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
    }
}

/** Returns the tangent vector of a cubic bezier at parameter t. */
export function sampleCubicBezierTangent(
    p0: Point,
    p1: Point,
    p2: Point,
    p3: Point,
    t: number,
): Point {
    const u = 1 - t
    return {
        x:
            3 * u * u * (p1.x - p0.x) +
            6 * u * t * (p2.x - p1.x) +
            3 * t * t * (p3.x - p2.x),
        y:
            3 * u * u * (p1.y - p0.y) +
            6 * u * t * (p2.y - p1.y) +
            3 * t * t * (p3.y - p2.y),
    }
}

/** Computes the orbiting position of a cloud blob at the current animation phase. */
export function getCloudBlobPosition(
    config: BlobConfig,
    angleDeg: number,
    radiusPhase: number,
): Point {
    const radialPulse =
        config.polarity * config.radiusOscAmplitude * Math.sin(radiusPhase)
    const currentRadius = config.orbitRadius + radialPulse
    const angleRad = (angleDeg * Math.PI) / 180

    return {
        x: Math.cos(angleRad) * currentRadius,
        y: Math.sin(angleRad) * currentRadius,
    }
}
