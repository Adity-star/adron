'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'

const CHAPTERS = [
  {
    n: '01',
    key: 'design',
    title: 'Design',
    status: 'In progress',
    blurb: 'Fewer pieces. Each one finalised before the next begins.',
    img: 'https://images.unsplash.com/photo-1606293926249-ed22d27ad9a8?w=1800&q=85&auto=format',
    body: `Every silhouette is drawn, redrawn, and tested against itself.
No trend boards. No reference moodboards bought from agencies. Just one
question asked of every detail: will this still feel correct ten years
from now?`,
    findings: [
      'Three core silhouettes in development',
      'Sleeve drop tested across 6 body types',
      'Collar geometry redrawn 11 times',
    ],
  },
  {
    n: '02',
    key: 'materials',
    title: 'Materials',
    status: 'Selected',
    blurb: '240 GSM combed cotton, twice pre-shrunk, single-sourced.',
    img: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=1800&q=85&auto=format',
    body: `Twelve cotton variants were ordered. Each was washed, hand-pressed,
worn, and washed again. The one we kept is the one that softens but
does not lose its line.`,
    findings: [
      'Weight — 240 GSM',
      'Fibre — Long-staple combed cotton',
      'Finish — Double pre-shrunk, enzyme washed',
      'Origin — Single mill, Tamil Nadu',
    ],
  },
  {
    n: '03',
    key: 'research',
    title: 'Research',
    status: 'Ongoing',
    blurb: 'Mills, manufacturers, hand-feel, longevity.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=85&auto=format',
    body: `We visited six fabric mills and eleven manufacturers. We took
notes on humidity, light, the smell of the dye-house, the way the
floor workers folded a cut piece. Most of the decisions are made in
rooms most brands never enter.`,
    findings: [
      'GSM testing across 12 fabrics',
      'Collar construction — 4 approaches benchmarked',
      'Wash durability — 50-cycle stress test',
      'Fit refinement — in progress',
    ],
  },
  {
    n: '04',
    key: 'sampling',
    title: 'Sampling',
    status: 'In progress',
    blurb: 'Three pass. Two fail. We start again.',
    img: 'https://images.unsplash.com/photo-1604335398980-ededc14ab8af?w=1800&q=85&auto=format',
    body: `Each sample arrives, gets worn for a week, then is dissected.
The ones that fail go back. The ones that pass go forward to the
next test. We refuse to ship a piece that has not survived an
ordinary Tuesday.`,
    findings: [
      'Round 01 — 3 of 5 passed',
      'Round 02 — awaiting return shipment',
      'Wash test — 50 cycles, 0 % shrinkage tolerated',
    ],
  },
  {
    n: '05',
    key: 'packaging',
    title: 'Packaging',
    status: 'Deciding',
    blurb: 'Uncoated card. No plastic. An invitation, not a parcel.',
    img: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=1800&q=85&auto=format',
    body: `The first thing a customer touches is the box. We’re testing two
finishes — a soft uncoated grey board with a blind-debossed AD
monogram, and a heavier black-edged card. The interior holds a
letterpressed invitation card. No filler. No plastic. No glue.`,
    findings: [
      'Material — 350 GSM uncoated board',
      'Finish — Blind deboss, no foil',
      'Insert — Letterpress invitation',
      'Sealant — Cotton ribbon, no tape',
    ],
  },
  {
    n: '06',
    key: 'manufacturing',
    title: 'Manufacturing',
    status: 'Partner found',
    blurb: 'Two facilities. Small batches. Single-needle stitching.',
    img: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1800&q=85&auto=format',
    body: `Most factories want a big order. We wanted two partners willing
to run small batches alongside their main floor, on the condition
that we visit every two weeks. We found them. They’re patient.
They ask good questions back.`,
    findings: [
      'Locations — Tirupur & Bengaluru',
      'Batch size — 80 pieces / drop',
      'Stitch — Single-needle, hand-finished hems',
      'Ethics — audited, fair-wage certified',
    ],
  },
  {
    n: '07',
    key: 'launch',
    title: 'Launch',
    status: 'Upcoming',
    blurb: 'A quiet first drop, only for the private list.',
    img: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=1800&q=85&auto=format',
    body: `The first drop will be small and limited to the private list.
No influencer launch. No paid ads. Just an email, a link, and the
first people who arrived before the brand did.`,
    findings: [
      'First drop — limited to founding list',
      'Quantity — small batch, numbered',
      'Channel — direct, no marketplaces',
      'Schedule — mid-Q3, exact date to come',
    ],
  },
]

export default function InsideAdron() {
  const [open, setOpen] = useState(null)

  return (
    <section className="py-[20vh] px-6 md:px-12 bg-black">
      <div className="max-w-5xl mx-auto">
        <div className="text-[10px] tracking-[0.6em] uppercase text-neutral-500 mb-6">Inside ADRON</div>
        <h2 className="font-serif-display text-4xl md:text-6xl font-light leading-tight mb-3 text-balance">
          Behind the <span className="text-neutral-400">work.</span>
        </h2>
        <p className="text-neutral-500 max-w-xl mb-16 leading-relaxed">
          Seven chapters. Each one is being written, in the open, while it happens.
        </p>

        <div className="divide-y divide-neutral-900 border-y border-neutral-900">
          {CHAPTERS.map((c, i) => {
            const isOpen = open === c.key
            return (
              <div key={c.key}>
                <button
                  onClick={() => setOpen(isOpen ? null : c.key)}
                  className="w-full text-left grid grid-cols-12 items-center gap-4 py-7 md:py-9 group hover:bg-neutral-950/50 transition px-2"
                  aria-expanded={isOpen}
                >
                  <div className="col-span-2 md:col-span-1 font-serif-display text-2xl md:text-3xl text-neutral-500 tabular-nums group-hover:text-neutral-200 transition">
                    {c.n}
                  </div>
                  <div className="col-span-10 md:col-span-4">
                    <div className="font-serif-display text-2xl md:text-3xl text-neutral-100 leading-none">{c.title}</div>
                  </div>
                  <div className="hidden md:block md:col-span-5 text-neutral-500 text-sm leading-relaxed">{c.blurb}</div>
                  <div className="col-span-12 md:col-span-2 flex items-center justify-between md:justify-end gap-3">
                    <span className={`text-[10px] tracking-[0.3em] uppercase ${
                      c.status === 'In progress' ? 'text-amber-300' :
                      c.status === 'Upcoming' ? 'text-neutral-600' :
                      'text-neutral-400'
                    }`}>{c.status}</span>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="text-neutral-500">
                      <Plus className="w-4 h-4" />
                    </motion.span>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid md:grid-cols-12 gap-8 md:gap-12 px-2 pb-12 pt-2">
                        <div className="md:col-span-6">
                          <motion.div
                            initial={{ scale: 1.06, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            className="aspect-[4/5] overflow-hidden rounded-sm bg-neutral-950"
                          >
                            <img src={c.img} alt={c.title} className="w-full h-full object-cover grayscale-[15%]" />
                          </motion.div>
                        </div>
                        <div className="md:col-span-6">
                          <p className="font-serif-display text-xl md:text-2xl text-neutral-100 leading-relaxed mb-8 whitespace-pre-line">
                            {c.body}
                          </p>
                          <div className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 mb-3">Findings</div>
                          <ul className="space-y-2.5">
                            {c.findings.map((f, j) => (
                              <motion.li
                                key={j}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + j * 0.06, duration: 0.6 }}
                                className="text-neutral-400 text-sm flex items-start gap-3"
                              >
                                <span className="text-neutral-600 mt-1.5 w-3 h-px bg-neutral-700 inline-block flex-shrink-0" />
                                <span>{f}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
