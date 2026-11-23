import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mutungo Sacrament Planner',
  description: 'Plan and share clear sacrament meeting programs.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
