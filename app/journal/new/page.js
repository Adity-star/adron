'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/text-area'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

export default function NewJournalPage() {
  const [adminKey, setAdminKey] = useState('')
  const [week, setWeek] = useState(6)
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('in-progress')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')
  const [broadcast, setBroadcast] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Key': adminKey },
        body: JSON.stringify({ week, title, status, date, note, broadcast }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed.')
      } else {
        toast.success(`Saved Week ${data.entry.week}.${broadcast ? ' Broadcasting…' : ''}`)
        setTitle(''); setNote('')
      }
    } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen bg-black text-neutral-100 px-6 py-20">
      <div className="max-w-xl mx-auto">
        <Link href="/journal" className="inline-flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-neutral-500 hover:text-neutral-100 transition mb-12">
          <ArrowLeft className="w-3 h-3" /> Journal
        </Link>

        <div className="text-[10px] tracking-[0.6em] uppercase text-neutral-500 mb-6">Admin</div>
        <h1 className="font-serif-display text-4xl font-light mb-10">New Journal Entry</h1>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-2">Admin Key</label>
            <Input type="password" required value={adminKey} onChange={(e) => setAdminKey(e.target.value)}
              className="bg-neutral-950 border-neutral-900 rounded-sm h-12 text-neutral-100" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-2">Week</label>
              <Input type="number" required value={week} onChange={(e) => setWeek(Number(e.target.value))}
                className="bg-neutral-950 border-neutral-900 rounded-sm h-12 text-neutral-100" />
            </div>
            <div>
              <label className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-2">Date</label>
              <Input type="date" required value={date} onChange={(e) => setDate(e.target.value)}
                className="bg-neutral-950 border-neutral-900 rounded-sm h-12 text-neutral-100" />
            </div>
          </div>
          <div>
            <label className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-2">Title</label>
            <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Fit Testing"
              className="bg-neutral-950 border-neutral-900 rounded-sm h-12 text-neutral-100" />
          </div>
          <div>
            <label className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-2">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-900 rounded-sm h-12 text-neutral-100 px-3">
              <option value="upcoming">Upcoming</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] tracking-[0.4em] uppercase text-neutral-500 block mb-2">Note</label>
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={6}
              placeholder="What happened this week. Honest, short, specific."
              className="bg-neutral-950 border-neutral-900 rounded-sm text-neutral-100" />
          </div>
          <label className="flex items-center gap-3 text-sm text-neutral-300">
            <input type="checkbox" checked={broadcast} onChange={(e) => setBroadcast(e.target.checked)} />
            Broadcast to all subscribers
          </label>
          <Button type="submit" disabled={loading}
            className="w-full h-12 bg-neutral-100 hover:bg-white text-black rounded-sm tracking-[0.3em] uppercase text-xs">
            {loading ? 'Saving…' : 'Publish'}
          </Button>
        </form>
      </div>
    </main>
  )
}
