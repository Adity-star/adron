import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata = {
  title: 'ADRON — The beginning of something timeless',
  description: 'Crafted for those who value quality over trends. Designed in India. Built for the world.',
  openGraph: {
    title: 'ADRON — Crafted for those who value quality over trends',
    description: 'You are witnessing the birth of a future global fashion house.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-black text-neutral-100 antialiased font-sans selection:bg-white selection:text-black">
        {children}
        <Toaster theme="dark" position="bottom-center" />
        <Analytics />
      </body>
    </html>
  )
}
