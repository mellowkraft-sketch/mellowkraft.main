import { useEffect } from 'react'

export function useScrollAnimations() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobileViewport = window.matchMedia('(max-width: 960px)').matches
    const lowCpuDevice = typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4
    const reducedData = navigator.connection?.saveData === true

    if (reducedMotion || mobileViewport || lowCpuDevice || reducedData) {
      return undefined
    }

    let ScrollTrigger

    const initAnimations = async () => {
      const gsapModule = await import('gsap')
      const scrollTriggerModule = await import('gsap/ScrollTrigger')

      const gsap = gsapModule.default
      ScrollTrigger = scrollTriggerModule.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      const processCards = gsap.utils.toArray('.process-card')
      processCards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0.35 },
          {
            y: 0,
            opacity: 1,
            delay: index * 0.03,
            scrollTrigger: {
              trigger: card,
              start: 'top 86%',
              end: 'top 55%',
              scrub: true,
            },
          },
        )
      })
    }

    initAnimations().catch(() => {})

    return () => {
      if (ScrollTrigger) {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    }
  }, [])
}
