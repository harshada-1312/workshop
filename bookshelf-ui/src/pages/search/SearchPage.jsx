import { useState, useCallback, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import useDebounce from '../../hooks/useDebounce'
import { getBooks } from '../../api/books'
import { getAuthors } from '../../api/authors'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import Badge from '../../components/ui/Badge'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const debouncedQuery = useDebounce(query, 400)
  const [results, setResults] = useState({ books: [], authors: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults({ books: [], authors: [] })
      return
    }

    setSearchParams({ q: debouncedQuery }, { replace: true })
    setLoading(true)

    Promise.all([
      getBooks({ search: debouncedQuery, perPage: 20 }).catch(() => ({ data: [] })),
      getAuthors({ search: debouncedQuery, perPage: 20 }).catch(() => ({ data: [] })),
    ]).then(([booksRes, authorsRes]) => {
      setResults({
        books: booksRes.data || [],
        authors: authorsRes.data || [],
      })
      setLoading(false)
    })
  }, [debouncedQuery])

  const totalResults = results.books.length + results.authors.length

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Search</h1>

      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
        placeholder="Search books, authors... (min 2 characters)"
        autoFocus
        className="w-full rounded-md border border-gray-300 py-2 px-4 text-sm focus:ring-indigo-500 focus:border-indigo-500 mb-6" />

      {loading ? <LoadingSpinner /> : debouncedQuery.length >= 2 ? (
        <div>
          <p className="text-sm text-gray-500 mb-4">{totalResults} results for "{debouncedQuery}"</p>

          {results.authors.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Authors ({results.authors.length})</h2>
              <div className="bg-white shadow rounded-lg divide-y divide-gray-100">
                {results.authors.map((author) => (
                  <Link to={`/authors/${author.id}`} key={author.id} className="block px-4 py-3 hover:bg-gray-50">
                    <div className="text-sm font-medium text-indigo-600">{author.first_name} {author.last_name}</div>
                    <div className="text-xs text-gray-500">{author.book_count} books</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {results.books.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Books ({results.books.length})</h2>
              <div className="bg-white shadow rounded-lg divide-y divide-gray-100">
                {results.books.map((book) => (
                  <Link to={`/books/${book.id}`} key={book.id} className="block px-4 py-3 hover:bg-gray-50">
                    <div className="text-sm font-medium text-indigo-600">{book.title}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-2">
                      <span>{book.author_name}</span>
                      <Badge text={book.genre} />
                      <Badge text={book.read_status} variant={book.read_status} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No results found for "{debouncedQuery}"</p>
            </div>
          )}
        </div>
      ) : query.length > 0 ? (
        <p className="text-sm text-gray-500">Type at least 2 characters to search</p>
      ) : null}
    </div>
  )
}
