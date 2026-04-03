import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import useApi from '../../hooks/useApi'
import useDebounce from '../../hooks/useDebounce'
import { getBooks } from '../../api/books'
import { BOOK_SORT_OPTIONS, GENRES, READ_STATUSES } from '../../constants'
import Pagination from '../../components/ui/Pagination'
import SortSelect from '../../components/ui/SortSelect'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import ErrorAlert from '../../components/ui/ErrorAlert'
import Badge from '../../components/ui/Badge'
import RatingStars from '../../components/ui/RatingStars'

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
    page, perPage: 20, sortBy, sortOrder,
    search: debouncedSearch || undefined,
    genre: genre || undefined,
    readStatus: readStatus || undefined,
  }
  const { data: books, meta, loading, error } = useApi(fetchBooks, params)

  const handleSortChange = (newSortBy, newOrder) => {
    setSortBy(newSortBy)
    setSortOrder(newOrder)
    setPage(1)
  }

  const clearFilters = () => {
    setGenre('')
    setReadStatus('')
    setSearch('')
    setPage(1)
  }

  const selectClass = 'rounded-md border border-gray-300 py-1.5 px-3 text-sm text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Books</h1>
        <Link to="/books/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 text-center">
          Add Book
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search books..."
          className="rounded-md border border-gray-300 py-1.5 px-3 text-sm flex-1 focus:ring-indigo-500 focus:border-indigo-500" />
        <SortSelect options={BOOK_SORT_OPTIONS} sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
        <button onClick={() => setShowFilters(!showFilters)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
          Filters {showFilters ? '▲' : '▼'}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white shadow rounded-lg p-4 mb-4 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Genre</label>
            <select value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1) }} className={selectClass}>
              <option value="">All genres</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select value={readStatus} onChange={(e) => { setReadStatus(e.target.value); setPage(1) }} className={selectClass}>
              <option value="">All statuses</option>
              {READ_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <button onClick={clearFilters} className="text-sm text-indigo-600 hover:text-indigo-800">Clear filters</button>
        </div>
      )}

      <ErrorAlert error={error} />

      {loading ? <LoadingSpinner /> : books?.length === 0 ? (
        <EmptyState title="No books found" description="Try adjusting your search or filters."
          action={<Link to="/books/new" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Add Book</Link>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books?.map((book) => (
            <Link to={`/books/${book.id}`} key={book.id}
              className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</div>
              <div className="text-xs text-gray-500 mb-2">{book.author_name}</div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge text={book.genre} />
                <Badge text={book.read_status} variant={book.read_status} />
                {book.published_year && <span className="text-xs text-gray-400">{book.published_year}</span>}
              </div>
              {book.rating != null && <div className="mt-2"><RatingStars value={book.rating} readonly /></div>}
            </Link>
          ))}
        </div>
      )}

      {meta && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">{meta.total_items} books total</span>
          <Pagination page={meta.page} totalPages={meta.total_pages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
