// Email service — templates + send().
// Plug in a real provider (Resend / SendGrid) when an API key is provided via
// EMAIL_API_KEY in /app/.env. Until then it logs.

const FROM = process.env.EMAIL_FROM || 'ADRON <hello@adron.studio>'
const PROVIDER = process.env.EMAIL_PROVIDER || 'resend' // 'resend' | 'sendgrid' | 'mock'
const KEY = process.env.EMAIL_API_KEY || ''

function welcomeHtml({ position, referralCode, referralUrl, badge }) {
  return `<!DOCTYPE html><html><body style="margin:0;background:#000;color:#f5f5f5;font-family:-apple-system,Inter,system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:60px 32px;text-align:center;">
    <div style="font-size:11px;letter-spacing:0.6em;color:#888;text-transform:uppercase;margin-bottom:48px;">ADRON</div>
    <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-weight:300;font-size:42px;line-height:1.15;margin:0 0 24px;color:#f5f5f5;">Welcome to the beginning.</h1>
    <p style="color:#bbb;line-height:1.7;margin:0 0 36px;">You are <strong style="color:#fff;">#${position}</strong>. A ${badge}. Most brands appear only when they have something to sell. We are choosing to appear before that. Thank you for arriving early.</p>
    <div style="background:#0b0b0b;border:1px solid #1c1c1c;padding:24px;margin:32px 0;border-radius:4px;">
      <div style="font-size:10px;letter-spacing:0.4em;color:#777;text-transform:uppercase;margin-bottom:8px;">Your referral code</div>
      <div style="font-family:'Courier New',monospace;font-size:18px;color:#fff;letter-spacing:0.2em;">${referralCode}</div>
      <a href="${referralUrl}" style="display:inline-block;margin-top:18px;color:#f5f5f5;text-decoration:none;font-size:11px;letter-spacing:0.3em;border:1px solid #333;padding:10px 22px;text-transform:uppercase;">Share your link</a>
    </div>
    <p style="color:#777;font-size:13px;line-height:1.7;">Invite 3 friends and you unlock <strong style="color:#fff;">early access</strong> — a private window before the public launch.</p>
    <div style="margin-top:60px;color:#444;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;">Designed in India · Built for the world</div>
  </div></body></html>`
}

function journalHtml({ week, title, note }) {
  return `<!DOCTYPE html><html><body style="margin:0;background:#000;color:#f5f5f5;font-family:Inter,system-ui,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:60px 32px;">
    <div style="font-size:10px;letter-spacing:0.5em;color:#888;text-transform:uppercase;">Week ${week} · Journal</div>
    <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-weight:300;font-size:36px;color:#fff;margin:20px 0 24px;">${title}</h1>
    <p style="color:#bbb;line-height:1.8;">${note}</p>
    <div style="margin-top:60px;color:#444;font-size:10px;letter-spacing:0.4em;text-transform:uppercase;">— ADRON</div>
  </div></body></html>`
}

async function sendResend({ to, subject, html }) {
  if (!KEY) return { ok: false, mocked: true }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  })
  return { ok: res.ok, status: res.status }
}

async function sendSendgrid({ to, subject, html }) {
  if (!KEY) return { ok: false, mocked: true }
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: FROM.match(/<(.+)>/)?.[1] || FROM, name: 'ADRON' },
      subject,
      content: [{ type: 'text/html', value: html }],
    }),
  })
  return { ok: res.ok, status: res.status }
}

export async function sendEmail({ to, subject, html }) {
  if (!KEY || PROVIDER === 'mock') {
    console.log(`[EMAIL:MOCK] to=${to} subject="${subject}"`)
    return { ok: true, mocked: true }
  }
  try {
    if (PROVIDER === 'sendgrid') return await sendSendgrid({ to, subject, html })
    return await sendResend({ to, subject, html })
  } catch (e) {
    console.error('[EMAIL] send error', e?.message)
    return { ok: false, error: e?.message }
  }
}

export async function sendWelcomeEmail({ to, position, referralCode, referralUrl, badge }) {
  return sendEmail({
    to,
    subject: 'Welcome to ADRON — you are early.',
    html: welcomeHtml({ position, referralCode, referralUrl, badge }),
  })
}

export async function sendJournalEmail({ to, week, title, note }) {
  return sendEmail({
    to,
    subject: `Week ${week} · ${title}`,
    html: journalHtml({ week, title, note }),
  })
}
