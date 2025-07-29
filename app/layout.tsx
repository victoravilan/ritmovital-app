import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './global.css'

export const metadata: Metadata = {
  title: 'RitmoVital',
  description: 'Descubre tus ciclos naturales y optimiza tu vida diaria',
  generator: 'v0.dev',
  icons: {
    icon: '/img/icono-ritmoovital.png',
    shortcut: '/img/icono-ritmoovital.png',
    apple: '/img/icono-ritmoovital.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {  
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
      <body>{children}</body>
    </html>
  )
}