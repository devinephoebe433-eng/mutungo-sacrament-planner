'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'

export default function MeetingSearch() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const updateSearch = useDebouncedCallback((value: string) => {
    const next = new URLSearchParams(params.toString())
    if (value.trim()) next.set('query', value.trim())
    else next.delete('query')
    next.delete('page')
    router.replace(`${pathname}?${next.toString()}`)
  }, 350)
  return <label className="search-label"><span>Search meetings</span><input aria-label="Search meetings by speaker, leader, or meeting type" defaultValue={params.get('query') ?? ''} onChange={(event) => updateSearch(event.target.value)} placeholder="Try “regular” or a speaker name" /></label>
}
