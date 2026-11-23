import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="shell hero">
      <p className="eyebrow">Mutungo Ward</p>
      <h1>Prepare a meaningful sacrament meeting.</h1>
      <p className="lede">Keep every meeting detail, assignment, and program item together in one calm workspace.</p>
      <Link className="button" href="/meetings">View meetings</Link>
    </main>
  )
}
