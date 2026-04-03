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

export default function AuthorList() {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('last_name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const fetchAuthors = useCallback(
    (params) => getAuthors(params),
    []
  )

  const params = { page, perPage: 20, sortBy, sortOrder, search: debouncedSearch || undefined }
  const { data: authors, meta, loading, error } = useApi(fetchAuthors, params)

  const handleSortChange = (newSortBy, newOrder) => {
    setSortBy(newSortBy)
    setSortOrder(newOrder)
    setPage(1)
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Authors</h1>
        <Link to="/authors/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 text-center">
          Add Author
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search authors..."
          className="rounded-md border border-gray-300 py-1.5 px-3 text-sm flex-1 focus:ring-indigo-500 focus:border-indigo-500" />
        <SortSelect options={AUTHOR_SORT_OPTIONS} sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
      </div>

      <ErrorAlert error={error} />

      {loading ? <LoadingSpinner /> : authors?.length === 0 ? (
        <EmptyState title="No authors found" description="Try adjusting your search or add a new author."
          action={<Link to="/authors/new" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Add Author</Link>} />
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Books</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Birth Year</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Website</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {authors?.map((author) => (
                <tr key={author.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Link to={`/authors/${author.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                      {author.first_name} {author.last_name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">{author.book_count}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{author.birth_year || '—'}</td>
                  <td className="px-6 py-4 text-sm hidden lg:table-cell">
                    {author.website ? (
                      <a href={author.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline truncate block max-w-xs">
                        {author.website}
                      </a>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && <Pagination page={meta.page} totalPages={meta.total_pages} onPageChange={setPage} />}
    </div>
  )
}
