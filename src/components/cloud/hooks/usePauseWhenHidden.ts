import { useRef } from 'react'
import { useIsVisible } from '@/hooks/useIsVisible'

/**
 * Tracks viewport visibility and pauses animation drivers when the cloud
 * scrolls off-screen — avoids burning CPU on invisible Motion loops.
 */
export function usePauseWhenHidden() {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const isVisible = useIsVisible(containerRef)

    return {
        containerRef,
        paused: !isVisible,
    }
}
