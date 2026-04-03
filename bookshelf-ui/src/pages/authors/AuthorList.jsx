import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import useApi from '../../hooks/useApi'
import useDebounce from '../../hooks/useDebounce'
import { getAuthors } from '../../api/authors'
import { AUTHOR_SORT_OPTIONS } from '../../constants'
import Pagination from '../../components/ui/Pagination'
import SortSelect from '../../components/ui/SortSelect'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import ErrorAlert from '../../components/ui/ErrorAlert'

const AVATAR_COLORS = [
  'from-rose-400 to-pink-500',
  'from-violet-400 to-purple-500',
  'from-blue-400 to-indigo-500',
  'from-emerald-400 to-teal-500',
  'from-amber-400 to-orange-500',
  'from-cyan-400 to-sky-500',
]

export default function AuthorList() {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('last_name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const fetchAuthors = useCallback((params) => getAuthors(params), [])
  const params = { page, perPage: 20, sortBy, sortOrder, search: debouncedSearch || undefined }
  const { data: authors, meta, loading, error } = useApi(fetchAuthors, params)

  const handleSortChange = (newSortBy, newOrder) => {
    setSortBy(newSortBy); setSortOrder(newOrder); setPage(1)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Authors</h1>
          <p className="text-gray-500 text-sm mt-1">Discover the writers behind the books</p>
        </div>
        <Link to="/authors/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:from-brand-600 hover:to-brand-700 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Author
        </Link>
      </div>

      {/* Search & Controls */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by name..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
          </div>
          <SortSelect options={AUTHOR_SORT_OPTIONS} sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
        </div>
      </div>

      <ErrorAlert error={error} />

      {loading ? <LoadingSpinner /> : authors?.length === 0 ? (
        <EmptyState title="No authors found" description="Try adjusting your search or add a new author."
          action={<Link to="/authors/new" className="text-brand-600 hover:text-brand-700 text-sm font-semibold">Add Author &rarr;</Link>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {authors?.map((author) => (
            <Link to={`/authors/${author.id}`} key={author.id}
              className="group bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-brand-200 hover:-translate-y-1 transition-all duration-300 p-5">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[author.id % AVATAR_COLORS.length]} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <span className="text-white font-bold text-sm">
                    {author.first_name?.charAt(0)}{author.last_name?.charAt(0)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 truncate">
                    {author.first_name} {author.last_name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                      {author.book_count} {author.book_count === 1 ? 'book' : 'books'}
                    </span>
                    {author.birth_year && (
                      <span>b. {author.birth_year}{author.death_year ? ` — d. ${author.death_year}` : ''}</span>
                    )}
                  </div>
                  {author.bio && (
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">{author.bio}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {meta && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-3">
          <span className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">{meta.total_items}</span> authors
          </span>
          <Pagination page={meta.page} totalPages={meta.total_pages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
