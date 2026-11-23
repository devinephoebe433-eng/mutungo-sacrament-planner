import Link from 'next/link'

export default function MeetingsLayout({ children }: { children: React.ReactNode }) {
  return <><header className="topbar"><Link href="/" className="brand">Mutungo Ward</Link><nav aria-label="Main navigation"><Link href="/meetings">Meetings</Link><Link href="/meetings/current">This Sunday</Link><Link href="/meetings/new">Leader tools</Link></nav></header>{children}</>
}
