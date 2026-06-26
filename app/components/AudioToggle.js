'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

export default function AudioToggle({ audio }) {
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 6000)
    return () => clearTimeout(t)
  }, [])

  if (!audio) return null

  return (
    <motion.button
      onClick={() => { audio.toggle(); setShowHint(false) }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.4, duration: 1.4 }}
      className="fixed z-40 top-5 right-5 md:top-7 md:right-7 group flex items-center gap-3 text-neutral-500 hover:text-neutral-100 transition"
      aria-label={audio.on ? 'Mute ambient sound' : 'Tap to immerse'}
    >
      <AnimatePresence>
        {showHint && !audio.on && (
          <motion.span
            key="hint"
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            transition={{ duration: 1.2 }}
            className="text-[10px] tracking-[0.4em] uppercase whitespace-nowrap"
          >
            Tap to immerse
          </motion.span>
        )}
      </AnimatePresence>
      <span className="relative w-7 h-7 rounded-full border border-neutral-800 group-hover:border-neutral-500 flex items-center justify-center transition">
        {audio.on ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
        {!audio.on && (
          <span className="absolute inset-0 rounded-full border border-neutral-600 animate-ping opacity-30" />
        )}
      </span>
    </motion.button>
  )
}
