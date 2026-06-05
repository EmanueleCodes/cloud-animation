import { useMemo } from 'react'
import { DEFAULT_CLOUD_PARAMS } from './constants'
import { FilledBlob } from './components/FilledBlob'
import { OutlineSvgScene } from './components/OutlineSvgScene'
import { Tail } from './components/Tail'
import { useCloudStage } from './hooks/useCloudStage'
import { usePauseWhenHidden } from './hooks/usePauseWhenHidden'
import type { AnimatedCloudProps } from './types'
import {
    isSvgOutlineMode,
    resolveFillColor,
    scaleOutlineForDisplay,
} from './utils/render'

/**
 * Animated ChatGPT-style cloud with orbiting blobs and a bezier tail.
 *
 * Supports three render modes:
 * - `filled` — solid div circles
 * - `outline` — SVG strokes with outer halo
 * - `outlineFill` — filled SVG circles plus inner stroke and outer halo
 */
export function AnimatedCloud({
    params = DEFAULT_CLOUD_PARAMS,
    showTailGuides = false,
    flipY = false,
    mergedOutline = false,
    displayScale = 1,
    labelOffsetY = 0,
    filled = false,
    className,
    children,
}: AnimatedCloudProps) {
    const { containerRef, paused } = usePauseWhenHidden()
    const stage = useCloudStage(params, paused)
    const scaledStageSize = stage.stageSize * displayScale
    const outlineStyle = useMemo(
        () => scaleOutlineForDisplay(stage.outlineStyle, displayScale),
        [stage.outlineStyle, displayScale],
    )

    const svgVariant = useMemo(() => {
        if (!isSvgOutlineMode(params.renderMode)) {
            return 'outline' as const
        }

        return filled ? ('outlineFill' as const) : ('outline' as const)
    }, [filled, params.renderMode])

    const fillColor = resolveFillColor(params)

    return (
        <div
            ref={containerRef}
            className={`relative ${className ?? ''}`}
            style={{
                width: scaledStageSize,
                height: scaledStageSize,
            }}
        >
            {/* Outer container — sized to the scaled stage; observed for viewport visibility */}

            {/* Animation stage — centered and scaled; all blobs render inside this box */}
            <div
                className="absolute left-1/2 top-1/2 origin-center"
                style={{
                    width: stage.stageSize,
                    height: stage.stageSize,
                    transform: `translate(-50%, -50%) scale(${displayScale * (flipY ? -1 : 1)}, ${displayScale})`,
                    filter:
                        mergedOutline && params.renderMode === 'outline'
                            ? `drop-shadow(0 0 ${params.outline.outerWidth}px ${params.outline.innerColor})`
                            : undefined,
                }}
            >
                {isSvgOutlineMode(params.renderMode) && !mergedOutline ? (
                    <>
                        {/* SVG path — per-blob inner stroke + outer halo via feMorphology filter */}
                        <OutlineSvgScene
                            blobs={stage.blobs}
                            tailBlobs={stage.tailBlobs}
                            globalOrbitAngle={stage.globalOrbitAngle}
                            globalRadiusPhase={stage.globalRadiusPhase}
                            globalTailPhase={stage.globalTailPhase}
                            outlineStyle={outlineStyle}
                            variant={svgVariant}
                        />
                    </>
                ) : (
                    <>
                        {/* Main cloud body — orbiting circles */}
                        {stage.blobs.map((blob) => (
                            <FilledBlob
                                key={blob.id}
                                config={blob}
                                color={fillColor}
                                globalOrbitAngle={stage.globalOrbitAngle}
                                globalRadiusPhase={stage.globalRadiusPhase}
                            />
                        ))}

                        {/* Thought-bubble tail — blobs placed along a cubic bezier curve */}
                        <Tail
                            blobs={stage.tailBlobs}
                            color={fillColor}
                            globalTailPhase={stage.globalTailPhase}
                            curve={stage.tailCurve}
                            showGuides={showTailGuides}
                        />
                    </>
                )}
            </div>

            {/* Optional overlay slot — e.g. label text in outline+fill mode */}
            {filled && children ? (
                <div
                    className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
                    style={{ transform: `translateY(${labelOffsetY}px)` }}
                >
                    {children}
                </div>
            ) : null}
        </div>
    )
}
