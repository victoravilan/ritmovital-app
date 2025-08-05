import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Equilibrio Vital Pro - Comparación Avanzada de Biorritmos',
  description: 'Versión profesional para comparar biorritmos de múltiples personas. Análisis grupal, recomendaciones personalizadas y funciones avanzadas.',
  applicationName: 'Equilibrio Vital Pro',
  keywords: ['biorritmos', 'comparación', 'análisis grupal', 'bienestar', 'profesional'],
}

export default function ProLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}