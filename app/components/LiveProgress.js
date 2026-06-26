'use client'
import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

function useAnimatedNumber(target, inView, duration = 1800) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - p, 3)
      setN(Math.round(eased * (target || 0)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => raf && cancelAnimationFrame(raf)
  }, [target, inView, duration])
  return n
}

function Stat({ value, label, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const n = useAnimatedNumber(value, inView)
  return (
    <div ref={ref} className="text-center md:text-left">
      <div className="font-serif-display text-5xl md:text-7xl font-light text-neutral-100 tabular-nums leading-none">
        {n}{suffix}
      </div>
      <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 mt-3">{label}</div>
    </div>
  )
}

export default function LiveProgress() {
  const [stats, setStats] = useState({ subscribers: 0, whatsapp: 0, launchDate: null })
  const [daysToLaunch, setDaysToLaunch] = useState(0)

  useEffect(() => {
    fetch('/api/stats').then((r) => r.json()).then((d) => {
      setStats(d)
      if (d.launchDate) {
        const diff = new Date(d.launchDate).getTime() - Date.now()
        setDaysToLaunch(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))))
      }
    }).catch(() => {})
  }, [])

  return (
    <section className="py-[18vh] px-6 md:px-12 bg-black">
      <div className="max-w-5xl mx-auto">
        <div className="text-[10px] tracking-[0.6em] uppercase text-neutral-500 mb-6">Current Progress</div>
        <h2 className="font-serif-display text-3xl md:text-5xl font-light leading-tight mb-16 text-balance">
          A brand, <span className="text-neutral-400">in real numbers.</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          <Stat value={stats.subscribers} label="On the Private List" />
          <Stat value={12} label="Fabrics Tested" />
          <Stat value={3} label="Samples Passed" />
          <Stat value={daysToLaunch} label="Days to First Drop" />
        </div>
        <p className="mt-16 text-neutral-500 text-sm max-w-xl leading-relaxed">
          These numbers update as we build. Refresh tomorrow — some of them will
          have moved. That is the point.
        </p>
      </div>
    </section>
  )
}
