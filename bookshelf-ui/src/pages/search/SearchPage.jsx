import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import useDebounce from '../../hooks/useDebounce'
import { getBooks } from '../../api/books'
import { getAuthors } from '../../api/authors'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Badge from '../../components/ui/Badge'
import RatingStars from '../../components/ui/RatingStars'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const debouncedQuery = useDebounce(query, 400)
  const [results, setResults] = useState({ books: [], authors: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (debouncedQuery.length < 2) { setResults({ books: [], authors: [] }); return }
    setSearchParams({ q: debouncedQuery }, { replace: true })
    setLoading(true)
    Promise.all([
      getBooks({ search: debouncedQuery, perPage: 20 }).catch(() => ({ data: [] })),
      getAuthors({ search: debouncedQuery, perPage: 20 }).catch(() => ({ data: [] })),
    ]).then(([booksRes, authorsRes]) => {
      setResults({ books: booksRes.data || [], authors: authorsRes.data || [] })
      setLoading(false)
    })
  }, [debouncedQuery])

  const totalResults = results.books.length + results.authors.length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Search</h1>
        <p className="text-gray-500 text-sm mt-1">Find books, authors, and more</p>
      </div>

      <div className="relative mb-8">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} autoFocus
          placeholder="Type to search books and authors..."
          className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-base shadow-sm focus:border-brand-300 focus:ring-4 focus:ring-brand-100 focus:outline-none placeholder-gray-400" />
        {query.length > 0 && query.length < 2 && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">min 2 chars</span>
        )}
      </div>

      {loading ? <LoadingSpinner /> : debouncedQuery.length >= 2 ? (
        <div>
          <p className="text-sm text-gray-500 mb-6">
            Found <span className="font-semibold text-gray-700">{totalResults}</span> results for "<span className="font-medium">{debouncedQuery}</span>"
          </p>

          {results.authors.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Authors ({results.authors.length})</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {results.authors.map((author) => (
                  <Link to={`/authors/${author.id}`} key={author.id}
                    className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 hover:shadow-md hover:border-brand-200 transition-all">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{author.first_name?.charAt(0)}{author.last_name?.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-brand-700">{author.first_name} {author.last_name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{author.book_count} books</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.books.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Books ({results.books.length})</h2>
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm divide-y divide-gray-100 overflow-hidden">
                {results.books.map((book) => (
                  <Link to={`/books/${book.id}`} key={book.id}
                    className="group flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-14 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{book.title.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 group-hover:text-brand-700 truncate">{book.title}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{book.author_name}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge text={book.genre} size="xs" />
                        <Badge text={book.read_status} variant={book.read_status} size="xs" />
                      </div>
                    </div>
                    {book.rating != null && <RatingStars value={book.rating} readonly />}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="text-center py-16">
              <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className="text-gray-500 mt-4">No results found for "{debouncedQuery}"</p>
              <p className="text-gray-400 text-sm mt-1">Try different keywords or check your spelling</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}
