'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/text-area'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

export default function FounderAdminPage() {
  const [adminKey, setAdminKey] = useState('')
  const [week, setWeek] = useState(1)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [posterUrl, setPosterUrl] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/founder-desk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey },
        body: JSON.stringify({ week, title, url, posterUrl, note }),
      })
      const data = await res.json()
      if (!res.ok) toast.error(data.error || 'Failed.')
      else { toast.success(`Saved Week ${data.entry.week}.`); setTitle(''); setUrl(''); setPosterUrl(''); setNote('') }
    } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-black text-neutral-100 px-6 py-20">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-neutral-500 hover:text-neutral-100 transition mb-12">
          <ArrowLeft className="w-3 h-3" /> Home
        </Link>
        <div className="text-[10px] tracking-[0.6em] uppercase text-neutral-500 mb-6">Admin</div>
        <h1 className="font-serif-display text-4xl font-light mb-10">Founder’s Desk — New Entry</h1>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-2">Admin Key</label>
            <Input type="password" required value={adminKey} onChange={(e) => setAdminKey(e.target.value)}
              className="bg-neutral-950 border-neutral-900 rounded-sm h-12 text-neutral-100" />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-2">Week</label>
            <Input type="number" required value={week} onChange={(e) => setWeek(Number(e.target.value))}
              className="bg-neutral-950 border-neutral-900 rounded-sm h-12 text-neutral-100" />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-2">Title</label>
            <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Rejecting the third sample"
              className="bg-neutral-950 border-neutral-900 rounded-sm h-12 text-neutral-100" />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-2">Video URL (YouTube / Vimeo / MP4)</label>
            <Input required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtu.be/..."
              className="bg-neutral-950 border-neutral-900 rounded-sm h-12 text-neutral-100" />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-2">Poster Image URL (optional)</label>
            <Input value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} placeholder="https://..."
              className="bg-neutral-950 border-neutral-900 rounded-sm h-12 text-neutral-100" />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-2">Note</label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={5}
              placeholder="Short caption for the entry."
              className="bg-neutral-950 border-neutral-900 rounded-sm text-neutral-100" />
          </div>
          <Button type="submit" disabled={loading}
            className="w-full h-12 bg-neutral-100 hover:bg-white text-black rounded-sm tracking-[0.3em] uppercase text-xs">
            {loading ? 'Saving…' : 'Publish'}
          </Button>
        </form>
      </div>
    </main>
  )
}
