import { useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useApi from '../../hooks/useApi'
import { getCollection, deleteCollection, removeBookFromCollection } from '../../api/collections'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorAlert from '../../components/ui/ErrorAlert'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'

export default function CollectionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showDelete, setShowDelete] = useState(false)
  const [actionError, setActionError] = useState(null)

  const fetchCollection = useCallback(() => getCollection(id), [id])
  const { data: collection, loading, error, refetch } = useApi(fetchCollection)

  const handleDelete = async () => {
    try {
      await deleteCollection(id)
      navigate('/collections')
    } catch (err) {
      setActionError(err)
      setShowDelete(false)
    }
  }

  const handleRemoveBook = async (bookId) => {
    try {
      await removeBookFromCollection(id, bookId)
      refetch()
    } catch (err) {
      setActionError(err)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorAlert error={error} />
  if (!collection) return null

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link to="/collections" className="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Collections</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{collection.name}</h1>
        </div>
        <div className="flex gap-2">
          <Link to={`/collections/${id}/edit`}
            className="rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Edit
          </Link>
          <button onClick={() => setShowDelete(true)}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>

      <ErrorAlert error={actionError} onDismiss={() => setActionError(null)} />

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        {collection.description && <p className="text-sm text-gray-600 mb-3">{collection.description}</p>}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{collection.is_public ? 'Public' : 'Private'}</span>
          <span>{collection.books?.length || 0} books</span>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Books in Collection</h2>
        {collection.books?.length === 0 ? (
          <p className="text-sm text-gray-500">No books in this collection yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {collection.books?.map((book, idx) => (
              <li key={book.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-6 text-right">{idx + 1}.</span>
                  <div>
                    <Link to={`/books/${book.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                      {book.title}
                    </Link>
                    <div className="text-xs text-gray-500">{book.author_name}</div>
                  </div>
                </div>
                <button onClick={() => handleRemoveBook(book.id)}
                  className="text-xs text-red-500 hover:text-red-700">Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete}
        title="Delete Collection" confirmText="Delete" confirmVariant="danger">
        Are you sure you want to delete "{collection.name}"? Books will not be deleted.
      </Modal>
    </div>
  )
}
