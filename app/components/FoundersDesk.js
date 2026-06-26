'use client'
import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

function getEmbedInfo(url) {
  if (!url) return null
  try {
    const u = new URL(url)
    // YouTube
    if (u.hostname.includes('youtube.com') || u.hostname.includes('youtu.be')) {
      let id = ''
      if (u.hostname.includes('youtu.be')) id = u.pathname.slice(1)
      else id = u.searchParams.get('v') || u.pathname.split('/').pop()
      return { kind: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}?rel=0` }
    }
    // Vimeo
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop()
      return { kind: 'vimeo', src: `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0` }
    }
    // Direct mp4/webm
    if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(u.pathname)) {
      return { kind: 'video', src: url }
    }
    return { kind: 'video', src: url }
  } catch {
    return null
  }
}

export default function FoundersDesk() {
  const [entries, setEntries] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/founder-desk').then((r) => r.json()).then((d) => {
      const list = d.entries || []
      setEntries(list)
      if (list[0]) setActiveId(list[0].id)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const active = entries.find((e) => e.id === activeId) || entries[0]
  const embed = active ? getEmbedInfo(active.url) : null

  return (
    <section className="py-[18vh] px-6 md:px-12 bg-black">
      <div className="max-w-5xl mx-auto">
        <div className="text-[10px] tracking-[0.6em] uppercase text-neutral-500 mb-6">The Founder’s Desk</div>
        <h2 className="font-serif-display text-3xl md:text-5xl font-light leading-tight mb-3 text-balance">
          A short note. <span className="text-neutral-400">Each week.</span>
        </h2>
        <p className="text-neutral-500 max-w-xl mb-12 leading-relaxed">
          One honest video. Rejecting samples. Refining the fit. Travelling to manufacturers.
          The decisions, made in the open.
        </p>

        {loading ? (
          <div className="aspect-video bg-neutral-950 border border-neutral-900 rounded-sm animate-pulse" />
        ) : !active ? (
          <div className="aspect-video bg-neutral-950 border border-neutral-900 rounded-sm flex flex-col items-center justify-center text-center px-6">
            <div className="w-12 h-12 rounded-full border border-neutral-700 flex items-center justify-center mb-4">
              <Play className="w-4 h-4 text-neutral-300" />
            </div>
            <div className="text-neutral-300 font-serif-display text-2xl mb-1">The first entry is being filmed this week.</div>
            <div className="text-neutral-600 text-sm">A short, honest note from the founder. Coming soon.</div>
          </div>
        ) : (
          <>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-video w-full bg-black border border-neutral-900 rounded-sm overflow-hidden"
            >
              {embed?.kind === 'youtube' || embed?.kind === 'vimeo' ? (
                <iframe
                  src={embed.src}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={active.title}
                />
              ) : (
                <video
                  controls
                  poster={active.posterUrl || undefined}
                  className="absolute inset-0 w-full h-full object-cover"
                  preload="metadata"
                >
                  <source src={embed?.src} />
                </video>
              )}
            </motion.div>
            <div className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-500">Week {active.week}</div>
              <div className="font-serif-display text-2xl text-neutral-100">{active.title}</div>
              {active.publishedAt && (
                <div className="text-[10px] tracking-[0.3em] uppercase text-neutral-700 ml-auto">{new Date(active.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</div>
              )}
            </div>
            {active.note && <p className="text-neutral-400 mt-3 max-w-2xl leading-relaxed">{active.note}</p>}

            {/* Archive */}
            {entries.length > 1 && (
              <div className="mt-16">
                <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 mb-5">Archive</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {entries.map((e) => (
                    <button
                      key={e.id}
                      onClick={() => setActiveId(e.id)}
                      className={`text-left aspect-video bg-neutral-950 border rounded-sm p-4 flex flex-col justify-between transition ${
                        e.id === active.id ? 'border-neutral-500' : 'border-neutral-900 hover:border-neutral-700'
                      }`}
                    >
                      <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-600">Week {e.week}</div>
                      <div className="font-serif-display text-base text-neutral-200 leading-snug">{e.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
