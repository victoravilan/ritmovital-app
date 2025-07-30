import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './global.css'

export const metadata: Metadata = {
  title: 'Equilibrio Vital con Anand',
  description: 'Descubre tu bienestar holístico con un guía virtual. Explora salud, astrología, sugerencias y cita motivadora.',
  generator: 'Next.js',
  applicationName: 'Equilibrio Vital',
  keywords: ['bienestar', 'holístico', 'salud', 'astrología', 'motivación', 'equilibrio'],
  authors: [{ name: 'Equilibrio Vital' }],
  creator: 'Equilibrio Vital',
  publisher: 'Equilibrio Vital',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/img/icono-ritmoovital.png', sizes: '32x32', type: 'image/png' },
      { url: '/img/icono-ritmoovital.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/img/icono-ritmoovital.png',
    apple: [
      { url: '/img/icono-ritmoovital.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  themeColor: '#8B5CF6',
  colorScheme: 'dark',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {  
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Equilibrio Vital" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#8B5CF6" />
        <meta name="msapplication-TileImage" content="/img/icono-ritmoovital.png" />
        <link rel="apple-touch-icon" href="/img/icono-ritmoovital.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/img/icono-ritmoovital.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/img/icono-ritmoovital.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/img/icono-ritmoovital.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}