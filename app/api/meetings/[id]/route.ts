import { NextResponse } from 'next/server'
import { getMeetingById } from '@/lib/meetings-db'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id)
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Meeting id must be a number.' }, { status: 400 })
  const meeting = await getMeetingById(id)
  if (!meeting) return NextResponse.json({ error: 'Meeting not found.' }, { status: 404 })
  return NextResponse.json(meeting)
}
