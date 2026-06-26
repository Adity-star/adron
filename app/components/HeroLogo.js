'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * HeroLogo — ADRON · Direction D
 *
 * Design language: editorial silence.
 *
 * Elements:
 *  1. Custom spring-damped cursor dot (2px white, trails mouse)
 *  2. Eyebrow "Est. mmxx" fades up first
 *  3. ADRON wordmark: scale 0.97 → 1.0 + opacity, cubic ease-out
 *  4. Diamond divider (─ · ─) expands from center
 *  5. Italic tagline fades up
 *  6. Scroll line with cloth-drape easing (spring overshoot → settle)
 *  7. Corner metadata marks
 *
 * Zero Framer Motion. Pure CSS animations + vanilla JS for cursor/spring.
 * @font-face: swap 'Montserrat' for your local ADRON typeface when ready.
 */

/* ─────────────────────────────────────────────
   STYLES (injected once via <style> tag)
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300&family=Montserrat:wght@200;300&display=swap');

  /* ── Reset cursor site-wide when hero mounts ── */
  .adron-hero-active,
  .adron-hero-active * {
    cursor: none !important;
  }

  /* ── Root ── */
  .ah-root {
    position: relative;
    width: 100%;
    height: 100vh;
    min-height: 600px;
    background: #000;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  /* ══════════════════════════════
     CUSTOM CURSOR DOT
  ══════════════════════════════ */
  .ah-cursor {
    position: fixed;
    top: 0; left: 0;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #fff;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    will-change: transform;
  }
  /* Outer ring — expands on hover over interactive elements */
  .ah-cursor-ring {
    position: fixed;
    top: 0; left: 0;
    width: 28px; height: 28px;
    border-radius: 50%;
    border: 0.5px solid rgba(255,255,255,0.35);
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    will-change: transform;
    transition: width 0.25s ease, height 0.25s ease, border-color 0.25s ease, opacity 0.3s ease;
  }
  .ah-cursor-ring.expand {
    width: 44px; height: 44px;
    border-color: rgba(255,255,255,0.6);
  }

  /* ══════════════════════════════
     CORNER MARKS
  ══════════════════════════════ */
  .ah-corner-tl,
  .ah-corner-tr,
  .ah-corner-bl,
  .ah-corner-br {
    position: absolute;
    font-family: 'Montserrat', sans-serif;
    font-weight: 200;
    font-size: 8px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.2);
    opacity: 0;
    animation: ah-fadeup 0.5s ease 2.1s forwards;
  }
  .ah-corner-tl { top: clamp(20px,3vh,36px); left: clamp(24px,4vw,56px); }
  .ah-corner-tr { top: clamp(20px,3vh,36px); right: clamp(24px,4vw,56px); text-align: right; }
  .ah-corner-bl { bottom: clamp(20px,3vh,36px); left: clamp(24px,4vw,56px); }
  .ah-corner-br { bottom: clamp(20px,3vh,36px); right: clamp(24px,4vw,56px); text-align: right; }

  /* ══════════════════════════════
     CENTRE STACK
  ══════════════════════════════ */
  .ah-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    /* mouse parallax applied via JS inline style */
    transition: transform 1.2s cubic-bezier(0.16,1,0.3,1);
    will-change: transform;
  }

  /* 1. Eyebrow */
  .ah-eyebrow {
    font-family: 'Montserrat', sans-serif;
    font-weight: 200;
    font-size: 9px;
    letter-spacing: 0.5em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.22);
    margin-bottom: 18px;
    padding-left: 0.5em;
    opacity: 0;
    transform: translateY(8px);
    animation: ah-fadeup 0.5s ease 0.15s forwards;
  }

  /* 2. Wordmark */
  .ah-wordmark {
    font-family: 'Montserrat', sans-serif;
    font-weight: 200;
    font-size: clamp(52px, 9.5vw, 96px);
    letter-spacing: 0.14em;
    color: #fff;
    padding-left: 0.14em;
    line-height: 1;
    opacity: 0;
    transform: scale(0.97);
    animation: ah-wordIn 1.0s cubic-bezier(0.16,1,0.3,1) 0.4s forwards;
  }
  @keyframes ah-wordIn {
    to { opacity: 1; transform: scale(1); }
  }

  /* 3. Diamond divider */
  .ah-divider {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 22px;
    opacity: 0;
    width: 260px;
    animation: ah-fadeup 0.5s ease 1.1s forwards;
  }
  .ah-divider-line {
    flex: 1;
    height: 0.5px;
    background: rgba(255,255,255,0.18);
    transform: scaleX(0);
    transform-origin: center;
    animation: ah-lineX 0.7s cubic-bezier(0.16,1,0.3,1) 1.15s forwards;
  }
  @keyframes ah-lineX { to { transform: scaleX(1); } }
  .ah-divider-dot {
    width: 3px; height: 3px;
    border-radius: 50%;
    background: rgba(255,255,255,0.35);
    flex-shrink: 0;
  }

  /* 4. Tagline */
  .ah-tagline {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    font-weight: 300;
    font-size: clamp(13px, 1.3vw, 16px);
    color: rgba(255,255,255,0.3);
    letter-spacing: 0.07em;
    margin-top: 16px;
    opacity: 0;
    transform: translateY(6px);
    animation: ah-fadeup 0.6s ease 1.5s forwards;
  }

  /* ══════════════════════════════
     SCROLL LINE — cloth-drape
     Cloth-drape = spring overshoot
     (scaleY 1.0 → 1.22 → 0.95 → 1.04 → 1.0)
  ══════════════════════════════ */
  .ah-scroll {
    position: absolute;
    bottom: clamp(24px,4vh,44px);
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 9px;
    opacity: 0;
    animation: ah-fadeup 0.5s ease 2.2s forwards;
  }
  .ah-scroll-label {
    font-family: 'Montserrat', sans-serif;
    font-weight: 200;
    font-size: 8px;
    letter-spacing: 0.45em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.22);
    padding-left: 0.45em;
  }
  .ah-scroll-line {
    width: 0.5px;
    height: 38px;
    background: rgba(255,255,255,0.25);
    transform-origin: top center;
    /* cloth-drape: drop in with overshoot then settle */
    animation: ah-drape 3.6s cubic-bezier(0.16,1,0.3,1) 2.6s infinite;
  }
  @keyframes ah-drape {
    0%   { transform: scaleY(0.0); opacity: 0; }
    18%  { transform: scaleY(1.22); opacity: 1; }
    32%  { transform: scaleY(0.88); opacity: 1; }
    46%  { transform: scaleY(1.07); opacity: 1; }
    60%  { transform: scaleY(0.97); opacity: 1; }
    75%  { transform: scaleY(1.00); opacity: 1; }
    88%  { transform: scaleY(1.00); opacity: 0.6; }
    100% { transform: scaleY(0.0);  opacity: 0; }
  }

  /* ══════════════════════════════
     SHARED KEYFRAMES
  ══════════════════════════════ */
  @keyframes ah-fadeup {
    to { opacity: 1; transform: translateY(0); }
  }

  /* ── Reduced motion ── */
  @media (prefers-reduced-motion: reduce) {
    .ah-eyebrow, .ah-wordmark, .ah-divider, .ah-divider-line,
    .ah-tagline, .ah-scroll, .ah-scroll-line,
    .ah-corner-tl, .ah-corner-tr, .ah-corner-bl, .ah-corner-br {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`

/* ─────────────────────────────────────────────
   SPRING PHYSICS for cursor dot
   Simple Euler spring: stiffness=160, damping=18
───────────────────────────────────────────── */
function makeSpring({ stiffness = 160, damping = 18, mass = 1 } = {}) {
  let x = 0, y = 0, vx = 0, vy = 0
  let tx = 0, ty = 0
  let raf = null

  function setTarget(nx, ny) { tx = nx; ty = ny }

  function tick(cb) {
    const dt = 1 / 60
    const ax = (-stiffness * (x - tx) - damping * vx) / mass
    const ay = (-stiffness * (y - ty) - damping * vy) / mass
    vx += ax * dt; vy += ay * dt
    x  += vx * dt; y  += vy * dt
    cb(x, y)
    const done = Math.abs(x - tx) < 0.01 && Math.abs(y - ty) < 0.01
                 && Math.abs(vx) < 0.01 && Math.abs(vy) < 0.01
    if (!done) raf = requestAnimationFrame(() => tick(cb))
  }

  function update(nx, ny, cb) {
    setTarget(nx, ny)
    if (raf) cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => tick(cb))
  }

  function destroy() { if (raf) cancelAnimationFrame(raf) }

  return { update, destroy, setPos(nx, ny) { x = nx; y = ny; tx = nx; ty = ny } }
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function HeroLogo({ scrollProgress }) {
  const rootRef   = useRef(null)
  const centerRef = useRef(null)
  const dotRef    = useRef(null)
  const ringRef   = useRef(null)
  const [ready, setReady] = useState(false)

  /* inject styles once */
  useEffect(() => {
    if (document.getElementById('adron-hero-styles')) { setReady(true); return }
    const tag = document.createElement('style')
    tag.id = 'adron-hero-styles'
    tag.textContent = STYLES
    document.head.appendChild(tag)
    setReady(true)
    return () => { /* leave styles in DOM — avoids flash on hot-reload */ }
  }, [])

  /* cursor + parallax */
  useEffect(() => {
    if (!ready) return
    const root   = rootRef.current
    const dot    = dotRef.current
    const ring   = ringRef.current
    const center = centerRef.current
    if (!root || !dot || !ring) return

    /* add class to kill default cursor */
    document.documentElement.classList.add('adron-hero-active')

    /* dot spring (tight) */
    const dotSpring  = makeSpring({ stiffness: 280, damping: 22 })
    /* ring spring (looser — it lags behind) */
    const ringSpring = makeSpring({ stiffness: 120, damping: 16 })

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    dotSpring.setPos(mx, my)
    ringSpring.setPos(mx, my)

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY

      dotSpring.update(mx, my, (x, y) => {
        if (dot) dot.style.transform = `translate(calc(-50% + ${x - mx + mx}px), calc(-50% + ${y - my + my}px))`
      })
      ringSpring.update(mx, my, (x, y) => {
        if (ring) ring.style.left = x + 'px'
        if (ring) ring.style.top  = y + 'px'
      })

      /* dot absolute position */
      dot.style.left = mx + 'px'
      dot.style.top  = my + 'px'

      /* very subtle parallax on center stack — ±5px */
      if (center) {
        const r = root.getBoundingClientRect()
        const nx = (e.clientX - r.left) / r.width  - 0.5
        const ny = (e.clientY - r.top)  / r.height - 0.5
        center.style.transform = `translate(${nx * 5}px, ${ny * 3.5}px)`
      }
    }

    /* ring cursor expansion on interactive elements */
    const onEnter = () => ring && ring.classList.add('expand')
    const onLeave = () => ring && ring.classList.remove('expand')
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    /* hide cursor when leaving window */
    const onOut = () => { if (dot) dot.style.opacity = '0'; if (ring) ring.style.opacity = '0' }
    const onIn  = () => { if (dot) dot.style.opacity = '1'; if (ring) ring.style.opacity = '1' }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseleave', onOut)
    document.addEventListener('mouseenter', onIn)

    return () => {
      document.documentElement.classList.remove('adron-hero-active')
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onOut)
      document.removeEventListener('mouseenter', onIn)
      dotSpring.destroy()
      ringSpring.destroy()
    }
  }, [ready])

  if (!ready) return null

  return (
    <>
      {/* ── Cursor dot + ring (portaled to top of DOM visually via fixed pos) ── */}
      <div
        ref={dotRef}
        className="ah-cursor"
        aria-hidden="true"
        style={{ left: '-100px', top: '-100px' }}
      />
      <div
        ref={ringRef}
        className="ah-cursor-ring"
        aria-hidden="true"
        style={{ left: '-100px', top: '-100px' }}
      />

      <section
        ref={rootRef}
        className="ah-root"
        aria-label="ADRON — hero"
      >
        {/* Corner marks */}
        <span className="ah-corner-tl" aria-hidden="true">Est. mmxx</span>
        <span className="ah-corner-tr" aria-hidden="true">FW 2026</span>
        <span className="ah-corner-bl" aria-hidden="true">New Delhi</span>
        <span className="ah-corner-br" aria-hidden="true">Adron.in</span>

        {/* Centre stack */}
        <div ref={centerRef} className="ah-center">

          {/* Eyebrow */}
          <p className="ah-eyebrow" aria-hidden="true">Est. mmxx</p>

          {/* Wordmark — swap font-family for your custom ADRON typeface */}
          <h1 className="ah-wordmark">ADRON</h1>

          {/* Diamond divider */}
          <div className="ah-divider" aria-hidden="true">
            <div className="ah-divider-line" />
            <div className="ah-divider-dot" />
            <div className="ah-divider-line" />
          </div>

          {/* Tagline */}
          <p className="ah-tagline">The beginning of something.</p>

        </div>

        {/* Scroll cue — cloth-drape line */}
        <div className="ah-scroll" aria-hidden="true">
          <span className="ah-scroll-label">Scroll</span>
          <div className="ah-scroll-line" />
        </div>

      </section>
    </>
  )
}

/**
 * ADWordmarkSVG — unchanged nav wordmark API contract.
 */
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