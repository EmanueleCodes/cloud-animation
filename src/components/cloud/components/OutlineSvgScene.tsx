import type { MotionValue } from 'motion/react'
import { useId, useState } from 'react'
import type {
    BlobConfig,
    OutlineStyle,
    OutlineSvgVariant,
    TailBlobConfig,
} from '../types'
import { OutlineCloudBlob } from './OutlineCloudBlob'
import { OutlineTailBlob } from './OutlineTailBlob'

/**
 * SVG render path for outline modes.
 * Uses an feMorphology filter to draw the outer halo around each blob.
 */
export function OutlineSvgScene({
    blobs,
    tailBlobs,
    globalOrbitAngle,
    globalRadiusPhase,
    globalTailPhase,
    outlineStyle,
    variant,
}: {
    blobs: BlobConfig[]
    tailBlobs: TailBlobConfig[]
    globalOrbitAngle: MotionValue<number>
    globalRadiusPhase: MotionValue<number>
    globalTailPhase: MotionValue<number>
    outlineStyle: OutlineStyle
    variant: OutlineSvgVariant
}) {
    const filterId = useId().replace(/:/g, '')
    const [outerMaskLayer, setOuterMaskLayer] = useState<SVGGElement | null>(
        null,
    )

    const sharedBlobProps = {
        globalOrbitAngle,
        globalRadiusPhase,
        outerMaskLayer,
        fillColor: outlineStyle.fillColor,
        strokeColor: outlineStyle.innerColor,
        strokeWidth: outlineStyle.innerWidth,
    }

    return (
        <svg
            className="pointer-events-none absolute left-1/2 top-1/2 overflow-visible"
            style={{ transform: 'translate(-50%, -50%)' }}
            width={1}
            height={1}
            aria-hidden
        >
            <defs>
                <filter
                    id={filterId}
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                    colorInterpolationFilters="sRGB"
                >
                    <feMorphology
                        in="SourceAlpha"
                        operator="dilate"
                        radius={outlineStyle.outerWidth}
                        result="dilated"
                    />
                    <feComposite
                        in="dilated"
                        in2="SourceAlpha"
                        operator="xor"
                        result="outline"
                    />
                    <feFlood
                        floodColor={outlineStyle.outerColor}
                        floodOpacity={outlineStyle.outerOpacity}
                        result="color"
                    />
                    <feComposite in="color" in2="outline" operator="in" />
                </filter>
            </defs>

            <g ref={setOuterMaskLayer} filter={`url(#${filterId})`} />

            {variant === 'outlineFill' ? (
                <g
                    fill={outlineStyle.fillColor}
                    fillOpacity={outlineStyle.fillOpacity}
                >
                    {blobs.map((blob) => (
                        <OutlineCloudBlob
                            key={`fill-${blob.id}`}
                            config={blob}
                            {...sharedBlobProps}
                            layer="fill"
                        />
                    ))}
                    {tailBlobs.map((blob) => (
                        <OutlineTailBlob
                            key={`fill-${blob.id}`}
                            config={blob}
                            globalTailPhase={globalTailPhase}
                            {...sharedBlobProps}
                            layer="fill"
                        />
                    ))}
                </g>
            ) : null}

            {variant === 'outlineFill' ? (
                <g
                    fill="none"
                    stroke={outlineStyle.innerColor}
                    strokeOpacity={outlineStyle.innerOpacity}
                    strokeWidth={outlineStyle.innerWidth}
                >
                    {blobs.map((blob) => (
                        <OutlineCloudBlob
                            key={`stroke-${blob.id}`}
                            config={blob}
                            {...sharedBlobProps}
                            layer="stroke"
                        />
                    ))}
                    {tailBlobs.map((blob) => (
                        <OutlineTailBlob
                            key={`stroke-${blob.id}`}
                            config={blob}
                            globalTailPhase={globalTailPhase}
                            {...sharedBlobProps}
                            layer="stroke"
                        />
                    ))}
                </g>
            ) : null}

            {blobs.map((blob) => (
                <OutlineCloudBlob
                    key={`outer-${blob.id}`}
                    config={blob}
                    {...sharedBlobProps}
                    layer="outerMask"
                />
            ))}
            {tailBlobs.map((blob) => (
                <OutlineTailBlob
                    key={`outer-${blob.id}`}
                    config={blob}
                    globalTailPhase={globalTailPhase}
                    {...sharedBlobProps}
                    layer="outerMask"
                />
            ))}
        </svg>
    )
}
