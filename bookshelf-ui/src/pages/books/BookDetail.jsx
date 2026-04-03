import { useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useApi from '../../hooks/useApi'
import { getBook, deleteBook } from '../../api/books'
import { BOOK_COVER_GRADIENTS } from '../../constants'
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
    try { await deleteBook(id); navigate('/books') }
    catch (err) { setDeleteError(err); setShowDelete(false) }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorAlert error={error} />
  if (!book) return null

  const gradient = BOOK_COVER_GRADIENTS[book.id % BOOK_COVER_GRADIENTS.length]

  return (
    <div>
      <Link to="/books" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Books
      </Link>

      <ErrorAlert error={deleteError} onDismiss={() => setDeleteError(null)} />

      {/* Hero banner */}
      <div className={`rounded-2xl bg-gradient-to-r ${gradient} p-8 mb-6 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-sm">{book.title}</h1>
              <Link to={`/authors/${book.author.id}`}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mt-2 text-sm font-medium">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                </svg>
                {book.author.first_name} {book.author.last_name}
              </Link>
              <div className="flex items-center gap-2 mt-3">
                <Badge text={book.genre} />
                <Badge text={book.read_status} variant={book.read_status} />
              </div>
              {book.rating != null && (
                <div className="mt-3">
                  <RatingStars value={book.rating} readonly />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Link to={`/books/${id}/edit`}
                className="rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 text-sm font-medium text-white hover:bg-white/30 transition-colors">
                Edit
              </Link>
              <button onClick={() => setShowDelete(true)}
                className="rounded-xl bg-red-500/80 backdrop-blur-sm border border-red-400/30 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {book.description && (
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Book Details</h2>
            <dl className="space-y-3">
              {book.isbn && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">ISBN</dt>
                  <dd className="text-sm font-mono text-gray-900">{book.isbn}</dd>
                </div>
              )}
              {book.published_year && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Published</dt>
                  <dd className="text-sm font-medium text-gray-900">{book.published_year}</dd>
                </div>
              )}
              {book.page_count && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Pages</dt>
                  <dd className="text-sm font-medium text-gray-900">{book.page_count}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Language</dt>
                <dd className="text-sm font-medium text-gray-900 uppercase">{book.language}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Added</dt>
                <dd className="text-sm text-gray-900">{new Date(book.date_added).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</dd>
              </div>
            </dl>
          </div>

          {/* Author card */}
          <Link to={`/authors/${book.author.id}`}
            className="block bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 hover:shadow-md hover:border-brand-200 transition-all">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Author</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">{book.author.first_name?.charAt(0)}{book.author.last_name?.charAt(0)}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{book.author.first_name} {book.author.last_name}</p>
                {book.author.birth_year && <p className="text-xs text-gray-500">b. {book.author.birth_year}</p>}
              </div>
            </div>
          </Link>
        </div>
      </div>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete}
        title="Delete Book" confirmText="Delete" confirmVariant="danger">
        Are you sure you want to delete "<strong>{book.title}</strong>"? This will also remove it from all collections.
      </Modal>
    </div>
  )
}
