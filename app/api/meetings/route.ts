import { NextResponse } from 'next/server'
import { getMeetings } from '@/lib/meetings-db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')
  const query = date ?? searchParams.get('query') ?? ''
  const result = await getMeetings(query, 1, 100)
  return NextResponse.json(result.meetings)
}
