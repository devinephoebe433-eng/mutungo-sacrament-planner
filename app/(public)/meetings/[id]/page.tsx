import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getMeetingById } from '@/lib/meetings-db'

export const dynamic = 'force-dynamic'

export default async function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id)
  if (!Number.isInteger(id)) notFound()
  const meeting = await getMeetingById(id)
  if (!meeting) notFound()
  return <main className="shell detail"><Link href="/meetings" className="back-link">← All meetings</Link><p className="eyebrow">{meeting.date} · {meeting.meeting_type}</p><h1>Sacrament meeting</h1><div className="detail-grid"><section><h2>Leadership</h2><p><strong>Presiding</strong><br />{meeting.presiding}</p><p><strong>Conducting</strong><br />{meeting.conducting}</p></section><section><h2>Program</h2><p><strong>Opening hymn</strong><br />{meeting.opening_hymn.title}</p><p><strong>Opening prayer</strong><br />{meeting.opening_prayer}</p><p><strong>Speakers</strong><br />{meeting.speakers.map((speaker) => `${speaker.name} — ${speaker.topic}`).join(' · ')}</p><p><strong>Closing hymn</strong><br />{meeting.closing_hymn.title}</p><p><strong>Closing prayer</strong><br />{meeting.closing_prayer}</p></section></div></main>
}
