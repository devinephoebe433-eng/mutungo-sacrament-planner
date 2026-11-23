import { neon } from '@neondatabase/serverless'

export type MeetingType = 'testimony' | 'regular' | 'stake' | 'general' | 'special'
export type Meeting = {
  id: number
  date: string
  meeting_type: MeetingType
  presiding: string
  conducting: string
  announcements: string[]
  opening_hymn: { title: string; number?: number }
  opening_prayer: string
  ward_business: unknown[]
  stake_business: boolean
  sacrament_hymn: { title: string; number?: number }
  speakers: { name: string; topic: string }[]
  closing_hymn: { title: string; number?: number }
  closing_prayer: string
}

function database() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not configured. Add it in Vercel or .env.local.')
  return neon(url)
}

export async function getMeetings(query = '', page = 1, pageSize = 5) {
  const search = `%${query.trim()}%`
  const offset = Math.max(0, page - 1) * pageSize
  const sql = database()
  const rows = await sql`
    SELECT id, date::text, meeting_type, presiding, conducting, announcements,
      opening_hymn, opening_prayer, ward_business, stake_business,
      sacrament_hymn, speakers, closing_hymn, closing_prayer
    FROM meetings
    WHERE ${query.trim() === '' ? true : sql`(
      presiding ILIKE ${search} OR conducting ILIKE ${search} OR meeting_type ILIKE ${search}
      OR speakers::text ILIKE ${search}
    )`}
    ORDER BY date DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `
  const countRows = await sql`
    SELECT COUNT(*)::int AS count FROM meetings
    WHERE ${query.trim() === '' ? true : sql`(
      presiding ILIKE ${search} OR conducting ILIKE ${search} OR meeting_type ILIKE ${search}
      OR speakers::text ILIKE ${search}
    )`}
  `
  return { meetings: rows as Meeting[], total: countRows[0]?.count ?? 0, page, pageSize }
}

export async function getMeetingById(id: number) {
  const sql = database()
  const rows = await sql`
    SELECT id, date::text, meeting_type, presiding, conducting, announcements,
      opening_hymn, opening_prayer, ward_business, stake_business,
      sacrament_hymn, speakers, closing_hymn, closing_prayer
    FROM meetings WHERE id = ${id}
  `
  return (rows[0] as Meeting | undefined) ?? null
}

export async function addMeeting(_meeting: Omit<Meeting, 'id'>) { return null }
export async function updateMeeting(_id: number, _meeting: Partial<Meeting>) { return null }
export async function deleteMeeting(_id: number) { return null }
