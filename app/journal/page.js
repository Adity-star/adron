'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Rss } from 'lucide-react'

export default function JournalPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/journal').then((r) => r.json()).then((d) => {
      setEntries(d.entries || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-black text-neutral-100 px-6 md:px-12 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-neutral-500 hover:text-neutral-100 transition">
            <ArrowLeft className="w-3 h-3" /> Home
          </Link>
          <a href="/api/journal/rss" className="inline-flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-neutral-500 hover:text-neutral-100 transition">
            <Rss className="w-3 h-3" /> RSS
          </a>
        </div>

        <div className="text-[10px] tracking-[0.6em] uppercase text-neutral-500 mb-6">The Chronicles</div>
        <h1 className="font-serif-display text-5xl md:text-7xl font-light leading-tight mb-6">
          A journal, written in the open.
        </h1>
        <p className="text-neutral-400 max-w-xl leading-relaxed mb-20">
          Most brands appear only when they have products to sell. We are choosing to appear before that —
          one honest entry each week.
        </p>

        {loading && <div className="text-neutral-600 text-sm">Loading…</div>}

        <ol className="relative border-l border-neutral-900 pl-8 space-y-16">
          {entries.map((e, i) => (
            <motion.li
              key={e.id}
              id={`week-${e.week}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <span
                className={`absolute -left-[37px] top-2 w-3 h-3 rounded-full ring-4 ring-black ${
                  e.status === 'done' ? 'bg-neutral-100' :
                  e.status === 'in-progress' ? 'bg-amber-300 animate-pulse' :
                  'bg-neutral-700'
                }`}
              />
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-[10px] tracking-[0.4em] uppercase text-neutral-500">Week {e.week}</span>
                <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-700">{e.date}</span>
                {e.status === 'in-progress' && (
                  <span className="text-[10px] tracking-[0.3em] uppercase text-amber-300">In Progress</span>
                )}
              </div>
              <h3 className="font-serif-display text-3xl md:text-4xl text-neutral-100 mb-3">{e.title}</h3>
              {e.note && <p className="text-neutral-400 leading-relaxed max-w-xl">{e.note}</p>}
            </motion.li>
          ))}
        </ol>

        <div className="mt-32 pt-12 border-t border-neutral-900 text-center">
          <Link href="/#join" className="inline-block text-[10px] tracking-[0.4em] uppercase text-neutral-400 hover:text-neutral-100 border border-neutral-800 hover:border-neutral-600 px-6 py-3 rounded-sm transition">
            Enter the World of ADRON
          </Link>
        </div>
      </div>
    </main>
  )
}
