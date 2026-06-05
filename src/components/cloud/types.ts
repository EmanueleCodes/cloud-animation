import type { ReactNode } from 'react'

/** 2D coordinate used for bezier sampling and blob placement. */
export type Point = { x: number; y: number }

/** Stroke and fill tokens for SVG outline render modes. */
export interface OutlineStyle {
    fillColor: string
    innerColor: string
    outerColor: string
    fillOpacity: number
    innerOpacity: number
    outerOpacity: number
    innerWidth: number
    outerWidth: number
}

/** Configuration for a single orbiting cloud blob. */
export interface BlobConfig {
    id: string
    size: number
    orbitRadius: number
    orbitDuration: number
    startRotation: number
    scaleMin: number
    scaleMax: number
    radiusOscAmplitude: number
    radiusOscPhaseOffset: number
    polarity: 1 | -1
}

/** Configuration for a tail blob placed along the bezier curve. */
export interface TailBlobConfig {
    id: string
    baseX: number
    baseY: number
    normalX: number
    normalY: number
    size: number
    scaleMin: number
    scaleMax: number
    positionAmplitude: number
    radiusOscPhaseOffset: number
}

export type RenderMode = 'filled' | 'outline' | 'outlineFill'

/** Full parameter surface for the animated cloud. */
export type CloudParams = {
    renderMode: RenderMode
    blobSize: number
    blobCount: number
    orbitRadius: number
    orbitSpeed: number
    scaleAmplitude: number
    color: string
    variation: {
        size: number
        radius: number
        scaleAmplitude: number
    }
    radiusOscillation: {
        amplitude: number
        speed: number
    }
    duoMode: boolean
    outline: {
        fillColor: string
        innerColor: string
        outerColor: string
        fillOpacity: number
        innerOpacity: number
        outerOpacity: number
        innerWidth: number
        outerWidth: number
    }
    tail: {
        blobCount: number
        blobSize: number
        scaleAmplitude: number
        positionAmplitude: number
        oscillationSpeed: number
        bigBlob: Point
        smallBlob: Point
        handle1: Point
        handle2: Point
    }
}

export type TailCurve = {
    p0: Point
    p1: Point
    p2: Point
    p3: Point
}

export type OutlineBlobLayer = 'fill' | 'stroke' | 'outerMask'

export type OutlineSvgVariant = 'outline' | 'outlineFill'

export interface AnimatedCloudProps {
    params?: CloudParams
    showTailGuides?: boolean
    flipY?: boolean
    /** Outline as a merged silhouette — overlapping fills, no per-blob inner strokes. */
    mergedOutline?: boolean
    displayScale?: number
    labelOffsetY?: number
    filled?: boolean
    className?: string
    children?: ReactNode
}
