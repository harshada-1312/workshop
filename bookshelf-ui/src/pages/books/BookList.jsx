import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import useApi from '../../hooks/useApi'
import useDebounce from '../../hooks/useDebounce'
import { getBooks } from '../../api/books'
import { BOOK_SORT_OPTIONS, GENRES, READ_STATUSES, BOOK_COVER_GRADIENTS } from '../../constants'
import Pagination from '../../components/ui/Pagination'
import SortSelect from '../../components/ui/SortSelect'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import ErrorAlert from '../../components/ui/ErrorAlert'
import Badge from '../../components/ui/Badge'
import RatingStars from '../../components/ui/RatingStars'

function getGradient(id) {
  return BOOK_COVER_GRADIENTS[id % BOOK_COVER_GRADIENTS.length]
}

export default function BookList() {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('date_added')
  const [sortOrder, setSortOrder] = useState('desc')
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [readStatus, setReadStatus] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const debouncedSearch = useDebounce(search)

  const fetchBooks = useCallback((params) => getBooks(params), [])
  const params = {
    page, perPage: 18, sortBy, sortOrder,
    search: debouncedSearch || undefined,
    genre: genre || undefined,
    readStatus: readStatus || undefined,
  }
  const { data: books, meta, loading, error } = useApi(fetchBooks, params)

  const handleSortChange = (newSortBy, newOrder) => {
    setSortBy(newSortBy); setSortOrder(newOrder); setPage(1)
  }

  const clearFilters = () => {
    setGenre(''); setReadStatus(''); setSearch(''); setPage(1)
  }

  const hasActiveFilters = genre || readStatus || search
  const selectClass = 'rounded-xl border border-gray-200 bg-gray-50 py-2 px-3 text-sm text-gray-900 focus:bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-100 focus:outline-none'

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Books</h1>
          <p className="text-gray-500 text-sm mt-1">Browse and manage your library</p>
        </div>
        <Link to="/books/new"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:from-brand-600 hover:to-brand-700 transition-all">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Book
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
              placeholder="Search by title or description..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
          </div>
          <SortSelect options={BOOK_SORT_OPTIONS} sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
          <button onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
              hasActiveFilters ? 'border-brand-200 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Filters
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-brand-500" />}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Genre</label>
              <select value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1) }} className={selectClass}>
                <option value="">All genres</option>
                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Status</label>
              <select value={readStatus} onChange={(e) => { setReadStatus(e.target.value); setPage(1) }} className={selectClass}>
                <option value="">All statuses</option>
                {READ_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-brand-600 hover:text-brand-700 font-medium pb-0.5">
                Clear all
              </button>
            )}
          </div>
        )}
      </div>

      <ErrorAlert error={error} />

      {loading ? <LoadingSpinner /> : books?.length === 0 ? (
        <EmptyState title="No books found" description={hasActiveFilters ? 'Try adjusting your filters.' : 'Start building your library!'}
          action={<Link to="/books/new" className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 text-sm font-semibold">Add your first book &rarr;</Link>} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {books?.map((book) => (
            <Link to={`/books/${book.id}`} key={book.id}
              className="group bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-brand-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              {/* Cover gradient bar */}
              <div className={`h-2 bg-gradient-to-r ${getGradient(book.id)}`} />
              <div className="p-5">
                {/* Title & Author */}
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 line-clamp-2 leading-snug">{book.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{book.author_name}</p>

                {/* Badges */}
                <div className="flex items-center gap-1.5 flex-wrap mt-3">
                  <Badge text={book.genre} />
                  <Badge text={book.read_status} variant={book.read_status} />
                </div>

                {/* Bottom row */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {book.published_year && <span>{book.published_year}</span>}
                    {book.page_count && <span>{book.page_count}p</span>}
                    {book.language && book.language !== 'en' && (
                      <span className="uppercase font-medium">{book.language}</span>
                    )}
                  </div>
                  {book.rating != null && <RatingStars value={book.rating} readonly />}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {meta && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-3">
          <span className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">{((meta.page - 1) * meta.per_page) + 1}–{Math.min(meta.page * meta.per_page, meta.total_items)}</span> of <span className="font-medium text-gray-700">{meta.total_items}</span> books
          </span>
          <Pagination page={meta.page} totalPages={meta.total_pages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
