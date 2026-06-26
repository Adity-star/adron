import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { sendWelcomeEmail, sendJournalEmail } from '../../lib/email'

const MONGO_URL = process.env.MONGO_URL
const DB_NAME = process.env.DB_NAME || 'adron'
const ADMIN_KEY = process.env.ADMIN_KEY || 'adron-admin-2025'

let cachedClient = null
async function getDb() {
  if (!cachedClient) {
    cachedClient = new MongoClient(MONGO_URL)
    await cachedClient.connect()
  }
  return cachedClient.db(DB_NAME)
}

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Key',
}

function makeReferralCode() {
  return 'AD' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

// Launch date — 74 days from server start
const LAUNCH_DATE = new Date(Date.now() + 74 * 24 * 60 * 60 * 1000).toISOString()

const DEFAULT_JOURNAL = [
  { week: 1, title: 'Brand Created', status: 'done', date: '2025-04-07', note: 'The first sketches of ADRON. A name chosen for permanence — not for the season.' },
  { week: 2, title: 'Identity', status: 'done', date: '2025-04-14', note: 'The AD monogram took 47 iterations. We kept the one that felt the quietest.' },
  { week: 3, title: 'Fabric Research', status: 'done', date: '2025-04-21', note: 'Sourced 12 cotton variants. Settled on 240 GSM combed cotton, double pre-shrunk.' },
  { week: 4, title: 'Manufacturer Visits', status: 'done', date: '2025-04-28', note: 'Visited 6 facilities in Tirupur and Bengaluru. Found two we trust.' },
  { week: 5, title: 'Sampling', status: 'in-progress', date: '2025-05-05', note: 'First samples in. Three pass the wash test. Two do not. We start again.' },
  { week: 6, title: 'Fit Testing', status: 'upcoming', date: '2025-05-12', note: '' },
  { week: 7, title: 'Packaging', status: 'upcoming', date: '2025-05-19', note: '' },
  { week: 8, title: 'Production', status: 'upcoming', date: '2025-05-26', note: '' },
  { week: 9, title: 'Launch', status: 'upcoming', date: '2025-09-01', note: '' },
]

async function ensureJournal(db) {
  const count = await db.collection('journal').countDocuments()
  if (count === 0) {
    await db.collection('journal').insertMany(
      DEFAULT_JOURNAL.map((e) => ({ id: uuidv4(), ...e, createdAt: new Date().toISOString() }))
    )
  }
}

function escapeXml(s = '') {
  return String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]))
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: cors })
}

export async function GET(request, { params }) {
  try {
    const db = await getDb()
    const p = (await params).path || []
    const route = p.join('/')
    const { searchParams } = new URL(request.url)

    if (route === '' || route === 'health') {
      return NextResponse.json({ ok: true, service: 'adron-api' }, { headers: cors })
    }

    if (route === 'journal') {
      await ensureJournal(db)
      const entries = await db.collection('journal').find({}, { projection: { _id: 0 } }).sort({ week: 1 }).toArray()
      return NextResponse.json({ entries, launchDate: LAUNCH_DATE }, { headers: cors })
    }

    if (route === 'journal/rss') {
      await ensureJournal(db)
      const entries = await db.collection('journal').find({ status: { $ne: 'upcoming' } }, { projection: { _id: 0 } }).sort({ week: -1 }).toArray()
      const base = process.env.NEXT_PUBLIC_BASE_URL || ''
      const items = entries.map((e) => `
        <item>
          <title>Week ${e.week} — ${escapeXml(e.title)}</title>
          <link>${base}/journal#week-${e.week}</link>
          <guid isPermaLink="false">${e.id}</guid>
          <pubDate>${new Date(e.createdAt || e.date).toUTCString()}</pubDate>
          <description>${escapeXml(e.note)}</description>
        </item>`).join('')
      const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0"><channel>
<title>The Chronicles — ADRON</title>
<link>${base}/journal</link>
<description>Weekly entries from the birth of ADRON.</description>
${items}
</channel></rss>`
      return new NextResponse(xml, { headers: { ...cors, 'Content-Type': 'application/rss+xml; charset=utf-8' } })
    }

    if (route === 'stats') {
      const subscribers = await db.collection('waitlist').countDocuments()
      const whatsapp = await db.collection('waitlist').countDocuments({ whatsapp: { $exists: true, $ne: '' } })
      return NextResponse.json({ subscribers, whatsapp, launchDate: LAUNCH_DATE }, { headers: cors })
    }

    if (route === 'leaderboard') {
      const top = await db.collection('waitlist')
        .find({ invitedCount: { $gt: 0 } }, { projection: { _id: 0, referralCode: 1, invitedCount: 1, position: 1, badge: 1 } })
        .sort({ invitedCount: -1, position: 1 })
        .limit(10)
        .toArray()
      return NextResponse.json({ leaders: top }, { headers: cors })
    }

    if (route === 'founder-desk') {
      const entries = await db.collection('founder_desk')
        .find({}, { projection: { _id: 0 } })
        .sort({ week: -1, createdAt: -1 })
        .toArray()
      return NextResponse.json({ entries }, { headers: cors })
    }

    if (route.startsWith('referral/')) {
      const code = route.split('/')[1]
      const member = await db.collection('waitlist').findOne({ referralCode: code }, { projection: { _id: 0, email: 0, whatsapp: 0 } })
      if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: cors })
      const invitedCount = member.invitedCount || await db.collection('waitlist').countDocuments({ referredBy: code })
      const unlocked = invitedCount >= 3
      return NextResponse.json({ ...member, invitedCount, unlocked, target: 3 }, { headers: cors })
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: cors })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: cors })
  }
}

export async function POST(request, { params }) {
  try {
    const db = await getDb()
    const p = (await params).path || []
    const route = p.join('/')
    const body = await request.json().catch(() => ({}))

    if (route === 'waitlist') {
      const email = (body.email || '').trim().toLowerCase()
      const whatsapp = (body.whatsapp || '').trim()
      const referredBy = (body.referredBy || '').trim().toUpperCase() || null

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: 'Please provide a valid email.' }, { status: 400, headers: cors })
      }

      const existing = await db.collection('waitlist').findOne({ email })
      if (existing) {
        return NextResponse.json({
          ok: true,
          message: 'You are already on the list.',
          member: {
            id: existing.id,
            email: existing.email,
            referralCode: existing.referralCode,
            position: existing.position,
            badge: existing.badge,
            invitedCount: existing.invitedCount || 0,
          },
        }, { headers: cors })
      }

      const position = (await db.collection('waitlist').countDocuments()) + 1
      const referralCode = makeReferralCode()
      const badge = position <= 1000 ? 'Founding Member' : 'Member'

      const member = {
        id: uuidv4(),
        email,
        whatsapp,
        referredBy,
        referralCode,
        position,
        badge,
        invitedCount: 0,
        createdAt: new Date().toISOString(),
      }
      await db.collection('waitlist').insertOne(member)

      if (referredBy) {
        await db.collection('waitlist').updateOne(
          { referralCode: referredBy },
          { $inc: { invitedCount: 1 } }
        )
      }

      // Fire-and-forget welcome email
      const base = process.env.NEXT_PUBLIC_BASE_URL || ''
      sendWelcomeEmail({
        to: email,
        position,
        referralCode,
        referralUrl: `${base}/?ref=${referralCode}`,
        badge,
      }).catch(() => {})

      return NextResponse.json({
        ok: true,
        message: 'Welcome to ADRON.',
        member: { id: member.id, email: member.email, referralCode, position, badge, invitedCount: 0 },
      }, { headers: cors })
    }

    if (route === 'journal') {
      // Admin-protected
      const adminKey = request.headers.get('x-admin-key') || body.adminKey
      if (adminKey !== ADMIN_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors })
      }

      const entry = {
        id: uuidv4(),
        week: Number(body.week) || 0,
        title: body.title || 'Untitled',
        status: body.status || 'in-progress',
        date: body.date || new Date().toISOString().slice(0, 10),
        note: body.note || '',
        createdAt: new Date().toISOString(),
      }

      // Upsert by week
      await db.collection('journal').updateOne(
        { week: entry.week },
        { $set: entry },
        { upsert: true }
      )

      // Optionally broadcast to waitlist (only if broadcast flag)
      if (body.broadcast) {
        const subs = await db.collection('waitlist').find({}, { projection: { _id: 0, email: 1 } }).toArray()
        await Promise.all(subs.map((s) =>
          sendJournalEmail({ to: s.email, week: entry.week, title: entry.title, note: entry.note }).catch(() => {})
        ))
      }

      return NextResponse.json({ ok: true, entry }, { headers: cors })
    }

    if (route === 'founder-desk') {
      const adminKey = request.headers.get('x-admin-key') || body.adminKey
      if (adminKey !== ADMIN_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors })
      }
      const entry = {
        id: uuidv4(),
        week: Number(body.week) || 0,
        title: body.title || 'Untitled',
        url: body.url || '',
        posterUrl: body.posterUrl || '',
        note: body.note || '',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }
      await db.collection('founder_desk').updateOne(
        { week: entry.week },
        { $set: entry },
        { upsert: true }
      )
      return NextResponse.json({ ok: true, entry }, { headers: cors })
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: cors })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: cors })
  }
}
