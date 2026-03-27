"use client"

import React, { useRef } from 'react'
import { useScroll, useTransform, motion, type MotionValue } from 'framer-motion'

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode
  children: React.ReactNode
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
  })
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  const scaleDimensions = () => {
    return isMobile ? [0.84, 0.96] : [1.05, 1]
  }

  const rotate = useTransform(scrollYProgress, [0, 0.55], [42, 0])
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions())
  const translate = useTransform(scrollYProgress, [0, 1], [0, -52])

  return (
    <div
      className="relative flex h-[72rem] items-center justify-center p-0 md:h-[64rem] md:p-4"
      ref={containerRef}
    >
      <div
        className="relative w-full py-3 md:py-8"
        style={{
          perspective: '1000px',
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  )
}

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>
  titleComponent: string | React.ReactNode
}) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="mx-auto max-w-5xl text-center"
    >
      {titleComponent}
    </motion.div>
  )
}

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>
  scale: MotionValue<number>
  translate: MotionValue<number>
  children: React.ReactNode
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          '0 8px 28px rgba(0, 0, 0, 0.08), 0 24px 52px rgba(0, 0, 0, 0.06)',
      }}
      className="mx-auto -mt-6 h-[48rem] w-full max-w-5xl rounded-[30px] border-2 border-black/10 bg-[#f8f5f0] p-2 shadow-2xl md:h-[30rem] md:p-4"
    >
      <div className="h-full w-full overflow-hidden rounded-2xl border border-black/10 bg-white md:rounded-2xl md:p-2">
        {children}
      </div>
    </motion.div>
  )
}
