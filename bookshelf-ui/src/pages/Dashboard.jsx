import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import useApi from '../hooks/useApi'
import { getBooks } from '../api/books'
import { getAuthors } from '../api/authors'
import { getStats } from '../api/stats'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Badge from '../components/ui/Badge'
import RatingStars from '../components/ui/RatingStars'

const STAT_ICONS = {
  books: (
    <svg className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  authors: (
    <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  collections: (
    <svg className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  ),
  rating: (
    <svg className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ),
}

export default function Dashboard() {
  const fetchRecentBooks = useCallback(() => getBooks({ perPage: 5, sortBy: 'date_added', sortOrder: 'desc' }), [])
  const fetchTopAuthors = useCallback(() => getAuthors({ perPage: 5, sortBy: 'book_count', sortOrder: 'desc' }), [])
  const fetchStats = useCallback(() => getStats(), [])

  const { data: recentBooks, loading: booksLoading } = useApi(fetchRecentBooks)
  const { data: topAuthors, loading: authorsLoading } = useApi(fetchTopAuthors)
  const { data: stats } = useApi(fetchStats)

  // Compute quick stats from loaded data when /api/stats is unavailable
  const quickStats = {
    total_books: stats?.total_books ?? (recentBooks ? '...' : '--'),
    total_authors: stats?.total_authors ?? (topAuthors ? '...' : '--'),
    total_collections: stats?.total_collections ?? '--',
    average_rating: stats?.average_rating,
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to BookShelf</h1>
        <p className="mt-2 text-gray-500">Your personal library at a glance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={STAT_ICONS.books} label="Total Books" value={quickStats.total_books}
          color="bg-indigo-50 border-indigo-200" link="/books" />
        <StatCard icon={STAT_ICONS.authors} label="Total Authors" value={quickStats.total_authors}
          color="bg-emerald-50 border-emerald-200" link="/authors" />
        <StatCard icon={STAT_ICONS.collections} label="Collections" value={quickStats.total_collections}
          color="bg-amber-50 border-amber-200" link="/collections" />
        <StatCard icon={STAT_ICONS.rating} label="Avg Rating" value={quickStats.average_rating?.toFixed(1) || 'N/A'}
          color="bg-yellow-50 border-yellow-200" />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link to="/books/new" className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 shadow-sm transition-colors">
          <span>+</span> Add Book
        </Link>
        <Link to="/authors/new" className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
          <span>+</span> Add Author
        </Link>
        <Link to="/search" className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
          Search Library
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Books */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recently Added</h2>
            <Link to="/books" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View all &rarr;</Link>
          </div>
          {booksLoading ? <LoadingSpinner size="sm" /> : (
            <ul className="space-y-3">
              {recentBooks?.map((book) => (
                <li key={book.id}>
                  <Link to={`/books/${book.id}`} className="group flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors -mx-3">
                    <div className="flex-shrink-0 w-10 h-14 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded flex items-center justify-center">
                      <span className="text-indigo-600 text-xs font-bold">{book.title.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm group-hover:text-indigo-600 truncate">{book.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{book.author_name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge text={book.genre} />
                        <Badge text={book.read_status} variant={book.read_status} />
                        {book.rating != null && <RatingStars value={book.rating} readonly />}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
              {recentBooks?.length === 0 && (
                <li className="text-center py-8">
                  <p className="text-sm text-gray-500 mb-3">Your library is empty</p>
                  <Link to="/books/new" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Add your first book &rarr;</Link>
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Top Authors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Top Authors</h2>
            <Link to="/authors" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View all &rarr;</Link>
          </div>
          {authorsLoading ? <LoadingSpinner size="sm" /> : (
            <ul className="space-y-3">
              {topAuthors?.map((author, idx) => (
                <li key={author.id}>
                  <Link to={`/authors/${author.id}`} className="group flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors -mx-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
                      <span className="text-emerald-700 text-sm font-bold">
                        {author.first_name.charAt(0)}{author.last_name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm group-hover:text-indigo-600">
                        {author.first_name} {author.last_name}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {author.book_count} {author.book_count === 1 ? 'book' : 'books'}
                        {author.birth_year && ` · Born ${author.birth_year}`}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-gray-200 group-hover:text-indigo-200">
                      #{idx + 1}
                    </div>
                  </Link>
                </li>
              ))}
              {topAuthors?.length === 0 && (
                <li className="text-center py-8">
                  <p className="text-sm text-gray-500 mb-3">No authors yet</p>
                  <Link to="/authors/new" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Add an author &rarr;</Link>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Reading Status summary if stats available */}
      {stats?.books_by_status && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Reading Progress</h2>
          <div className="flex gap-6">
            {Object.entries(stats.books_by_status).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2">
                <Badge text={status} variant={status} />
                <span className="text-xl font-bold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
          {stats.total_books > 0 && (
            <div className="mt-4 w-full bg-gray-200 rounded-full h-3 flex overflow-hidden">
              {stats.books_by_status.read > 0 && (
                <div className="bg-green-500 h-full transition-all" style={{ width: `${(stats.books_by_status.read / stats.total_books) * 100}%` }} />
              )}
              {stats.books_by_status.reading > 0 && (
                <div className="bg-blue-500 h-full transition-all" style={{ width: `${(stats.books_by_status.reading / stats.total_books) * 100}%` }} />
              )}
              {stats.books_by_status.unread > 0 && (
                <div className="bg-gray-400 h-full transition-all" style={{ width: `${(stats.books_by_status.unread / stats.total_books) * 100}%` }} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, color, link }) {
  const content = (
    <div className={`rounded-xl border p-5 transition-shadow hover:shadow-md ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-gray-600">{label}</div>
          <div className="text-3xl font-bold text-gray-900 mt-1">{value}</div>
        </div>
        {icon}
      </div>
    </div>
  )
  return link ? <Link to={link}>{content}</Link> : content
}
