import type { Metadata } from 'next'
import './globals.css'
import { EditorProvider } from '@/lib/editorContext'

export const metadata: Metadata = {
  title: 'Design Studio Suite',
  description: 'Unified design tool combining photo editing, color palette design, and vector graphics',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <EditorProvider>
          {children}
        </EditorProvider>
      </body>
    </html>
  )
}
