import Link from 'next/link'

export default function Pagination({ page, total, pageSize, query }: { page: number; total: number; pageSize: number; query: string }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const href = (nextPage: number) => `/meetings?${new URLSearchParams({ ...(query ? { query } : {}), ...(nextPage > 1 ? { page: String(nextPage) } : {}) }).toString()}`
  return <nav className="pagination" aria-label="Meeting list pagination"><span>Page {page} of {pages}</span><div><Link className={page <= 1 ? 'disabled' : ''} aria-disabled={page <= 1} href={page > 1 ? href(page - 1) : href(1)}>Previous</Link><Link className={page >= pages ? 'disabled' : ''} aria-disabled={page >= pages} href={page < pages ? href(page + 1) : href(pages)}>Next</Link></div></nav>
}
