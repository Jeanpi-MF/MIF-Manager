import type { Metadata } from 'next'
import { DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', weight: ['300','400','500','600'] })
const dmMono = DM_Mono({ subsets: ['latin'], variable: '--font-dm-mono', weight: ['400','500'] })

export const metadata: Metadata = {
  title: 'MIF Manager — Xerox',
  description: 'Gestión de MIFs y equivalencias Xerox para el área de pre venta',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body className="font-sans bg-bg text-gray-200 antialiased">{children}</body>
    </html>
  )
}
