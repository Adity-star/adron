'use client'
import { useEffect, useState, useRef, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from 'framer-motion'
import Lenis from 'lenis'
import { Button } from '../app/components/ui/button'
import { Input } from '../app/components/ui/input'
import { ArrowDown, ArrowRight, Check, Copy, Instagram, MessageCircle, Mail, Sparkles, Volume2, VolumeX, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const HeroLogo = dynamic(() => import('../app/components/HeroLogo'), { ssr: false })
import { ADWordmarkSVG } from '../app/components/HeroLogo'
import StickyJoin from '../app/components/StickyJoin'
import AudioToggle from '../app/components/AudioToggle'
import InsideAdron from '../app/components/InsideAdron'
import LiveProgress from '../app/components/LiveProgress'
import FoundersDesk from '../app/components/FoundersDesk'

// ---------- Helpers ----------
function useCountdown(target) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    if (!target) return
    const tick = () => {
      const diff = Math.max(0, new Date(target).getTime() - Date.now())
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff / 3600000) % 24)
      const m = Math.floor((diff / 60000) % 60)
      const s = Math.floor((diff / 1000) % 60)
      setT({ d, h, m, s })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])
  return t
}

function Reveal({ children, delay = 0, y = 24, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function WordsReveal({ text, className = '' }) {
  const words = text.split(' ')
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px' })
  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block mr-[0.25em]"
        >
          {w}
        </motion.span>
      ))}
    </span>
  )
}

// ---------- Scene 1: Arrival ----------
function SceneArrival() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0])
  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [0, 1, 0])

  return (
    <section ref={ref} className="relative h-[180vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 vignette pointer-events-none z-10" />
        <motion.div style={{ opacity }} className="absolute inset-0">
          <HeroLogo scrollProgress={scrollYProgress} />
        </motion.div>

        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute inset-x-0 bottom-[12vh] flex flex-col items-center text-center z-20 px-6"
        >
          <div className="text-[10px] tracking-[0.6em] uppercase text-neutral-500 mb-6">— ADRON —</div>
          <h1 className="font-serif-display text-2xl md:text-4xl text-neutral-100 font-light leading-snug max-w-xl text-balance">
            Crafted for those<br/>who value quality<br/>over trends.
          </h1>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="mt-14 text-neutral-500"
          >
            <ArrowDown className="w-4 h-4" />
          </motion.div>
          <div className="mt-3 text-[10px] tracking-[0.4em] uppercase text-neutral-600">Scroll</div>
        </motion.div>
      </div>
    </section>
  )
}

// ---------- Scene 2: Philosophy ----------
function ScenePhilosophy() {
  return (
    <section className="relative py-[28vh] px-6 md:px-12" style={{ background: 'radial-gradient(ellipse at 50% 30%, #0b0b0b 0%, #000 70%)' }}>
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-[10px] tracking-[0.6em] uppercase text-neutral-500 mb-10">Philosophy</div>
        </Reveal>
        <h2 className="font-serif-display text-4xl md:text-7xl leading-[1.1] font-light text-neutral-100 text-balance">
          <WordsReveal text="We don’t chase trends." />
          <br />
          <span className="text-neutral-400"><WordsReveal text="We create pieces worth wearing for years." /></span>
        </h2>
      </div>
    </section>
  )
}

// ---------- Scene 3: The Problem ----------
function SceneProblem() {
  const cards = [
    { k: 'Most clothing is designed', v: 'to be replaced.' },
    { k: 'We believe it should be', v: 'designed to remain.' },
  ]
  const research = [
    'Fabric mills',
    'GSM testing',
    'Collar construction',
    'Packaging',
    'Fit refinement',
  ]
  return (
    <section className="py-[20vh] px-6 md:px-12 bg-black">
      <div className="max-w-5xl mx-auto">
        <Reveal><div className="text-[10px] tracking-[0.6em] uppercase text-neutral-500 mb-12">The Problem</div></Reveal>
        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((c, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className="border border-neutral-900 rounded-sm p-10 bg-gradient-to-b from-neutral-950 to-black">
                <p className="text-neutral-500 text-sm mb-3">{c.k}</p>
                <p className="font-serif-display text-3xl md:text-4xl text-neutral-100 font-light">{c.v}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Currently researching — show the work, not the claim */}
        <div className="mt-24 grid md:grid-cols-12 gap-10 items-start">
          <Reveal className="md:col-span-5">
            <div className="text-[10px] tracking-[0.5em] uppercase text-neutral-500 mb-4">Currently researching</div>
            <h3 className="font-serif-display text-3xl md:text-4xl text-neutral-100 font-light leading-tight">
              No claims yet. <span className="text-neutral-400">Only the work.</span>
            </h3>
          </Reveal>
          <div className="md:col-span-7">
            <ul className="divide-y divide-neutral-900 border-y border-neutral-900">
              {research.map((r, i) => (
                <Reveal key={r} delay={i * 0.08}>
                  <li className="flex items-center gap-5 py-5">
                    <span className="w-5 h-5 border border-neutral-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-neutral-200" />
                    </span>
                    <span className="font-serif-display text-xl md:text-2xl text-neutral-100">{r}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={0.5}>
              <p className="text-neutral-600 text-sm mt-5 leading-relaxed">
                Each item is being decided this quarter. None are claims we make about ourselves — they are decisions we are still in the middle of.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---------- Scene 4: Vision (India) ----------
function SceneVision({ images }) {
  return (
    <section className="py-[20vh] px-6 md:px-12 bg-black">
      <div className="max-w-6xl mx-auto">
        <Reveal><div className="text-[10px] tracking-[0.6em] uppercase text-neutral-500 mb-12">The Vision</div></Reveal>
        <div className="grid md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-7">
            <h2 className="font-serif-display text-5xl md:text-7xl font-light leading-[1.05] text-balance">
              <WordsReveal text="Designed in India." />
              <br />
              <span className="text-neutral-400"><WordsReveal text="Built for the world." /></span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <Reveal delay={0.2}>
              <p className="text-neutral-400 leading-relaxed max-w-md">
                Not cliches. Not symbols. Just hands, fabric, and a quiet pursuit of precision.
                Every stitch chosen, every weave examined, every detail intentional.
              </p>
            </Reveal>
          </div>
        </div>
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {images.map((src, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="aspect-[3/4] overflow-hidden rounded-sm bg-neutral-950 group relative">
                <motion.img
                  src={src}
                  alt="craft"
                  className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000"
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------- Scene 5: The Chronicles ----------
function SceneBuildInPublic({ entries }) {
  return (
    <section className="py-[20vh] px-6 md:px-12 bg-black">
      <div className="max-w-4xl mx-auto">
        <Reveal><div className="text-[10px] tracking-[0.6em] uppercase text-neutral-500 mb-6">The Chronicles</div></Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif-display text-4xl md:text-6xl font-light leading-tight mb-6">
            We are building <span className="text-neutral-400">out loud.</span>
          </h2>
          <Link href="/journal" className="inline-flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-neutral-400 hover:text-neutral-100 transition mb-16 group">
            Read all entries <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>
        <ol className="relative border-l border-neutral-900 pl-8 space-y-10">
          {entries.map((e, i) => (
            <Reveal key={e.id || i} delay={i * 0.05}>
              <li className="relative">
                <span
                  className={`absolute -left-[37px] top-1.5 w-3 h-3 rounded-full ring-4 ring-black ${
                    e.status === 'done' ? 'bg-neutral-100' : e.status === 'in-progress' ? 'bg-amber-300 animate-pulse' : 'bg-neutral-700'
                  }`}
                />
                <div className="flex items-baseline gap-4 mb-1">
                  <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-500">Week {e.week}</span>
                  {e.status === 'in-progress' && (
                    <span className="text-[10px] tracking-[0.3em] uppercase text-amber-300">In Progress</span>
                  )}
                </div>
                <h3 className="font-serif-display text-2xl md:text-3xl text-neutral-100 mb-2">{e.title}</h3>
                {e.note && <p className="text-neutral-500 max-w-lg leading-relaxed">{e.note}</p>}
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

// ---------- Scene 6: Founders ----------
function SceneFounders({ portrait }) {
  return (
    <section className="py-[20vh] px-6 md:px-12 bg-black">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <Reveal>
          <div className="aspect-[3/4] overflow-hidden rounded-sm bg-neutral-950">
            <img src={portrait} alt="founder" className="w-full h-full object-cover grayscale" />
          </div>
        </Reveal>
        <div>
          <Reveal><div className="text-[10px] tracking-[0.6em] uppercase text-neutral-500 mb-6">Why ADRON?</div></Reveal>
          <h2 className="font-serif-display text-4xl md:text-5xl font-light leading-tight mb-10 text-balance">
            <WordsReveal text="Because we couldn’t find clothing that balanced quality, design, and longevity." />
          </h2>
          <Reveal delay={0.3}>
            <p className="text-neutral-400 leading-relaxed max-w-md">
              So we are making it ourselves. Quietly. Carefully. In public.
            </p>
            <p className="mt-6 text-neutral-500 text-sm tracking-wider">— The Founders</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ---------- Scene 7+8+9: The Craft (merged Process + Materials + Details) ----------
function SceneCraft() {
  const stages = [
    {
      img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=85&auto=format',
      tag: 'Stage 01 — Concept',
      title: 'A garment begins as geometry.',
      caption: 'No fabric. No softness. Only structure, intent, and a quiet brief.',
    },
    {
      img: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=1800&q=85&auto=format',
      tag: 'Stage 02 — Material',
      title: '240 GSM, combed, twice pre-shrunk.',
      caption: 'We chose one cotton from twelve. The one that softens but does not lose its shape.',
      specs: [
        { l: 'Weight', v: '240 GSM' },
        { l: 'Fiber', v: 'Combed Cotton' },
        { l: 'Finish', v: 'Double Pre-shrunk' },
        { l: 'Built for', v: 'Longevity' },
      ],
    },
    {
      img: 'https://images.pexels.com/photos/12362543/pexels-photo-12362543.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200',
      tag: 'Stage 03 — Construction',
      title: 'Single needle, even stitch.',
      caption: 'Slower lines. Cleaner seams. Hand-finished where the eye lingers.',
    },
    {
      img: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1800&q=85&auto=format',
      tag: 'Stage 04 — The Details',
      title: 'Labels. Buttons. Collars.',
      caption: 'Macro decisions, made in the open. Each one chosen the way one chooses a font.',
    },
  ]

  const N = stages.length
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-20% 0px -20% 0px' })
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const INTERVAL_MS = 3000

  // Auto-rotate every 3s while the section is visible and not paused
  useEffect(() => {
    if (!inView || paused) return
    const id = setInterval(() => {
      setActive((a) => (a + 1) % N)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [inView, paused, N])

  const current = stages[active]

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Image stack — only the active one is fully visible (crossfade) */}
      {stages.map((s, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{ opacity: i === active ? 1 : 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <motion.img
            src={s.img}
            alt={s.tag}
            initial={false}
            animate={{ scale: i === active ? 1 : 1.08 }}
            transition={{ duration: INTERVAL_MS / 1000 + 1, ease: 'linear' }}
            className="w-full h-full object-cover grayscale-[15%]"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 vignette pointer-events-none" />
        </motion.div>
      ))}

      {/* Top section label */}
      <div className="absolute top-[10vh] left-0 right-0 text-center z-20 px-6">
        <div className="text-[10px] tracking-[0.6em] uppercase text-neutral-500">The Craft</div>
        <div className="mt-2 font-serif-display text-2xl md:text-3xl font-light text-neutral-100">
          Built, piece by piece — in the open.
        </div>
      </div>

      {/* Caption (single, updates per active) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 bottom-[14vh] md:bottom-[16vh] z-20 px-6 md:px-16"
        >
          <div className="max-w-3xl">
            <div className="text-[10px] tracking-[0.6em] uppercase text-neutral-400 mb-3">{current.tag}</div>
            <h3 className="font-serif-display text-3xl md:text-6xl font-light leading-[1.05] text-neutral-100 text-balance mb-4">
              {current.title}
            </h3>
            <p className="text-neutral-300 max-w-xl leading-relaxed">{current.caption}</p>
            {current.specs && (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-800/40 max-w-2xl">
                {current.specs.map((sp, k) => (
                  <div key={k} className="bg-black/70 backdrop-blur p-4 md:p-5">
                    <div className="text-[9px] tracking-[0.4em] uppercase text-neutral-500 mb-1.5">{sp.l}</div>
                    <div className="font-serif-display text-xl md:text-2xl text-neutral-100">{sp.v}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress bars — click to jump, animated fill ticks down per active */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
        <div className="flex items-center gap-2">
          {stages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Show stage ${i + 1}`}
              className="group h-[2px] w-10 md:w-14 bg-neutral-700 hover:bg-neutral-500 transition relative overflow-hidden"
            >
              {i === active && (
                <motion.span
                  key={`fill-${active}-${paused}`}
                  initial={{ width: '0%' }}
                  animate={{ width: paused ? '100%' : '100%' }}
                  transition={{ duration: paused ? 0 : INTERVAL_MS / 1000, ease: 'linear' }}
                  className="absolute inset-y-0 left-0 bg-neutral-100"
                />
              )}
              {i < active && <span className="absolute inset-0 bg-neutral-400" />}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------- Scene 10: Join CTA ----------
function SceneJoin({ stats, launchDate }) {
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [submitted, setSubmitted] = useState(null)
  const [progress, setProgress] = useState({ invitedCount: 0, unlocked: false })
  const [loading, setLoading] = useState(false)
  const [origin, setOrigin] = useState('')
  const t = useCountdown(launchDate)

  // Capture referral from URL
  const [refCode, setRefCode] = useState('')
  useEffect(() => {
    setOrigin(window.location.origin)
    const params = new URLSearchParams(window.location.search)
    const r = params.get('ref') || params.get('r')
    if (r) setRefCode(r.toUpperCase())
  }, [])

  // Poll referral progress after signup
  useEffect(() => {
    if (!submitted?.referralCode) return
    let cancelled = false
    const poll = async () => {
      try {
        const res = await fetch(`/api/referral/${submitted.referralCode}`)
        if (!res.ok) return
        const d = await res.json()
        if (!cancelled) setProgress({ invitedCount: d.invitedCount || 0, unlocked: !!d.unlocked })
      } catch {}
    }
    poll()
    const id = setInterval(poll, 8000)
    return () => { cancelled = true; clearInterval(id) }
  }, [submitted?.referralCode])

  async function submit(e) {
    e?.preventDefault()
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, whatsapp, referredBy: refCode }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Something went wrong.')
      } else {
        setSubmitted(data.member)
        setProgress({ invitedCount: data.member.invitedCount || 0, unlocked: (data.member.invitedCount || 0) >= 3 })
        toast.success(data.message || 'Welcome to ADRON.')
      }
    } catch (err) {
      toast.error('Network error.')
    } finally {
      setLoading(false)
    }
  }

  function copyReferral() {
    const url = `${origin}/?ref=${submitted.referralCode}`
    navigator.clipboard.writeText(url)
    toast.success('Referral link copied.')
  }

  return (
    <section id="join" className="relative py-[20vh] px-6 md:px-12 bg-black">
      <div className="max-w-3xl mx-auto text-center">
        <Reveal><div className="text-[10px] tracking-[0.6em] uppercase text-neutral-500 mb-6">The Private List</div></Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif-display text-5xl md:text-7xl font-light leading-[1.05] mb-6 text-balance">
            Enter the world of <span className="text-neutral-400">ADRON.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-neutral-400 max-w-xl mx-auto leading-relaxed mb-10">
            A private invitation for you and your inner circle. Early access, the
            first drop, and quiet correspondence from the studio as we build.
          </p>
        </Reveal>

        {/* Countdown */}
        <Reveal delay={0.3}>
          <div className="flex justify-center gap-6 md:gap-10 mb-12">
            {[
              { l: 'Days', v: t.d },
              { l: 'Hours', v: t.h },
              { l: 'Min', v: t.m },
              { l: 'Sec', v: t.s },
            ].map((u) => (
              <div key={u.l} className="text-center">
                <div className="font-serif-display text-3xl md:text-5xl text-neutral-100 tabular-nums">{String(u.v).padStart(2, '0')}</div>
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-600 mt-1">{u.l}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              onSubmit={submit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8 }}
              className="max-w-md mx-auto space-y-3"
            >
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <Input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 pl-12 bg-neutral-950 border-neutral-900 rounded-sm text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-neutral-400"
                />
              </div>
              <div className="relative">
                <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                <Input
                  type="tel"
                  placeholder="WhatsApp number (optional)"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="h-14 pl-12 bg-neutral-950 border-neutral-900 rounded-sm text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-1 focus-visible:ring-neutral-400"
                />
              </div>
              {refCode && (
                <div className="text-[10px] tracking-[0.3em] uppercase text-amber-300/80">
                  Invited via {refCode}
                </div>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-neutral-100 hover:bg-white text-black rounded-sm tracking-[0.3em] uppercase text-xs font-medium group"
              >
                {loading ? 'Entering…' : <>Enter the World of ADRON <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" /></>}
              </Button>
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-700 pt-2">
                {stats.subscribers > 0 ? `${stats.subscribers} have already joined` : 'You could be the first.'}
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="max-w-lg mx-auto"
            >
              <div className="border border-neutral-900 rounded-sm p-10 bg-gradient-to-b from-neutral-950 to-black">
                <div className="flex justify-center mb-6">
                  <div className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center">
                    <Check className="w-5 h-5 text-neutral-100" />
                  </div>
                </div>
                <div className="text-[10px] tracking-[0.5em] uppercase text-amber-300 mb-2">
                  <Sparkles className="w-3 h-3 inline mr-2 -mt-0.5" />
                  {submitted.badge}
                </div>
                <h3 className="font-serif-display text-3xl text-neutral-100 mb-2">You are #{submitted.position}.</h3>
                <p className="text-neutral-500 mb-6 text-sm">
                  A private invitation — for you and your inner circle.
                </p>

                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex justify-between items-baseline mb-2 text-[10px] tracking-[0.4em] uppercase text-neutral-500">
                    <span>{progress.invitedCount} / 3 invited</span>
                    {progress.unlocked && <span className="text-amber-300">Inner Circle</span>}
                  </div>
                  <div className="h-1 bg-neutral-900 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${progress.unlocked ? 'bg-amber-300' : 'bg-neutral-100'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (progress.invitedCount / 3) * 100)}%` }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-black border border-neutral-900 rounded-sm p-3">
                  <span className="flex-1 text-left text-neutral-300 text-sm font-mono truncate">
                    {origin ? `${origin}/?ref=${submitted.referralCode}` : '\u00a0'}
                  </span>
                  <Button onClick={copyReferral} size="sm" variant="ghost" className="text-neutral-400 hover:text-white hover:bg-neutral-900">
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2">
                  <a target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(`Join me on ADRON — quiet, considered clothing. ${origin ? `${origin}/?ref=${submitted.referralCode}` : ''}`)}`}
                    className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 hover:text-neutral-100 border border-neutral-900 hover:border-neutral-700 transition py-2 rounded-sm text-center">
                    WhatsApp
                  </a>
                  <a target="_blank" rel="noopener noreferrer" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Witnessing the birth of @adron — `)}&url=${encodeURIComponent(origin ? `${origin}/?ref=${submitted.referralCode}` : '')}`}
                    className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 hover:text-neutral-100 border border-neutral-900 hover:border-neutral-700 transition py-2 rounded-sm text-center">
                    Twitter
                  </a>
                  <a target="_blank" rel="noopener noreferrer" href={`mailto:?subject=${encodeURIComponent('Found something worth sharing')}&body=${encodeURIComponent(`A new fashion house, quietly being built. Take a look: ${origin ? `${origin}/?ref=${submitted.referralCode}` : ''}`)}`}
                    className="text-[10px] tracking-[0.3em] uppercase text-neutral-400 hover:text-neutral-100 border border-neutral-900 hover:border-neutral-700 transition py-2 rounded-sm text-center">
                    Email
                  </a>
                </div>
                <div className="mt-6 text-[10px] tracking-[0.3em] uppercase text-neutral-600">
                  Your code — <span className="text-neutral-300">{submitted.referralCode}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

// ---------- Scene 11: Community ----------
function SceneCommunity() {
  const items = [
    { tag: 'Sampling', text: 'Week 5 — third sample arrived. Hand-feel test passed.' },
    { tag: 'Manufacturing', text: 'A quiet morning in the cutting room. Tirupur, 6:14am.' },
    { tag: 'Packaging', text: 'Considering uncoated card with embossed AD. No plastic.' },
    { tag: 'Identity', text: 'The monogram, finally.' },
  ]
  return (
    <section className="py-[20vh] px-6 md:px-12 bg-black">
      <div className="max-w-6xl mx-auto">
        <Reveal><div className="text-[10px] tracking-[0.6em] uppercase text-neutral-500 mb-6">Community</div></Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif-display text-4xl md:text-6xl font-light leading-tight mb-16">
            Follow the <span className="text-neutral-400">journey.</span>
          </h2>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="aspect-square border border-neutral-900 rounded-sm p-5 flex flex-col justify-between bg-neutral-950 hover:bg-neutral-900/60 transition">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-600">{it.tag}</div>
                <p className="font-serif-display text-lg text-neutral-200 leading-snug">{it.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.3}>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 mt-12 text-neutral-400 hover:text-neutral-100 transition group"
          >
            <Instagram className="w-4 h-4" />
            <span className="text-[11px] tracking-[0.4em] uppercase">Follow @adron</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}

// ---------- Scene 12: Ending with Purpose ----------
function SceneEnd() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center bg-black px-6 py-[16vh] overflow-hidden">
      <Reveal>
        <ADWordmarkSVG className="h-4 md:h-5 w-auto mx-auto mb-14 opacity-70" />
      </Reveal>
      <div className="max-w-3xl text-center">
        <Reveal delay={0.15}>
          <p className="font-serif-display text-3xl md:text-5xl text-neutral-100 font-light leading-[1.15] text-balance">
            This is not simply<br />
            the launch of a clothing brand.
          </p>
        </Reveal>
        <Reveal delay={0.4}>
          <p className="mt-10 font-serif-display text-3xl md:text-5xl text-neutral-400 font-light leading-[1.15] text-balance">
            You&rsquo;re witnessing the creation<br />
            of a future global fashion house.
          </p>
        </Reveal>
        <Reveal delay={0.7}>
          <div className="mt-16">
            <a
              href="#join"
              className="inline-flex items-center gap-3 text-[10px] tracking-[0.4em] uppercase text-neutral-100 border border-neutral-700 hover:border-neutral-300 hover:bg-neutral-100 hover:text-black transition px-7 py-4 rounded-sm"
            >
              Become part of Day One
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </Reveal>
      </div>
      <Reveal delay={1}>
        <div className="mt-24 text-[10px] tracking-[0.4em] uppercase text-neutral-700">© 2025 ADRON · Designed in India · Built for the world</div>
      </Reveal>
    </section>
  )
}

// ---------- Scene: Leaderboard ----------
function SceneLeaderboard() {
  const [leaders, setLeaders] = useState([])
  useEffect(() => {
    fetch('/api/leaderboard').then((r) => r.json()).then((d) => setLeaders(d.leaders || [])).catch(() => {})
  }, [])
  return (
    <section className="py-[18vh] px-6 md:px-12 bg-black">
      <div className="max-w-3xl mx-auto">
        <Reveal><div className="text-[10px] tracking-[0.6em] uppercase text-neutral-500 mb-6">Leaderboard</div></Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-serif-display text-3xl md:text-5xl font-light leading-tight mb-3">
            The early <span className="text-neutral-400">believers.</span>
          </h2>
          <p className="text-neutral-500 max-w-md mb-12 leading-relaxed">
            Those who arrived first, and brought others with them.
          </p>
        </Reveal>
        {leaders.length === 0 ? (
          <Reveal delay={0.2}>
            <div className="border border-neutral-900 rounded-sm p-8 text-center text-neutral-500 text-sm">
              The first chair is open. Invite a friend with your link to claim it.
            </div>
          </Reveal>
        ) : (
          <ol className="space-y-2">
            {leaders.map((l, i) => (
              <Reveal key={l.referralCode} delay={i * 0.04}>
                <li className="grid grid-cols-12 items-center gap-4 px-5 py-4 border border-neutral-900 bg-neutral-950/60 rounded-sm hover:bg-neutral-900/40 transition">
                  <div className="col-span-1 font-serif-display text-2xl text-neutral-500 tabular-nums">{String(i + 1).padStart(2, '0')}</div>
                  <div className="col-span-6 font-mono text-sm text-neutral-200 tracking-[0.15em]">{l.referralCode}</div>
                  <div className="col-span-3 text-[10px] tracking-[0.3em] uppercase text-neutral-500">{l.badge}</div>
                  <div className="col-span-2 text-right">
                    <span className="font-serif-display text-2xl text-neutral-100 tabular-nums">{l.invitedCount}</span>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-600 ml-1">inv</span>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}

// ---------- Ambient audio (Web Audio API drone) ----------
function useAmbientAudio() {
  const [on, setOn] = useState(false)
  const ctxRef = useRef(null)
  const nodesRef = useRef([])

  const toggle = () => {
    if (on) {
      nodesRef.current.forEach((n) => { try { n.stop?.() } catch {} })
      nodesRef.current = []
      try { ctxRef.current?.close() } catch {}
      ctxRef.current = null
      setOn(false)
    } else {
      try {
        const AC = window.AudioContext || window.webkitAudioContext
        const ctx = new AC()
        ctxRef.current = ctx
        const master = ctx.createGain()
        master.gain.value = 0
        master.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2)
        master.connect(ctx.destination)
        // soft drone: 2 oscillators + a slow LFO
        const o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = 110
        const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 138.6
        const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07
        const lfoGain = ctx.createGain(); lfoGain.gain.value = 4
        lfo.connect(lfoGain).connect(o1.frequency)
        const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 420
        o1.connect(filter); o2.connect(filter); filter.connect(master)
        o1.start(); o2.start(); lfo.start()
        nodesRef.current = [o1, o2, lfo]
        setOn(true)
      } catch (e) { console.error('audio', e) }
    }
  }

  useEffect(() => () => {
    nodesRef.current.forEach((n) => { try { n.stop?.() } catch {} })
    try { ctxRef.current?.close() } catch {}
  }, [])

  return { on, toggle }
}


function FloatingNav({ subscribers, audio }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -30, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-4 inset-x-0 z-50 flex justify-center pointer-events-none px-4"
        >
          <div className="pointer-events-auto flex items-center gap-3 md:gap-5 px-4 md:px-5 py-2.5 bg-black/70 backdrop-blur-xl border border-neutral-900 rounded-full">
            <Link href="/" aria-label="ADRON home" className="text-neutral-100">
              <ADWordmarkSVG className="h-3.5 w-auto" strokeWidth={4} />
            </Link>
            <div className="hidden md:block text-[10px] tracking-[0.3em] uppercase text-neutral-500">
              {subscribers > 0 ? `${subscribers} on the list` : 'The private list'}
            </div>
            <Link
              href="/journal"
              className="hidden sm:inline-flex items-center gap-1.5 text-[10px] tracking-[0.3em] uppercase text-neutral-400 hover:text-neutral-100 transition"
              title="The Chronicles"
            >
              <BookOpen className="w-3 h-3" /> Chronicles
            </Link>
            <a
              href="#join"
              className="text-[10px] tracking-[0.3em] uppercase text-neutral-200 hover:text-white border border-neutral-800 hover:border-neutral-600 transition px-3 py-1.5 rounded-full"
            >
              Enter
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ---------- Root App ----------
function App() {
  const [journal, setJournal] = useState([])
  const [launchDate, setLaunchDate] = useState(null)
  const [stats, setStats] = useState({ subscribers: 0, whatsapp: 0 })
  const audio = useAmbientAudio()

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true })
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  useEffect(() => {
    fetch('/api/journal').then((r) => r.json()).then((d) => {
      setJournal(d.entries || [])
      setLaunchDate(d.launchDate)
    }).catch(() => {})
    fetch('/api/stats').then((r) => r.json()).then((d) => setStats(d)).catch(() => {})
  }, [])

  const visionImages = useMemo(() => [
    'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=900&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
    'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=900&q=80',
    'https://images.pexels.com/photos/12362543/pexels-photo-12362543.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900',
  ], [])

  const founderPortrait = 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=900&q=80'

  return (
    <main className="relative grain bg-black text-neutral-100 overflow-x-hidden">
      <AudioToggle audio={audio} />
      <StickyJoin />
      <FloatingNav subscribers={stats.subscribers} audio={audio} />
      <SceneArrival />
      <ScenePhilosophy />
      <SceneProblem />
      <SceneVision images={visionImages} />
      <SceneBuildInPublic entries={journal} />
      <SceneFounders portrait={founderPortrait} />
      <SceneCraft />
      <InsideAdron />
      <FoundersDesk />
      <LiveProgress />
      <SceneJoin stats={stats} launchDate={launchDate} />
      <SceneLeaderboard />
      <SceneEnd />
    </main>
  )
}

export default App
