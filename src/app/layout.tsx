import './globals.css'
import type { Metadata } from 'next'

import { SiteTitle } from './_utils/constants'

export const metadata: Metadata = {
  title: SiteTitle,
  description: 'A Sudomemo clone for viewing legacy Flipnotes. ' +
    'Built with Next.js, Tailwind CSS, and TypeScript.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-main-online">
        {children}
      </body>
    </html>
  )
}
