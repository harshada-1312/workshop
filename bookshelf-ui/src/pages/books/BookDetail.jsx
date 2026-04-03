import { useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useApi from '../../hooks/useApi'
import { getBook, deleteBook } from '../../api/books'
import LoadingSpinner from '../../components/ui/LoadingSpinner'
import ErrorAlert from '../../components/ui/ErrorAlert'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import RatingStars from '../../components/ui/RatingStars'

export default function BookDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showDelete, setShowDelete] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const fetchBook = useCallback(() => getBook(id), [id])
  const { data: book, loading, error } = useApi(fetchBook)

  const handleDelete = async () => {
    try {
      await deleteBook(id)
      navigate('/books')
    } catch (err) {
      setDeleteError(err)
      setShowDelete(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorAlert error={error} />
  if (!book) return null

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link to="/books" className="text-sm text-gray-500 hover:text-gray-700">&larr; Back to Books</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{book.title}</h1>
        </div>
        <div className="flex gap-2">
          <Link to={`/books/${id}/edit`}
            className="rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Edit
          </Link>
          <button onClick={() => setShowDelete(true)}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>

      <ErrorAlert error={deleteError} onDismiss={() => setDeleteError(null)} />

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Badge text={book.genre} />
          <Badge text={book.read_status} variant={book.read_status} />
          {book.rating != null && <RatingStars value={book.rating} readonly />}
        </div>

        <dl className="grid sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Author</dt>
            <dd className="mt-1 text-sm">
              <Link to={`/authors/${book.author.id}`} className="text-indigo-600 hover:text-indigo-800">
                {book.author.first_name} {book.author.last_name}
              </Link>
            </dd>
          </div>
          {book.isbn && <div><dt className="text-sm font-medium text-gray-500">ISBN</dt><dd className="mt-1 text-sm text-gray-900 font-mono">{book.isbn}</dd></div>}
          {book.published_year && <div><dt className="text-sm font-medium text-gray-500">Published Year</dt><dd className="mt-1 text-sm text-gray-900">{book.published_year}</dd></div>}
          {book.page_count && <div><dt className="text-sm font-medium text-gray-500">Pages</dt><dd className="mt-1 text-sm text-gray-900">{book.page_count}</dd></div>}
          <div><dt className="text-sm font-medium text-gray-500">Language</dt><dd className="mt-1 text-sm text-gray-900">{book.language}</dd></div>
          <div><dt className="text-sm font-medium text-gray-500">Date Added</dt><dd className="mt-1 text-sm text-gray-900">{new Date(book.date_added).toLocaleDateString()}</dd></div>
        </dl>

        {book.description && (
          <div className="mt-6">
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">{book.description}</dd>
          </div>
        )}
      </div>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete}
        title="Delete Book" confirmText="Delete" confirmVariant="danger">
        Are you sure you want to delete "{book.title}"? This will also remove it from all collections.
      </Modal>
    </div>
  )
}
