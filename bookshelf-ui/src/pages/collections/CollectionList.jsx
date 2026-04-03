import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import useApi from '../../hooks/useApi'
import useDebounce from '../../hooks/useDebounce'
import { getCollections } from '../../api/collections'
import { COLLECTION_SORT_OPTIONS } from '../../constants'
import Pagination from '../../components/ui/Pagination'
import SortSelect from '../../components/ui/SortSelect'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import EmptyState from '../../components/ui/EmptyState'
import ErrorAlert from '../../components/ui/ErrorAlert'

export default function CollectionList() {
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)

  const fetchCollections = useCallback((params) => getCollections(params), [])
  const params = { page, perPage: 20, sortBy, sortOrder, search: debouncedSearch || undefined }
  const { data: collections, meta, loading, error } = useApi(fetchCollections, params)

  const handleSortChange = (newSortBy, newOrder) => {
    setSortBy(newSortBy)
    setSortOrder(newOrder)
    setPage(1)
  }

  const apiUnavailable = error?.code === 'NETWORK_ERROR' || error?.code === 'NOT_FOUND'

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
        <Link to="/collections/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 text-center">
          New Collection
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search collections..."
          className="rounded-md border border-gray-300 py-1.5 px-3 text-sm flex-1 focus:ring-indigo-500 focus:border-indigo-500" />
        <SortSelect options={COLLECTION_SORT_OPTIONS} sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />
      </div>

      {apiUnavailable ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800 font-medium">Collections API not available yet</p>
          <p className="text-yellow-600 text-sm mt-1">The collections endpoints have not been implemented in the backend.</p>
        </div>
      ) : (
        <>
          <ErrorAlert error={error} />
          {loading ? <LoadingSpinner /> : collections?.length === 0 ? (
            <EmptyState title="No collections found" description="Create your first collection to organize books." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collections?.map((col) => (
                <Link to={`/collections/${col.id}`} key={col.id}
                  className="bg-white shadow rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold text-gray-900">{col.name}</div>
                    {col.is_public && <span className="text-xs text-green-600">Public</span>}
                  </div>
                  {col.description && <p className="text-xs text-gray-500 line-clamp-2 mb-2">{col.description}</p>}
                  <div className="text-xs text-gray-400">{col.book_count} books</div>
                </Link>
              ))}
            </div>
          )}
          {meta && <Pagination page={meta.page} totalPages={meta.total_pages} onPageChange={setPage} />}
        </>
      )}
    </div>
  )
}
