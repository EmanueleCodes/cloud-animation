import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Returns true when the element is visible in the viewport.
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
