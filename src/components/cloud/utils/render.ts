import type { CloudParams, OutlineStyle, RenderMode } from '../types'

export function getBlobSurfaceStyle(fillColor: string) {
    return {
        backgroundColor: fillColor,
        border: 'none',
    }
}

export function isSvgOutlineMode(mode: RenderMode) {
    return mode === 'outline' || mode === 'outlineFill'
}

/** Keeps stroke widths visually consistent when the stage is scaled down. */
export function scaleOutlineForDisplay(
    outlineStyle: OutlineStyle,
    displayScale: number,
): OutlineStyle {
    if (displayScale === 1) {
        return outlineStyle
    }

    const strokeScale = 1 / displayScale
    return {
        ...outlineStyle,
        innerWidth: outlineStyle.innerWidth * strokeScale,
        outerWidth: outlineStyle.outerWidth * strokeScale,
    }
}

export function resolveFillColor(params: CloudParams) {
    return isSvgOutlineMode(params.renderMode)
        ? params.outline.fillColor
        : params.color
}
