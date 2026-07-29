import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Design Studio Suite',
  description: 'Unified design tool combining photo editing, color palette design, and vector graphics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
