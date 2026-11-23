import Link from 'next/link'
import MeetingSearch from '@/components/MeetingSearch'
import Pagination from '@/components/Pagination'
import { getMeetings } from '@/lib/meetings-db'

export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<{ query?: string; page?: string }> }

export default async function MeetingsPage({ searchParams }: Props) {
  const params = await searchParams
  const query = params.query ?? ''
  const page = Math.max(1, Number(params.page ?? '1') || 1)
  const result = await getMeetings(query, page)
  return <main className="shell"><div className="page-heading"><div><p className="eyebrow">Meeting records</p><h1>Plan with purpose.</h1><p className="lede">Five meetings per page, with every filter preserved in the URL.</p></div><Link className="button" href="/meetings/new">Create meeting</Link></div><MeetingSearch /><section className="meeting-list" aria-live="polite">{result.meetings.length ? result.meetings.map((meeting) => <Link className="meeting-card" href={`/meetings/${meeting.id}`} key={meeting.id}><div><p className="date">{meeting.date}</p><h2>{meeting.meeting_type} meeting</h2><p>Presiding: {meeting.presiding} · Conducting: {meeting.conducting}</p></div><span aria-hidden="true">→</span></Link>) : <div className="empty-state">No meetings matched “{query}”.</div>}</section><Pagination page={page} total={result.total} pageSize={result.pageSize} query={query} /></main>
}
