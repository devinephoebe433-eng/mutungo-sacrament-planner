import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <section className="admin-shell"><div className="admin-heading"><p className="eyebrow">Leader tools</p><Link href="/meetings">← Back to meetings</Link></div>{children}</section>
}
