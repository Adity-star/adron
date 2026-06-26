'use client'
import { motion, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'

/**
 * HeroLogo — uses the EXACT AD monogram, choreographed as a slow cinematic arrival.
 *
 * Easing: cubic-bezier(0.16, 1, 0.3, 1)  — equivalent to Power4.easeOut.
 *
 * Timeline (parent SceneArrival manages tagline + scroll indicator; this
 * component handles t=0.0 ambient + t=0.5 logo reveal):
 *
 *   0.0s  Ambient radial light begins a slow 2s opacity fade in (behind logo).
 *   0.5s  Logo emerges:  opacity 0 → 1,  scale 0.95 → 1.0,  blur 8px → 0.
 *         Duration 2.0s, ease Power4.easeOut.
 *   2.5s+ Idle: the ambient light breathes (10s loop). A microscopic metallic
 *         shimmer drifts across the mark every ~12s. Mouse parallax follows.
 *
 * Removed:  the horizontal torch-sweep parallelogram (it revealed its own edges).
 * Replaced by: a soft radial gradient that scales 1.0 ↔ 1.06 with opacity
 *   0.92 ↔ 1.0 on a 10s loop — imperceptible, like real studio lighting on
 *   a physical metallic surface.
 */

const POWER4 = [0.16, 1, 0.3, 1]

export default function HeroLogo({ scrollProgress }) {
  const wrapRef = useRef(null)

  // Mouse parallax (sub-pixel, spring-damped)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 40, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 40, damping: 18 })

  useEffect(() => {
    const handler = (e) => {
      if (!wrapRef.current) return
      const r = wrapRef.current.getBoundingClientRect()
      mx.set((e.clientX - r.left) / r.width - 0.5)
      my.set((e.clientY - r.top) / r.height - 0.5)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [mx, my])

  // Tie scroll progress to scale + opacity if provided
  const scrollScale = scrollProgress ? useTransform(scrollProgress, [0, 1], [1, 0.7]) : 1
  const scrollOpacity = scrollProgress ? useTransform(scrollProgress, [0, 0.5, 1], [1, 1, 0]) : 1

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-full flex items-center justify-center select-none"
      style={{ perspective: 1400 }}
    >
      {/* ---------- t = 0.0s : Ambient radial light ---------- */}
      {/* Soft warm halo, breathes 10s loop, imperceptible */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: '74vmin', height: '74vmin',
          background:
            'radial-gradient(circle at center, rgba(255,243,215,0.42) 0%, rgba(255,237,200,0.16) 25%, rgba(120,100,70,0.04) 55%, transparent 75%)',
          filter: 'blur(24px)',
          willChange: 'transform, opacity',
        }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{
          opacity: [0, 1, 0.94, 1, 0.94, 1],
          scale: [0.92, 1, 1.05, 1, 1.05, 1],
        }}
        transition={{
          opacity: { duration: 2, ease: POWER4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
          scale:   { duration: 14, ease: 'easeInOut', times: [0, 0.07, 0.32, 0.57, 0.82, 1], repeat: Infinity, repeatType: 'loop' },
        }}
      />

      {/* A second, tighter inner highlight that just barely breathes */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: '38vmin', height: '38vmin',
          background:
            'radial-gradient(circle at center, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 45%, transparent 75%)',
          filter: 'blur(40px)',
        }}
        initial={{ opacity: 0, scale: 1.0 }}
        animate={{ opacity: [0, 0.85, 0.7, 0.85, 0.7, 0.85], scale: [1.0, 1.0, 1.06, 1.0, 1.06, 1.0] }}
        transition={{
          opacity: { duration: 2.2, ease: POWER4, delay: 0.2, times: [0, 0.18, 0.4, 0.62, 0.8, 1] },
          scale:   { duration: 11, ease: 'easeInOut', delay: 1.5, times: [0, 0.1, 0.35, 0.55, 0.78, 1], repeat: Infinity, repeatType: 'loop' },
        }}
      />

      {/* ---------- t = 0.5s : Logo reveal ---------- */}
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d', scale: scrollScale, opacity: scrollOpacity }}
        className="relative will-change-transform"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.5, duration: 2.0, ease: POWER4 }}
          className="relative w-[58vmin] h-[58vmin] max-w-[640px] max-h-[640px] min-w-[260px] min-h-[260px]"
        >
          <LogoImage />

          {/* Very slow, subtle metallic shimmer (idle, every ~12s) */}
          <motion.div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(115deg, transparent 38%, rgba(255,243,215,0.25) 48%, rgba(255,255,255,0.55) 50%, rgba(255,243,215,0.25) 52%, transparent 62%)',
              mixBlendMode: 'overlay',
            }}
            initial={{ x: '-50%', opacity: 0 }}
            animate={{ x: ['-50%', '50%'], opacity: [0, 0.7, 0] }}
            transition={{
              delay: 3.5,
              duration: 4.5,
              ease: POWER4,
              repeat: Infinity,
              repeatDelay: 7.5,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

function LogoImage() {
  return (
    <img
      src="/adron-mono.png"
      alt="ADRON"
      draggable={false}
      className="w-full h-full object-contain"
      style={{ filter: 'invert(1)', mixBlendMode: 'screen', userSelect: 'none' }}
    />
  )
}

// Wordmark used in the floating navigation — the actual artwork
export function ADWordmarkSVG({ className = '' }) {
  return (
    <img
      src="/adron-wordmark.png"
      alt="ADRON"
      draggable={false}
      className={className}
      style={{ filter: 'invert(1)', mixBlendMode: 'screen', objectFit: 'contain' }}
    />
  )
}
