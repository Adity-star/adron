'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function StickyJoin() {
  const [visible, setVisible] = useState(false)
  const [hide, setHide] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const vh = window.innerHeight
      // Appears after Scene 1 (~ start of Scene 2). Disappears when user is inside the Join section.
      const join = document.getElementById('join')
      const joinTop = join ? join.getBoundingClientRect().top + window.scrollY : Infinity
      const joinBottom = join ? joinTop + join.offsetHeight : Infinity
      setVisible(y > vh * 1.4)
      setHide(y + vh * 0.85 > joinTop && y < joinBottom + vh * 0.2)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && !hide && (
        <motion.a
          href="#join"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-40 bottom-5 right-5 md:bottom-8 md:right-8 group flex items-center gap-2.5 text-[10px] tracking-[0.4em] uppercase text-neutral-400 hover:text-neutral-100 transition"
          aria-label="Join the list"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-200 opacity-40" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-neutral-100" />
          </span>
          <span className="hidden sm:inline">Join the List</span>
          <span className="sm:hidden">Join</span>
        </motion.a>
      )}
    </AnimatePresence>
  )
}
