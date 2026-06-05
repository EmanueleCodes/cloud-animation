import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

/**
 * Returns true when the observed element intersects the viewport.
 * Used by the cloud animation to pause Motion loops when off-screen.
 */
export function useIsVisible<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T | null>,
    options?: IntersectionObserverInit,
): boolean {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting)
            },
            {
                threshold: 0,
                rootMargin: '100px',
                ...options,
            },
        )

        observer.observe(element)
        return () => observer.disconnect()
    }, [ref, options])

    return isVisible
}
